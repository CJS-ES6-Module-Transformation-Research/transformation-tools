Object.defineProperty(exports, "__esModule", { value: true });
exports.SymLink = exports.OtherFile = exports.ReadableFile = exports.ProjectFile = exports.Dir = void 0;
const fs_1 = require("fs");
/**
 * abstract representation of a file's basic navigational data.
 */
class FSObject {
    constructor(dir, rel, file, priority) {
        this.dir = dir;
        this.relative = rel;
        this.abs = dir + '/' + rel;
        this.reportPriority = priority;
    }
    getDir() {
        return this.dir;
    }
    getRelative() {
        return this.relative;
    }
    getAbsolute() {
        return this.abs;
    }
}
class Dir extends FSObject {
    constructor(dir, rel, file, priority) {
        super(dir, rel, file, priority);
    }
}
exports.Dir = Dir;
/**
 * representation of a file in a project.
 */
class ProjectFile extends FSObject {
    constructor(dir, rel, file, priority) {
        super(dir, rel, file, priority);
        this.file = file;
        this.abs = dir + '/' + rel;
    }
    isSource() {
        return false;
    }
    ;
    isData() {
        return false;
    }
    ;
}
exports.ProjectFile = ProjectFile;
/**
 * representation of a file containing data within a project (.js or .json).
 */
class ReadableFile extends ProjectFile {
    constructor(dir, rel, file, priority, text = "") {
        super(dir, rel, file, priority);
        if (!text) {
            try {
                this.text = fs_1.readFileSync(this.abs).toString();
            }
            catch (e) {
                // console.log(`CAUGHT!`)
                // console.log(`\tdir: ${dir}\n\trel: ${rel}\n\tfile: ${file}\n\tabs: ${this.abs}`)
                throw e;
            }
        }
        else {
            this.text = text;
        }
    }
    getText() {
        return this.text;
    }
    isData() {
        return true;
    }
}
exports.ReadableFile = ReadableFile;
/**
 * anything other than .js .json (a symlink) or (a dir)
 */
class OtherFile extends ProjectFile {
    constructor(dir, rel, file) {
        super(dir, rel, file, 3);
    }
}
exports.OtherFile = OtherFile;
/**
 * project representation of a symlink.
 */
class SymLink extends ProjectFile {
    constructor(dir, rel, file) {
        super(dir, rel, file, 3);
    }
}
exports.SymLink = SymLink;
