Object.defineProperty(exports, "__esModule", { value: true });
exports.Dir = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const Abstractions_1 = require("./Abstractions");
class Dir extends Abstractions_1.AbstractFile {
    constructor(path, b, parent, factory) {
        super(path, b, parent);
        this.package = null;
        this.children = [];
        this.factory = () => factory;
        this.childrenNames = fs_1.readdirSync(this.path_abs);
        this.root = factory.rootPath;
    }
    listChildrenByName() {
        return this.childrenNames;
    }
    //TODO add CJS TO THIS
    addChild(child) {
        this.children.push(child);
    }
    getRootDirPath() {
        return this.root;
    }
    visit(visitor) {
        visitor(this);
        this.children.forEach(e => e.visit(visitor));
    }
    buildTree() {
        fs_1.readdirSync(this.getAbsolute()).forEach(e => {
            let child = this.factory().createFile(path_1.join(this.path_abs, e), this);
            if (child && child instanceof Dir) {
                child.buildTree();
            }
        });
    }
    setPackageJSON(packageJson) {
        this.package = packageJson;
    }
    getPackageJSON() {
        if (this.package) {
            return this.package;
        }
        else if (this.isRoot) {
            throw new Error('package.json not found');
        }
        else {
            return this.parent().getPackageJSON();
        }
    }
    spawnCJS(buildData) {
        let cjs = this.factory().createPackageCJSRequire(buildData);
        this.addChild(cjs);
        return cjs.getRelative();
    }
    mkdirs(root) {
        if (!this.isRoot) {
            let dirChildren = this.children
                .filter(e => e instanceof Dir)
                .map(e => e);
            let thisRoot = path_1.join(root, this.path_relative);
            if (dirChildren) {
                dirChildren.forEach(d => d.mkdirs(thisRoot));
            }
            else {
                fs_1.mkdirSync(thisRoot, { recursive: true });
            }
        }
        else {
            this.mkdirs(this.factory().rootPath);
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
exports.Dir = Dir;
