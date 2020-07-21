import {mkdirSync, readdirSync} from "fs";
import {basename, join} from "path";
import {CJSBuilderData, FileVisitor, MetaData} from "./interfaces";
import {CJSToJSON, PackageJSON} from "./PackageJSONv2";
import {AbstractFile} from "./Abstractions";
import {FileFactory} from "./Factory";

export class Dir extends AbstractFile {


    private factory: () => FileFactory
    private readonly childrenNames: string[];
    private readonly root: string;
    private copyGit: Boolean;
    private copyNodeModules: Boolean;

    listChildrenByName() {
        return this.childrenNames;
    }

    protected package: PackageJSON = null;
    protected children: AbstractFile[] = []

    //TODO add CJS TO THIS
    addChild(child: AbstractFile) {
        this.children.push(child)
    }

    constructor(path: string, b: MetaData, parent: Dir, factory: FileFactory) {
        super(path, b, parent);
        this.factory = () => factory;
        this.childrenNames = readdirSync(this.path_abs)
        this.root = factory.rootPath
    }

    getRootDirPath() {
        return this.root
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


        // if(!root){
        //     root = this.factory().rootPath
        //     mkdirSync(root)
        // }
        //
        // let paths:Dir[] = [];
        // this.children.forEach(e=>{
        //     if (e instanceof Dir){
        //         paths.push( e )
        //     }
        // })
        // if (!paths){
        //     mkdirSync(join(root, ))
        // }
        // paths.forEach(e=>{
        //     e.mkdirs(this.isRoot? root:join(root, this.path_relative))
        // })
    }
}