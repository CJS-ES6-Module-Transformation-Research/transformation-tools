import {ok as assertTrue} from "assert";
import cpr from "cpr";
import {existsSync, lstatSync, mkdirSync, unlinkSync, writeFileSync} from "fs";
import {basename, dirname, extname, join, relative} from "path";
import {AbstractDataFile, AbstractFile} from "./Abstractions";
import {Dir} from "./Dirv2";
import {FileFactory} from "./Factory";
import {FileType, SerializedJSData, write_status} from "./interfaces";
import {JSFile} from "./JSv2";
import {PackageJSON} from "./PackageJSONv2";

export interface ProjConstructionOpts {
	write_status: write_status
	target_dir: string
	suffix: string
	isModule?: boolean
	copy_node_modules?: boolean
}

export class ProjectManager {

	private readonly write_status: write_status
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


	constructor(path: string, opts: ProjConstructionOpts) {
		this.src = path
		this.write_status = opts.write_status
		this.suffix = opts.suffix;

		assertTrue(lstatSync(path).isDirectory(), `project path: ${path} was not a directory!`)

		this.factory = new FileFactory(path, opts.isModule, this);
		this.root = this.factory.getRoot();
		this.root.buildTree();

		this.target = opts.target_dir ? opts.target_dir : path

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



	private loadFileClassLists() {
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

	forEachSource(func: (value: JSFile) => void): void {
		this.jsFiles.forEach(e => func(e))
	}

	getJS(name: string): JSFile {
		return this.jsMap[name]
	};

	public writeOut() {

		if (this.write_status === "in-place") {
			this.writeInPlace()
		} else if (this.write_status === "copy") {
			this.copyOut()
		} else {
			throw new Error('write status not set!')
		}
	}


	private writeInPlace() {

		// if (suffix) {
		//     allFiles.forEach((file: AbstractDataFile) => {
		//         let absolute = join(this.root.getAbsolute(), file.getRelative())
		//         console.log(`absolute: ${absolute}`)
		//         console.log(`root : ${this.root.getAbsolute()}`)
		//         console.log(`relaritve : ${file.getRelative()}`)
		//
		//         // copyFileSync(absolute, absolute + suffix)
		//     });
		//         // }
		for (let relative in this.suffixFsData) {
			let data = this.suffixFsData[relative]
			writeFileSync(join(this.root.getAbsolute(), relative), data)
		}

		this.removeAll()
		this.writeAll()
		console.log("DONE!")
	}

	private removeAll(root_dir: string = this.root.getAbsolute()) {
		let unlinkAsyncFunc = (file) => unlinkSync(file
			//     , (err) => {
			//     if (err) {
			//         console.log('error deleting old files: ' + err)
			//     }
			// }
		);
		this.dataFiles.forEach((file: AbstractDataFile) => {
			// join(root_dir, file.getRelative());
			unlinkSync(join(root_dir, file.getRelative()))
		})

		// this.dataFiles.forEach((file: AbstractDataFile) => {
		//     let toRemove: string = join(root_dir, file.getRelative());
		//     unlinkSync(toRemove)
		// });
	}


	private writeAll(root_dir: string = this.root.getAbsolute()) {
		this.dataFiles.forEach(file => {
			let serialized: SerializedJSData

			serialized = file.makeSerializable();


			try {
				writeFileSync(join(root_dir, serialized.relativePath), serialized.fileData)
			} catch(ex) {
				console.log(`root dir: ${root_dir}`)
				console.log(`filename relative: ${file.getRelative()}`)
				console.log(`filename absolute: ${file.getAbsolute()}`)
				console.log(`data length: ${file.makeSerializable().fileData}`)

				console.log(`excpetion : ${ex}`)
			}

		})
		// writeFileSync(join(root_dir, serialized.relativePath), serialized.fileData);

		for (let filename in this.additions) {
			let serialized: SerializedJSData = this.additions[filename].makeSerializable()
			let file = join(root_dir, serialized.relativePath)
			// require('fs').open(file,'w',(e,f)=>{

			writeFileSync(file, serialized.fileData)
			//     , (err) => {
			//     if (err) {
			//         console.log('error occurred: ' + err)
			//         throw err;
			//     }
			// }


			// })

			// let dir = path.dirname(join(root_dir, serialized.relativePath))
			// writeFileSync(join(root_dir, serialized.relativePath), serialized.fileData);
		}
	}

	//
	// private writeAll(root_dir: string = this.root.getAbsolute()) {
	//     this.dataFiles.forEach((file: AbstractDataFile) => {
	//         let serialized: SerializedJSData = file.makeSerializable()
	//         let dir = path.dirname(join(root_dir, serialized.relativePath))
	//         if (!existsSync(dir)) {
	//             mkdirSync(dir, {recursive: true})
	//         }
	//         writeFileSync(join(root_dir, serialized.relativePath), serialized.fileData);
	//     })
	//     for (let filename in this.additions) {
	//         let file = this.additions[filename]
	//         let serialized: SerializedJSData = file.makeSerializable()
	//         let dir = path.dirname(join(root_dir, serialized.relativePath))
	//         writeFileSync(join(root_dir, serialized.relativePath), serialized.fileData);
	//
	//     }
	// }

	private copyOut() {

		// require('ncp')(this.src, this.target, {}, () => {
		//     this.removeAll(allFiles, this.target);
		//     this.writeAll(allFiles, this.target);
		// })
		// .then(()=>{

		// })
		let src = this.src
		let _target = this.target
		let cpy = require('cpy')
		this.root.mkdirs(this.target)
		// cpy(this.src, this.target, {
		//     // parents: true,
		//     filter: (file) => {
		//
		//
		//     return _filter(file.path)
		//     }
		// }).then(() => {
		//     this.writeAll(_target)
		// }).then(()=>{
		//     console.log("DONE!")
		// }).catch(err => console.log(err))

		//
		cpr(this.src, this.target, {
			confirm: false, filter: _filter
			// function (testFile) {
			//     let rel_proj_root = relative(src, testFile)
			//     console.log(rel_proj_root)
			//     if (dirname(testFile) === ".git") {
			//         return false;
			//     } else if (rel_proj_root.startsWith('.git')) {
			//
			//         return false;
			//     }
			//
			//     // if (nodeMod.includes("node_modules")) {
			//     //     return false;
			//     // }
			//     let ext = extname(testFile)
			//
			//     let js = ext === '.js'
			//     let cjs = ext === '.cjs'
			//     let pkg = basename(testFile) === 'package.json'
			//
			//     return !(pkg || js || cjs)
			// }
		}, () => {

			this.writeAll(_target)
			console.log("DONE!")
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
	getJSNames(includeAdditions= true){
		let retVal:AbstractDataFile[] = [];
		this.dataFiles.forEach(e=>retVal.push(e))
		for (let added in this.additions){
			retVal.push(this.additions[added])
		}
		return retVal.filter(e=>(e.getType() === FileType.js ||e.getType()=== FileType.cjs)).sort(
			 (a,b)=>a.getRelative().localeCompare(b.getRelative()))
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
}