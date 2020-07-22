Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDataFile = exports.AbstractFile = void 0;
const fs_1 = require("fs");
class AbstractFile {
    constructor(path, bfd, parent) {
        this.ext = bfd.ext;
        this.stat = bfd.stat;
        this.type = bfd.type;
        this.isRoot = bfd.isRoot;
        this.rootDir = bfd.rootDir;
        this.path_abs = bfd.path_abs;
        this.path_relative = bfd.path_relative;
        this.target_dir = bfd.target_dir;
        this.parent = createGetParent(parent);
    }
    getType() {
        return this.type;
    }
    getStats() {
        return this.stat;
    }
    getExt() {
        return this.ext;
    }
    getParent() {
        return this.isRoot ? null : this.parent();
    }
    getAbsolute() {
        return this.path_abs;
    }
    getRelative() {
        return this.path_relative;
    }
    visit(visitor) {
        visitor(this);
    }
}
exports.AbstractFile = AbstractFile;
class AbstractDataFile extends AbstractFile {
    constructor(path, b, parent, data = '') {
        super(path, b, parent);
        if (data) {
            this.data = data;
        }
        else {
            this.data = fs_1.readFileSync(this.path_abs, 'utf-8');
        }
    }
}
exports.AbstractDataFile = AbstractDataFile;
function createGetParent(dir) {
    if (!dir) {
        return null;
    }
    let getParent = (() => dir);
    getParent.pName = dir.getRelative();
    return getParent;
}
