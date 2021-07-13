import {mkdirSync, readdirSync} from "fs";
import {basename, join} from "path";
import {API} from "../refactoring/utility/API";
import {CJSBuilderData, FileVisitor, MetaData} from "../utility/types";
import {AbstractFile} from "./AbstractFileSkeletons";
import {FileFactory, ModuleAPIMap} from "./FS-Factory";
import {JSFile} from "./JSFile.js";
import {CJSToJSON, PackageJSON} from "./Package_JSON";

export class Dir extends AbstractFile {

	private readonly apiMap: { [relative: string]: API }

	private factory: () => FileFactory
	private readonly childrenNames: string[];
	private readonly root: string;

	protected package: PackageJSON = null;
	protected children: AbstractFile[] = []
	protected modMap: ModuleAPIMap;

	constructor(path: string, b: MetaData, parent: Dir, factory: FileFactory, rc: ModuleAPIMap, ignored: string[] = []) {
		super(path, b, parent, b.test);
		this.modMap = rc;
		this.factory = () => factory;
		this.childrenNames = readdirSync(this.path_abs)
		let hasBeen: string = ''
		let illegal = ''
		let x = []
		this.childrenNames.forEach((child) => {
			ignored.forEach((ig: string) => {
				let rel = require('path').relative(ig, join(this.path_abs, child))
				if (!rel) {
					hasBeen = ig
					illegal = child
				} else {
					hasBeen = ''
				}

				x.push(illegal)
			})

		})

		this.root = factory.rootPath
		this.apiMap = {};
	}


	getRootDirPath() {
		return this.root
	}

	addChild(child: AbstractFile) {
		this.children.push(child)
	}

	visit(visitor: FileVisitor) {
		visitor(this)
		this.children.forEach(e => e.visit(visitor))
	}

	buildTree() {
		let dir_dirname = basename(this.getAbsolute())
		if (dir_dirname === '.git' || dir_dirname === 'node_modules') {
			this.children = [];
			return;
		}

		readdirSync(this.getAbsolute())
			.forEach(e => {
				let child = this.factory()
					.createFile(join(this.path_abs, e), this)
				if (child && child instanceof Dir) {
					this.factory().getDirmap()[child.getRelative()] = child;
					child.buildTree()
				}
			})

	}


	setPackageJSON(packageJson: PackageJSON) {
		this.package = packageJson
	}

	getPackageJSON(): PackageJSON {
		if (this.package) {
			return this.package

		} else if (this.isRoot) {
			throw  new Error('package.json not found')
		} else {
			return this.parent().getPackageJSON()
		}
	}


	spawnCJS(buildData: CJSBuilderData): string {
		let cjs: CJSToJSON = this.factory().createPackageCJSRequire(buildData);
		this.addChild(cjs)
		return cjs.getRelative()
	}


	mkdirs(root_start: string) {
		let dir_name = basename(this.path_relative)
		switch (dir_name) {
			case ".git":
			case "node_modules":
				return;
			default:
				break;
		}

		let dirChildren: Dir[] = this.children
			.filter(e => {
				return e instanceof Dir
			})
			.map(e => e as Dir)

		let thisRoot = join(root_start, this.path_relative);

		if (dirChildren.length) {
			dirChildren.forEach(d => d.mkdirs(root_start))
		} else {
			mkdirSync(thisRoot, {recursive: true})
		}


	}


	getJS(js: string): JSFile {
		return this.factory().getJS(js)
	}


	getDir(_rel: string) {
		return this.factory().getDir(_rel)
	}
}


