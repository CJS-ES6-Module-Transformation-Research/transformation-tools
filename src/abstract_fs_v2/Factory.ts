import {lstatSync, Stats} from "fs";
import path, {basename, extname, join, normalize, relative, resolve} from "path";
import {API, API_TYPE} from "../transformations/export_transformations/API";
import {cleanMIS} from "../transformations/import_transformations/visitors/insert_imports";
import {AbstractDataFile, AbstractFile} from "./Abstractions";
import {Dir} from "./Dirv2";
import {built_ins, builtins_funcs, CJSBuilderData, FileType, MetaData} from "./interfaces";
import {JSFile} from "./JSv2";
import {CJSToJSON, PackageJSON} from "./PackageJSONv2";
import {ProjConstructionOpts, ProjectManager} from "./ProjectManager";
import {Reporter} from "./Reporter";

export interface API_KeyMap {
	[moduleSpecifier: string]: API
}

export class ModuleAPIMap {
	apiKey: API_KeyMap = {} //_initBuiltins ();
	readonly id: number = Math.floor(Math.random() * 100)

	submitNodeModule(moduleSpecifier: string): API {
		moduleSpecifier = cleanMIS(moduleSpecifier)
		let builtin: boolean = built_ins.includes(moduleSpecifier)
		let funcs: boolean = builtins_funcs.includes(moduleSpecifier)
		if ((!builtin) && (!funcs)) {
			if (!this.apiKey[moduleSpecifier]) {
				this.apiKey[moduleSpecifier] = new API(API_TYPE.default_only)
			}
			return this.apiKey[moduleSpecifier]
		} else {
			console.log(`logic error: ${moduleSpecifier} be an insantlled module! `)
		}

	}


	initJS(js: JSFile | CJSToJSON, api: API) {
		this.apiKey[js.getRelative()] = api;
	}

	initModSpec() {

	}

	getResolve(js: JSFile) {

		return function (moduleSpecifier: string) {
			moduleSpecifier = join(path.dirname(js.getRelative()), moduleSpecifier)
			if (this.apiKey[moduleSpecifier]) {
				return this.apiKey[moduleSpecifier]
			}
		}
	}

	resolve(moduleSpecifier: string, jsFile: JSFile | CJSToJSON): string {
		if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {
			return join(path.dirname(jsFile.getRelative()), moduleSpecifier)
		} else {
			return moduleSpecifier
		}

	}

	specifierExists(moduleSpecifier: string) {
		return
	}


	createOrSet(js: JSFile| CJSToJSON, moduleSpecifier: string, createSet: (api: API) => void, _type: API_TYPE, isForced) {
		let resolved = this.resolve(moduleSpecifier, js)

		if (!(this.apiKey[resolved])) {
			this.apiKey[resolved] = new API(_type)
		}
		this.apiKey[resolved].setType(_type, isForced)

	}

	private builtinDefault = (x: string) => builtins_funcs.includes(x)
	private builtInReg = (x: string) => built_ins.includes(x) && (!builtins_funcs.includes(x))

	 resolveSpecifier(jsFile: JSFile | CJSToJSON, moduleSpecifier: string): API {

		//is not bare
		if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {
			let resolved = this.resolve(moduleSpecifier, jsFile)
			return this.apiKey[resolved]
		} else {
			if (this.builtinDefault(moduleSpecifier)) {

				return new API(API_TYPE.default_only, true)

			} else if (this.builtInReg(moduleSpecifier)) {
				// throw new Error("TODO add info")
				if (!this.apiKey[moduleSpecifier]) {

					let _type = API_TYPE.named_only
					this.apiKey[moduleSpecifier] = new API(_type, true)
				}

				return this.apiKey[moduleSpecifier]


			} else {
				return new API(API_TYPE.default_only, false)
			}
		}
		//
		// if ((!this.builtInReg(moduleSpecifier)) && (!)) {
		// 	this.apiKey[moduleSpecifier] = this.apiKey[moduleSpecifier] || new API(API_TYPE.default_only)
		// 	// console.log('installed: ' + moduleSpecifier)
		// 	return this.apiKey[moduleSpecifier]
		// } else if (moduleSpecifier && builtin && (!funcs)) {
		// 	//check
		// 	assert(moduleSpecifier)
		// 	if ((!this.apiKey[moduleSpecifier])) {
		// 		let isnamed = (jsFile as JSFile).usesNamed()
		// 		this.apiKey[moduleSpecifier] = new API(isnamed ? API_TYPE.named_only : API_TYPE.default_only, [], true)
		// 	}
		// 	// console.log(`GET  api for ${moduleSpecifier || 'self'} with api type of ${this.apiKey[moduleSpecifier].getType()}`)
		// 	return this.apiKey[moduleSpecifier]
		// } else if (isBuiltin) {//should be and, but safer and effective with or
		// 	assert(moduleSpecifier)
		// 	//default
		// 	if (!this.apiKey[moduleSpecifier]) {
		//
		// 		this.apiKey[moduleSpecifier] = new API(API_TYPE.default_only, [], true)
		// 		// console.log(`GET  api for ${moduleSpecifier || 'self'} with api type of ${this.apiKey[moduleSpecifier].getType()}`)
		//
		// 	}
		// 	return this.apiKey[moduleSpecifier];
		// } else {
		// 	let _path
		//
		// 	if (!moduleSpecifier) {
		// 		console.log("abc" + JSON.stringify(this.apiKey, null, 3))
		// 		_path = jsFile.getRelative()
		// 		if (!this.apiKey[_path]) {
		// 			this.apiKey[_path] = new API(API_TYPE.none)
		//
		// 		}
		// 	} else {
		// 		//resolve
		//
		// 		_path = join(path.dirname(jsFile.getRelative()), moduleSpecifier)
		// 		console.log("xyz" + JSON.stringify(this.apiKey, null, 3))
		// 		if (!this.apiKey[_path]) {
		// 			this.apiKey[_path] = new API(API_TYPE.none)
		// 		}
		// 	}
		//
		// 	// console.log(`GET api for ${_path || 'self'} with api type of ${this.apiKey[_path].getType()}`)
		//
		// 	return this.apiKey[_path];
		//
		//
		// }
	}

	// addSelf(api: API, jsFile: JSFile | CJSToJSON) {
	// 	this.apiKey[jsFile.getRelative()] = api
	// }

	// private _forceMap: {[key:string]:boolean } = {}
	// forceMap() {
	// 	return this._forceMap
	// }


	register(jsFile: JSFile | CJSToJSON, api: API) {
		return this.apiKey[cleanMIS(join(path.dirname(jsFile.getRelative())))] = api
	}
}

export class FileFactory {
	readonly root_dir: Dir
	readonly rootPath: string
	readonly target_dir: string | null;
	readonly isModule: boolean
	readonly pm: ProjectManager;
	readonly rc: ModuleAPIMap = new ModuleAPIMap();
	private readonly uses_names: boolean;
	private ignored: string[];
	private reporter: Reporter;
	private isTest: boolean;

	constructor(path: string,  opts: ProjConstructionOpts, pm: ProjectManager = null, reporter: Reporter = null ) {
		this.reporter = reporter
		this.isModule =   opts.isModule;
		this.rootPath = resolve(path);
		this.pm = pm;
		this.ignored = opts.ignored
		this.uses_names = opts.isNamed
		this.isTest = opts.testing
		this.root_dir = this.createRoot();
	}

	getDirmap() {
		return this.dirmap
	}

	private dirmap: { [key: string]: Dir } = {}

	getRoot() {
		return this.root_dir;
	}

	createPackageCJSRequire(data: CJSBuilderData) {
		let resolved = normalize(data.cjsFileName)
		let metaData: MetaData = {
			moduleAPIMap: this.rc,
			target_dir: this.target_dir,
			stat: null,
			type: FileType.cjs,
			ext: '.cjs',
			isRoot: this.rootPath === resolved,
			rootDir: this.rootPath,
			path_abs: resolved,
			path_relative: relative(this.rootPath, data.cjsFileName),//data.dir .getRootDirPath() ,
			uses_names: this.uses_names,
			test: this.isTest
		};
		let newestMember = new CJSToJSON(resolved, metaData, data.dir, data.dataAsString)
		// if (this.pm) {
		//     this.pm.receiveFactoryUpdate(newestMember, FileType.cjs, this)
		// }
		// this.jsMap[newestMember.getRelative()] = newestMember
		this.pm.addSource(newestMember)
		return newestMember
	}

	createFile(path: string, parent: Dir) {
		let data: MetaData;
		let resolved = resolve(path)
		let stat = lstatSync(resolved)
		data = this.getData(stat, resolved)

		let child = this.getFileFromType(path, data, parent)
		if (!child) {
			return;
		}
		if (parent) {
			parent.addChild(child)
		}


		return child;

	}


	private createRoot(): Dir {


		let resolved = resolve(this.rootPath)
		let stat = lstatSync(resolved)
		let data: MetaData = this.getData(stat, resolved)
		let dir = new Dir(this.rootPath, data, null, this, this.rc, this.ignored);
		this.dirs['.'] = dir
		dir.setReporter(this.reporter)
		return dir
	};


	private getData(stat: Stats, resolved: string): MetaData {
		// let parent_f = createGetParent(parent)
		return {
			moduleAPIMap: this.rc,
			target_dir: this.target_dir,
			stat: stat,
			type: this.determineType(resolved, stat),
			ext: extname(resolved),

			// parent: parent_f ,
			isRoot: this.rootPath === resolved,

			rootDir: this.rootPath,
			path_abs: resolved,
			path_relative: this.rootPath === resolved ? '.' : relative(this.rootPath, resolved),
			uses_names: this.uses_names,
			test: this.isTest
		};
	}

	private getFileFromType(path: string, data: MetaData, parent: Dir): AbstractFile | AbstractDataFile {
		let escape = false;
		if (this.ignored) {
			this.ignored.forEach(e => {
				if (!(relative(e, data.path_relative))) {
					escape = true;
				}
			})

		}

		if (escape) {
 			return null;
		}
		switch (data.type) {

			case FileType.dir:
				let dir = new Dir(path, data, parent, this, this.rc, this.ignored)
				this.dirs[dir.getRelative()] = dir;
				dir.setReporter(this.reporter)
 				return dir
				break;
			case FileType.js:
 				let jsn = new JSFile(path, data, parent, this.isModule)
 				this.jsMap[jsn.getRelative()] = jsn
				jsn.setReporter(this.reporter)

				return jsn
 			case FileType.package:

				let pkgJ = new PackageJSON(path, data, parent)
				pkgJ .setReporter(this.reporter)

				return pkgJ
 			default:
				return null;
		}
	}

	getDir(dir: string) {
		return this.dirs[dir]
	}

	private dirs: { [dir: string]: Dir } = {}

	private determineType(path: string, stat): FileType {

		if (stat.isDirectory()) {
			return FileType.dir
		} else if (stat.isFile()) {
			return determineFileType(path)
		} else {
			return FileType.OTHER
		}

		function determineFileType(path: string): FileType {
			let ext: string = extname(path).toLowerCase()

			switch (ext) {
				case ".json":
					if (basename(path, '.json') === "package") {
						return FileType.package
					} else {
						return FileType.json
					}
				case ".js":
					return FileType.js

				default:
					return FileType.OTHER
			}

		}
	}

	private jsMap: { [js: string]: JSFile } = {}

	getJS(jsname: string): JSFile {
		return this.jsMap[jsname]
	}
}

