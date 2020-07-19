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
    }
    listChildrenByName() {
        return this.childrenNames;
    }
    //TODO add CJS TO THIS
    addChild(child) {
        this.children.push(child);
    }
    visit(visitor) {
        visitor(this);
        this.children.forEach(e => e.visit(visitor));
    }
    buildTree() {
        fs_1.readdirSync(this.absolutePath()).forEach(e => {
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
    }
}
exports.Dir = Dir;
