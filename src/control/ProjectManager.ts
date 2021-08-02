import assert, {ok as assertTrue} from "assert";
import cpr from "cpr";
import {appendFileSync, existsSync, lstatSync, mkdirSync, unlink, unlinkSync, writeFile, writeFileSync} from "fs";
import {basename, dirname, extname, join, relative} from "path";
import {AbstractDataFile, AbstractFile} from "../filesystem";
import {Dir} from "../filesystem";
import {FileFactory} from "../filesystem";
import {JSFile} from "../filesystem";
import {PackageJSON} from "../filesystem";
import {FileType, SerializedJSData, write_status} from "../utility";

  import {AbstractReporter, dummyReporter, Reporter} from "./Reporter";
import {naming} from "./utility/arg_parse";
import {traverse} from "estraverse";
import {generate} from "escodegen";


const LOGFILE = join(__dirname, './log');
if (existsSync(LOGFILE)) {
	unlinkSync(LOGFILE)
}


export const log: (msg: string, tag?: string) => void = function (msg: string, tag: string = "") {
	let data: string = '→ ';
	if (tag) {
		data += `${tag}:  ${msg}`
	} else {
		data += ` ${msg}`
	}
	// console.log(data )
	data += "\n"
	appendFileSync(LOGFILE, data);
}
// 	 (function () {
// 		// unlinkSync(LOGFILE);
// 		writeFileSync(LOGFILE,'' );
//
// 		return
// 	}()
// )


export function errHandle(err: Error, msg: string = ""): void {
	if (err && err.message) {
		console.log(err.message)
	}
	if (msg) {
		console.log(msg)
	}
	if (err) {
		throw err;
	}
}

export interface ProjectManagerI {
	addSource(newestMember: AbstractDataFile): void;

	getAnAddition(add: string): any;

	getJSRelativeStrings(): string[];

	loadFileClassLists(): void;

	forEachSource(func: (value: JSFile) => void, tfName?: string): void;

	getJS(name: string): JSFile;

	report(__report): void;

	writeOut(): Promise<void>;

	writeInPlace(): Promise<void>;

	removeAll(root_dir: string): Promise<void>;

	writeAll(root_dir: string): Promise<void>;

	copyOut(): void;

	getJSNames(includeAdditions): AbstractDataFile[];

	forEachPackage(pkg: (PackageJSON) => void): void;

	usingNamed(): any;
}

export class ProjectManagerMock implements ProjectManagerI {
	addSource(newestMember: AbstractDataFile): void {
	}

	copyOut(): void {
	}

	forEachPackage(pkg: (PackageJSON) => void): void {
	}

	forEachSource(func: (value: JSFile) => void, tfName?: string): void {
	}

	getAnAddition(add: string): any {
	}

	getJS(name: string): JSFile {
		return undefined;
	}

	getJSNames(includeAdditions): AbstractDataFile[] {
		return [];
	}

	getJSRelativeStrings(): string[] {
		return [];
	}

	loadFileClassLists(): void {
	}

	removeAll(root_dir: string): Promise<void> {
		return Promise.resolve(undefined);
	}

	report(__report): void {
	}

	usingNamed(): any {
	}

	writeAll(root_dir: string): Promise<void> {
		return Promise.resolve(undefined);
	}

	writeInPlace(): Promise<void> {
		return Promise.resolve(undefined);
	}

	writeOut(): Promise<void> {
		return Promise.resolve(undefined);
	}

}

export class ProjectManager implements ProjectManagerI {

	private readonly write_status:write_status
	private readonly root: Dir

	private dirs: { [key: string]: Dir } = {}
	private dirList: Dir[] = []

	private jsMap: { [key: string]: JSFile } = {}
	private jsFiles: JSFile[] = []

	private package_json: PackageJSON [] = []


	private readonly factory: FileFactory;

	private allFiles: AbstractFile[] = []
	private dataFiles: AbstractDataFile[] = []
	private additions: { [relName: string]: AbstractDataFile } = {}//AbstractDataFile[] = []
	private readonly src: string;
	private readonly target: string;
	private readonly suffix: string
	private readonly suffixFsData: { [abs: string]: string } = {}
	private includeGit: boolean = false;
	private includeNodeModules: boolean = false;
	private readonly uses_names: boolean;
	private readonly reporter: AbstractReporter;
	private readonly test: boolean;


	getRootDir(): string {
		return this.src
	}
	static init(opts:ProjConstructionOpts):ProjectManager{
		return new ProjectManager(opts.input,opts)
	}
	constructor(path: string, opts: ProjConstructionOpts, _named: boolean = false) {

		if (!path) {
			throw new Error(`path value: ${path} was invalid`)
		}

		opts.isNamed = opts.isNamed || _named;
		this.uses_names = opts.isNamed || _named;
		this.src = path
		this.write_status = opts.operation_type
		this.suffix = opts.suffix;
		this.reporter = dummyReporter
		if (opts.report) {
			this.reporter = new Reporter(process.cwd(), opts.report)
		}
		assertTrue(lstatSync(path).isDirectory(), `project path: ${path} was not a directory!`)
		this.test = opts.testing
		this.factory = new FileFactory(path, opts, this, this.reporter);
		this.root = this.factory.getRoot();
		this.root.buildTree();

		this.target = opts.output ? opts.output : path

		if (this.target && this.write_status) {
			if (!existsSync(this.target)) {
				mkdirSync(this.target)
			} else {
				assertTrue(!this.target || lstatSync(this.target).isDirectory(), `target path: ${path} was not a directory!`)
			}
		}

		this.loadFileClassLists();
		if (this.write_status === "in-place" && this.suffix) {
			this.dataFiles.forEach(e => {
				let ser = e.makeSerializable()
				this.suffixFsData[ser.relativePath + this.suffix] = ser.fileData;
			})
		}
	}

	addSource(newestMember: AbstractDataFile) {
		this.additions[newestMember.getRelative()] = newestMember;
	}

	getJSFiles():string[]{
		return Object.keys(this.jsMap)
	}

	getAnAddition(add: string) {
		for (let x in this.additions) {
			if (x === add) {
				return this.additions[x]
			}
		}
		return null

	}

	getJSRelativeStrings(): string[] {
		return this
			.getJSNames()
			.map(e => e.getRelative())
	}

	loadFileClassLists() {
		this.root.visit(
			node => {
				this.allFiles.push(node)
				if (node instanceof AbstractDataFile) {
					this.dataFiles.push(node)
				}

				if (node instanceof Dir) {
					this.dirList.push(node)
					this.dirs[node.getRelative()] = node;
				} else if (node instanceof JSFile) {
					this.jsFiles.push(node)
					this.jsMap[node.getRelative()] = node;
				} else if (node instanceof PackageJSON) {
					this.package_json.push(node)
				}
			})
	}

	forEachSource(func: (value: JSFile) => void, tfName: string = func.name): void {
		let curr: string = ''
		try {

			this.jsFiles.forEach((js:JSFile) => {

				assert(js, 'jsfile was negative in ' + tfName)
				curr = js.getRelative()
				func(js)

			})
		} catch (e) {

			errHandle(e, `EXCEPTION: exception occurred when processing file: ${curr} in phase ${tfName}\n${e}`);
		}
	}

	getJS(name: string): JSFile {
		return this.jsMap[name]
	};

	report(__report) {
		if (__report) {
			this.reporter.writeOut();
		}
	}

	async writeOut() {

		if (this.write_status === "in-place") {
			await this.writeInPlace()
		} else if (this.write_status === "copy") {
			this.copyOut()
		} else {
			throw new Error('write status not set!')
		}

		console.log('Done!')
	}


	async writeInPlace() {

		for (let relative in this.suffixFsData) {
			let data = this.suffixFsData[relative]
			writeFileSync(join(this.root.getAbsolute(), relative), data)
		}

		await this.removeAll()
		await this.writeAll()

	}

	async removeAll(root_dir: string = this.root.getAbsolute()) {

		await Promise.all(this.dataFiles.map(async (file: AbstractDataFile) => {
				unlink(join(root_dir, file.getRelative()), (err) => {
					errHandle(err);
				})
			})
		)
	}


	async writeAll(root_dir: string = this.root.getAbsolute()) {
		Promise.all(this.dataFiles.map(async (file) => {
			let serialized: SerializedJSData


			serialized = file.makeSerializable();
			try {
				writeFile(join(root_dir, (serialized.relativePath)), serialized.fileData, (err) => {
					errHandle(err);
				})
			} catch (ex) {
				let err_msg = `root dir: ${root_dir}
filename relative: ${file.getRelative()}
filename absolute: ${file.getAbsolute()}
data length: ${file.makeSerializable().fileData}
exception : ${ex}`;
				errHandle(ex, err_msg)
			}

		})).then(() => {

			for (let filename in this.additions) {
				let serialized: SerializedJSData = this.additions[filename].makeSerializable()
				let file = join(root_dir, serialized.relativePath)


				writeFile(file, serialized.fileData, () => {
				})

			}
		})
	}

	copyOut() {

		let src = this.src
		let _target = this.target
		this.root.mkdirs(this.target)


		//
		cpr(this.src, this.target, {
			confirm: false, filter: _filter
		}, () => {

			this.writeAll(_target)

		})
		let includeGit = this.includeGit;
		let includeModules = this.includeNodeModules

		function _filter(testFile) {
			let rel_proj_root = relative(src, testFile)
			if (dirname(testFile) === ".git" && includeGit) {
				return false;
			} else if (rel_proj_root.startsWith('.git') && includeGit) {

				return false;
			} else if (rel_proj_root.startsWith('node_modules') && includeModules) {
				return false;
			}

			// join(src,testFile).includes("node_modules")
			// if (nodeMod.includes("node_modules")) {
			//     return false;
			// }
			let ext = extname(testFile)

			let js = ext === '.js'
			let cjs = ext === '.cjs'
			let pkg = basename(testFile) === 'package.json'

			return !(pkg || js || cjs)
		}

	}

	getJSNames(includeAdditions = true) {
		let retVal: AbstractDataFile[] = [];
		this.dataFiles.forEach(e => retVal.push(e))
		for (let added in this.additions) {
			retVal.push(this.additions[added])
		}
		return retVal.filter(e => (e.getType() === FileType.js || e.getType() === FileType.cjs)).sort(
			(a, b) => a.getRelative().localeCompare(b.getRelative()))
	}


//TODO DELETE ONCE FIXED JSONREQUIRE
	// /**
	//  * Transforms project while passing the project to the transformation function.
	//  * @param projTransformFunc creates a transformation function using the project.
	//  */
	// public transformWithProject(projTransformFunc: ProjectTransformFunction) {
	//     let tfFunc: TransformFunction = projTransformFunc(this);
	//     this.transform(tfFunc);
	// }

	//
	// /**
	//  * Runs a namespace re-building on all javascript files in the project.
	//  */
	// rebuildNamespace() {
	//     this.forEachSource((js: JSFile) => {
	//         js.rebuildNamespace();
	//     })
	// }

	forEachPackage(pkg: (PackageJSON) => void) {
		this.package_json.forEach(p => {
			pkg(p)
		})
	}

	usingNamed() {
		return this.uses_names;
	}

	static builder(input: string): ProjectBuilder {
		return new ProjectBuilder(input)
	}

}


export interface ProjConstructionOpts {
	operation_type: write_status
	suffix: string
	isModule?: boolean
	isNamed: boolean
	copy_node_modules?: boolean
	ignored?: string[]
	testing?: boolean
	input: string
	// naming_format: naming
	report: boolean
	output: string
}

class ProjectBuilder {

	private readonly input: string
	private naming_format: naming = 'named'

	private operation_type: write_status = 'in-place'
	private report: boolean = false

	private output: string = ''
	private suffix: string = ''
	private isNamed: boolean = true

	private isModule: boolean = false
	private copy_node_modules: boolean = false;
	private ignored: string[] = []
	private testing: boolean = false

	constructor(input: string) {
		this.input = input;

	}

	setNaming(X: naming): ProjectBuilder {
		this.naming_format = X;
		return this
	}

	setCopy(): ProjectBuilder {
		this.operation_type = "copy";
		return this
	}

	setIsModule(X: boolean): ProjectBuilder {
		this.isModule = X;
		return this
	}

	setOutDir(out: string): ProjectBuilder {
		this.output = out;
		return this
	}

	setIgnored(X: string[]): ProjectBuilder {
		this.ignored = X;
		return this
	}

	setTesting(X: boolean): ProjectBuilder {
		this.testing = X;
		return this
	}

	build(): ProjectManager {

		let opts: ProjConstructionOpts = {
			input: this.input,
			testing: this.testing,
			isNamed: this.isNamed,
			ignored: this.ignored,
			isModule: this.isModule,
			copy_node_modules: this.copy_node_modules,
			suffix: this.suffix,
			// naming_format : this.naming_format  ,
			operation_type: this.operation_type,
			output: this.output,
			report: this.report
		}
		return new ProjectManager(this.input, opts, this.isNamed)
	}

}