import {lstatSync, Stats} from "fs";
import path, {basename, extname, join, normalize, relative, resolve} from "path";
import {API, API_TYPE} from "../refactoring/utility/API";
import {built_ins, builtins_funcs} from "../utility/data";
import {CJSBuilderData, FileType, MetaData} from "../utility/types";
import {AbstractDataFile, AbstractFile} from "./AbstractFileSkeletons";
import {Dir} from "./Directory";
import {JSFile} from "./JSFile";
import {CJSToJSON, PackageJSON} from "./Package_JSON";
import {ProjConstructionOpts, ProjectManager} from "../control/ProjectManager";
import { AbstractReporter } from "../control/Reporter";
export interface API_KeyMap {
	[moduleSpecifier: string]: API
}

export class ModuleAPIMap {
	apiKey: API_KeyMap = {}
	readonly id: number = Math.floor(Math.random() * 100)

	initJS(js: JSFile | CJSToJSON, api: API) {
		this.apiKey[js.getRelative()] = api;
	}

	resolve(moduleSpecifier: string, jsFile: JSFile | CJSToJSON): string {

		if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {

			return join(path.dirname(jsFile.getRelative()), moduleSpecifier)
		} else {
			return moduleSpecifier
		}

	}


	createOrSet(js: JSFile | CJSToJSON, moduleSpecifier: string, createSet: (api: API) => void, _type: API_TYPE, isForced) {
		let resolved = this.resolve(moduleSpecifier, js)

		if (!(this.apiKey[resolved])) {
			this.apiKey[resolved] = new API(_type)
		}
		this.apiKey[resolved].setType(_type, isForced)

	}

	private builtinDefault = (x: string) => builtins_funcs.includes(x)
	private builtInReg = (x: string) => built_ins.includes(x) && (!builtins_funcs.includes(x))
	readonly defautlKey = new API(API_TYPE.default_only)

	resolveSpecifier(js: JSFile | CJSToJSON, moduleSpecifier: string): API {

		//is not bare
		if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {
			let resolved = this.resolve(moduleSpecifier, js)
			let jsdirname = path.dirname(js.getRelative())

			let retV = this.apiKey[resolved]
			if (!retV) {
				console.log(`ERROR module specifier: ${moduleSpecifier} did not ressolve to a file when called from ${js.getRelative()} but instead resolved to ${resolved}`)

			}
			return retV
		} else if (this.apiKey[moduleSpecifier]) {
			return this.apiKey[moduleSpecifier]
		} else {
			if (this.builtinDefault(moduleSpecifier)) {

				this.apiKey[moduleSpecifier] = new API(API_TYPE.default_only, true)
				return this.apiKey[moduleSpecifier]


			} else if (this.builtInReg(moduleSpecifier)) {

				let _type = API_TYPE.named_only
				this.apiKey[moduleSpecifier] = new API(_type, true)

				return this.apiKey[moduleSpecifier]


			} else {
				this.apiKey[moduleSpecifier] = new API(API_TYPE.default_only, false)
				return this.apiKey[moduleSpecifier]
			}
		}
		if (this.apiKey[moduleSpecifier]) {
			return this.apiKey[moduleSpecifier]
		} else {
			return this.defautlKey
		}

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
	private reporter: AbstractReporter;
	private isTest: boolean;

	constructor(path: string, opts: ProjConstructionOpts, pm: ProjectManager = null, reporter: AbstractReporter = null) {
		this.reporter = reporter
		this.isModule = opts.isModule;
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
				pkgJ.setReporter(this.reporter)

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

