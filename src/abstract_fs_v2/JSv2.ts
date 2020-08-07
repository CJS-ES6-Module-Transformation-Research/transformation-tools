import {generate} from "escodegen";
import {parseModule, parseScript} from "esprima";
import {Directive, ModuleDeclaration, Program, Statement, VariableDeclaration} from "estree";
import {existsSync} from "fs";
import {basename, dirname, join, relative} from "path";
import {JPP} from "../../index";
import {InfoTracker} from "../InfoTracker";
import {API} from "../transformations/export_transformations/API";
// test_resources.import {ExportRegistry} from "../transformations/export_transformations/ExportRegistry.js";
import {API_TYPE, ExportBuilder} from "../transformations/export_transformations/ExportsBuilder";
import {built_ins, ImportManager} from "../transformations/import_transformations/ImportManager";
import {AbstractDataFile} from './Abstractions'
import {Dir} from './Dirv2'
import {ModuleAPIMap} from "./Factory";
import {FileType, MetaData, SerializedJSData} from "./interfaces";
import {Namespace} from "./Namespace";

type script_or_module = "script" | "module"


export class JSFile extends AbstractDataFile {
	private api: API;
	private apiMap: ModuleAPIMap;


	getInfoTracker(): InfoTracker {
		return this.r_tracker;
	}

	private readonly r_tracker: InfoTracker;
	private readonly ast: Program;
	private shebang: string;
	private isStrict: boolean = false;//TODO might be unnnecssary--find purposes
	private potentialPrims: VariableDeclaration[] = []
	private toAddToTop: (Directive | Statement | ModuleDeclaration)[] = []
	private toAddToBottom: (Directive | Statement | ModuleDeclaration)[] = []

	private stringReplace: { [key: string]: string } = {};
	private replacer: (s: string) => string = (s) => s;

	private imports: ImportManager
	private exports: ExportBuilder;
	private to_insert_copyByValue: VariableDeclaration[] = []
	// private exportRegistry:ExportRegistry

	private namespace: Namespace
	private moduleType: script_or_module;

	private isShebang: RegExp = /^#!.*/

	constructor(path: string, b: MetaData, parent: Dir, isModule: boolean, data= '') {
		super(path, b, parent,data);

		this.moduleType = isModule ? "module" : "script" //TODO delete or find purpose

		this.ast = this.parseProgram(this.data, isModule)

		this.r_tracker = new InfoTracker();
		this.removeStrict();
		this.namespace = Namespace.create(this.ast)
		this.apiMap = b.moduleAPIMap
		// this.exportRegistry = new ExportRegistry(this.namespace)
	}

	public createCJSFromIdentifier(moduleID: string): string {
		let parent: Dir = this.parent();
		let parentDir = parent.getAbsolute()
		let base = basename(moduleID, ".json");
		let cjsName = `${base}.cjs`
		if (existsSync(join(parentDir, cjsName))) {
			let i = 0;
			let cjsName = `${base}_${i}.cjs`
			while (existsSync(join(parentDir, cjsName))) {
				cjsName = `${base}_${i}.cjs`
				i++
			}
		}
		let json = join(this.path_abs, moduleID)
		let relativeToRoot = relative(this.parent().getRootDirPath(), json)
		let dirRelativeToRoot = dirname(relativeToRoot)

		//FIXME
		dirRelativeToRoot = dirname(this.getRelative())

		let builder = {
			cjsFileName: `${dirRelativeToRoot}/${basename(json)}.cjs`,
			jsonFileName: relative(this.parent().getRootDirPath(), json),
			dataAsString: `module.exports = require('./${basename(moduleID)}');`,
			dir: parent

		}


		let spawn = this.parent().spawnCJS(builder)

		return join(dirname(moduleID), basename(spawn))

	}

	private removeStrict() {
		this.isStrict = this.ast.body.length !== 0
			&& (this.ast.body[0]['directive'] === "use strict")
		if (this.isStrict) {
			this.ast.body.splice(0, 1)
		}
	}


	public addToTop(toAdd: Directive | Statement | ModuleDeclaration) {
		this.toAddToTop.push(toAdd)
	}

	public addToBottom(toAdd: Directive | Statement | ModuleDeclaration) {
		this.toAddToTop.push(toAdd)
	}

	public setAsModule() {
		this.moduleType = "module";
	}

	public getAST(): Program {
		return this.ast;
	}

	public getSheBang(): string {
		return this.shebang;
	}

	setPotentialPrims(decls: VariableDeclaration[]) {
		this.potentialPrims = decls
	}


	public registerReplace(replace: string, value: string): void {
		// this.stringReplace.set(replace, value);
		console.log(`replace: ${replace} with ${value} at on serialize.`)
		this.stringReplace[replace] = value
	}
	private buildProgram(): Program {
		let addToTop: (Directive | Statement | ModuleDeclaration)[] = []
		this.toAddToTop.forEach(e => addToTop.push(e));
		let addToBottom: (Directive | Statement | ModuleDeclaration)[] = []
		this.toAddToBottom.forEach(e => addToBottom.push(e));

		let newAST = this.ast;
		let body
			= newAST.body;
		newAST.sourceType = this.moduleType

		this.to_insert_copyByValue.reverse().forEach((e) => {
			body.splice(0, 0, e)
		})
		addToTop.reverse().forEach((e) => {
			body.splice(0, 0, e)
		})

		// if (this.exportRegistry.hasDefaultExports()) {
		// 	body.splice(0, 0,{
		// 		type:"VariableDeclaration",
		// 		declarations:[{
		// 			type:"VariableDeclarator",
		// 			id:this.exportRegistry.getDefaultIdentifier()
		// 		}],
		// 		kind:"var"
		// 	})
		// }
		addToBottom.reverse().forEach((e) => {
			body.push(e)
		})


		if (this.moduleType === "module") {
			this.makeExportsArray(newAST.body)
		}

		this.potentialPrims.reverse().forEach((e) => {
			body.splice(0, 0, e)
		})

		this.getImportManager().buildDeclList().forEach(e => {
			newAST.body.splice(0, 0, e)
		})

		//MUST BE LAST
		if (this.isStrict && this.ast.sourceType !== "module") {
			this.ast.body.splice(0, 0,
				JSFile.useStrict
			);
		}
		return newAST;
	}

	protected static readonly useStrict: Directive = {
		"type": "ExpressionStatement",
		"expression": {
			"type": "Literal",
			"value": "use strict",
			"raw": "\"use strict\""
		},
		"directive": "use strict"
	}

	private makeExportsArray(body: (Directive | ModuleDeclaration | Statement)[]) {

		let exports = this.exports.getBuilt();

		if (exports.named_exports && exports.named_exports.specifiers.length > 0) {
			body.push(exports.named_exports)
		}

		if (exports.default_exports && exports.default_exports.declaration) {
			switch (exports.default_exports.declaration.type) {

				case "ObjectExpression":
					if (exports.default_exports.declaration.properties.length === 0) {
						break;
					}

				// not technically necessary however it is the only other possibility at this time... seems explicit.
				case "Identifier":
				default:
					body.push(exports.default_exports)
					break;
			}
		}
	}

	private parseProgram(program: string, isModule): Program {

		if ((this.isShebang as RegExp).test(this.data)) {
			this.shebang = this.isShebang.exec(this.data)[0].toString()
			program = program.replace(this.shebang, '');

		} else {
			this.shebang = '';
		}

		try {
			let _program: Program = (isModule ? parseModule : parseScript)(program)
			return _program
		} catch (e) {
			throw new Error(`Esprima Parse ERROR in file ${this.path_abs} on line ${e.lineNumber}:${e.index} with description ${e.description}\n`)
		}
	}

	requireResolve(moduleIdentifier: string): string {
		let dirnameOf = dirname(this.path_relative)
		return join(dirnameOf, moduleIdentifier)
	}


	/**
	 * returns true if identifier is in the namespace.
	 */
	namespaceContains(identifier: string) {
		return this.namespace.containsName(identifier);
	}

	/**
	 * gets the current object representing the namespace for the ast.
	 */
	getNamespace(): Namespace {
		return this.namespace;
	}


	/**
	 * gets the JSFiles ImportManager.
	 */
	getImportManager(): ImportManager {
		if (!this.imports) {
			let apiFunc =(e:string)=> {
				return this.apiMap.resolveSpecifier(e, this)
			}
			this.imports = new ImportManager(this.apiMap, apiFunc);
		}
		return this.imports;
	}


	getExportBuilder(exportType: API_TYPE.default_only | API_TYPE.synthetic_named = null ): ExportBuilder {
		if (!this.exports) {
			this.exports = new ExportBuilder(exportType);
		}
		return this.exports;
	}


	makeSerializable(): SerializedJSData {
		let program:Program = this.buildProgram()
		let programString: string
		let parseJSON = JSON.parse(JSON.stringify(program,null,3)) as Program
		// console.log(parseJ)
		// programString = generate(parseJSON)
		try {
			if(true) {

				programString = generate(program)

				// console.log  (`PROGRAM LENGTH: ${program.body.length}`)
				// console.log  (program.body)
				// program.body.forEach((node,index:number,arr)=>{
				// 	JPP(node)
				// });
				// // console.log(generate(node))
				if(programString) {
					console.log(this.getRelative())
				} else throw new Error()
			}
		} catch (e) {
			console.log(`CAUGHT generate in file ${this.path_relative} with exception: ${e}`)
			console.log()
			throw e
		}
		if (!programString) {
			throw new Error(`generation issue in file ${this.getRelative()}`)
		}

		for (let key in this.stringReplace) {
			let value = this.stringReplace[key];
			console.log(`replacing ${key} with ${value}`)
			//like test_resources.import.meta.url
			if (!programString) {
				throw new Error(`FAILED: pre replace `)
			}
			programString = programString.replace(key, value)
			if (!programString) {
				throw new Error(`FAILED: trying to : replacing ${key} with ${value}`)
			}

		}

		return {
			relativePath: this.path_relative,
			fileData: programString
		};
	}

	// getAPI(moduleSpecifier: string) {
	// 	return this.parent().getModMap().resolveSpecifier(moduleSpecifier, this)
	// }

	registerAPI() {
		this.exports.build()
		this.api = this.exports.getAPI()
		this.apiMap.addSelf(this.api, this)

	}

	insertCopyByValue(copiedValue: VariableDeclaration) {
		this.to_insert_copyByValue.push(copiedValue)
	}

	static mockedMeta:MetaData = {
		moduleAPIMap:null,
		isRoot:false,
		ext:'js',
		path_abs:'/this.js',
		path_relative:'this.js',
		rootDir:'/',
		stat:null,
		target_dir:'',
		type:FileType.js,

	};
}
