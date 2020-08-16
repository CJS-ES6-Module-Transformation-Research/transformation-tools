import {lstatSync, Stats} from "fs";
import path, {basename, extname, join, normalize, relative, resolve} from "path";
import {_initBuiltins, API, API_TYPE} from "../transformations/export_transformations/API";
import {cleanMIS} from "../transformations/import_transformations/visitors/insert_imports";
import {AbstractDataFile, AbstractFile} from "./Abstractions";
import {Dir} from "./Dirv2";
import {built_ins, builtins_funcs, CJSBuilderData, FileType, MetaData} from "./interfaces";
import {JSFile} from "./JSv2";
import {CJSToJSON, PackageJSON} from "./PackageJSONv2";
import {ProjectManager} from "./ProjectManager";

export interface API_KeyMap {
	[moduleSpecifier: string]: API
}

export class ModuleAPIMap {
	apiKey: API_KeyMap = _initBuiltins();

	submitNodeModule(moduleSpecifier: string): API {
		moduleSpecifier = cleanMIS(moduleSpecifier )
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

	resolveSpecifier(jsFile: JSFile | CJSToJSON, moduleSpecifier: string = ''): API {

		if(moduleSpecifier){

			moduleSpecifier = cleanMIS(moduleSpecifier)
			console.log(`accessing ${moduleSpecifier} which ${this.apiKey[moduleSpecifier] ? 'existed':'must be created '}`)
		}

		let builtin: boolean = built_ins.includes(moduleSpecifier)
		let funcs: boolean = builtins_funcs.includes(moduleSpecifier)
		if (builtin && (!funcs)) {
			//check
			if (!this.apiKey[moduleSpecifier]) {
				let isnamed = (jsFile as JSFile).usesNamed()
				this.apiKey[moduleSpecifier] = new API(isnamed ? API_TYPE.named_only : API_TYPE.default_only, [], true)
			}
			return this.apiKey[moduleSpecifier]
		} else if (builtin || funcs) {//should be and, but safer and effective with or
			//default
			if (!this.apiKey[moduleSpecifier]) {

				this.apiKey[moduleSpecifier] = new API(API_TYPE.default_only, [], true)
			}
			return this.apiKey[moduleSpecifier];
		} else {
			let _path

			if (!moduleSpecifier) {

				_path = jsFile.getRelative( )
				if (!this.apiKey[_path]) {
					this.apiKey[_path] = new API(API_TYPE.none)
				}
			} else {
				//resolve

				_path = join(path.dirname(jsFile.getRelative()), moduleSpecifier)
				if (!this.apiKey[_path]) {
					this.apiKey[_path] = new API(API_TYPE.none)
				}
			}


			return this.apiKey[_path];


		}
	}

	// addSelf(api: API, jsFile: JSFile | CJSToJSON) {
	// 	this.apiKey[jsFile.getRelative()] = api
	// }

	// private _forceMap: {[key:string]:boolean } = {}
	// forceMap() {
	// 	return this._forceMap
	// }

	resolve(moduleSpecifier: string, jsFile: JSFile | CJSToJSON): string {

		return join(path.dirname(jsFile.getRelative()), moduleSpecifier)

	}

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

	constructor(path: string, uses_names: boolean, isModule?: boolean, pm: ProjectManager = null) {
		this.isModule = isModule;
		this.rootPath = resolve(path);
		this.pm = pm;
		this.root_dir = this.createRoot();
		this.uses_names = uses_names
	}


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
			uses_names: this.uses_names
		};
		let newestMember = new CJSToJSON(resolved, metaData, data.dir, data.dataAsString)
		// if (this.pm) {
		//     this.pm.receiveFactoryUpdate(newestMember, FileType.cjs, this)
		// }
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
		return new Dir(this.rootPath, data, null, this, this.rc);
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
			uses_names: this.uses_names
		};
	}

	private getFileFromType(path: string, data: MetaData, parent: Dir): AbstractFile | AbstractDataFile {
		switch (data.type) {

			case FileType.dir:
				return new Dir(path, data, parent, this, this.rc)
				break;
			case FileType.js:
				return new JSFile(path, data, parent, this.isModule)
				break;
			case FileType.package:
				return new PackageJSON(path, data, parent)
				break;
			default:
				return null;
		}
	}

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

}

