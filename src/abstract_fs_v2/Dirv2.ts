import {readdirSync} from "fs";
import {join} from "path";
import {CJSBuilderData, FileVisitor, MetaData} from "./interfaces";
import {CJSToJSON, PackageJSON} from "./PackageJSONv2";
import {AbstractFile} from "./Abstractions";
import {FileFactory} from "./Factory";

export class  Dir extends AbstractFile  {


    private factory: () => FileFactory
    private readonly childrenNames: string[];

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
    }


    visit(visitor: FileVisitor) {
        visitor(this)
        this.children.forEach(e => e.visit(visitor))
    }

    buildTree() {
        readdirSync(this.getAbsolute()).forEach(e => {
            let child = this.factory().createFile(join(this.path_abs, e), this)
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


    spawnCJS(buildData: CJSBuilderData): string  {
        let cjs: CJSToJSON = this.factory().createPackageCJSRequire(buildData);
        this.addChild(cjs)
        return cjs.getRelative()
    }
}