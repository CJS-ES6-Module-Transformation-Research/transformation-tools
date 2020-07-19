Object.defineProperty(exports, "__esModule", { value: true });
exports.FileFactory = void 0;
const Dirv2_1 = require("./Dirv2");
const path_1 = require("path");
const interfaces_1 = require("./interfaces");
const fs_1 = require("fs");
const JSv2_1 = require("./JSv2");
const PackageJSONv2_1 = require("./PackageJSONv2");
class FileFactory {
    constructor(path, isModule, pm = null) {
        this.isModule = isModule;
        this.rootPath = path_1.resolve(path);
        this.pm = pm;
        this.root_dir = this.createRoot();
    }
    getRoot() {
        return this.root_dir;
    }
    createPackageCJSRequire(data) {
        let resolved = path_1.normalize(path_1.join((data.dir.absolutePath()), data.cjsFileName));
        let metaData = {
            target_dir: this.target_dir,
            stat: null,
            type: interfaces_1.FileType.cjs,
            ext: '.cjs',
            isRoot: this.rootPath === resolved,
            rootDir: this.rootPath,
            path_abs: resolved,
            path_relative: path_1.join(data.dir.getRelative(), data.cjsFileName)
        };
        let newestMember = new PackageJSONv2_1.CJSToJSON(resolved, metaData, data.dir, data.dataAsString);
        if (this.pm) {
            this.pm.recieveFactoryUpdate(newestMember, interfaces_1.FileType.cjs, this);
        }
        return newestMember;
    }
    createFile(path, parent) {
        let data;
        let resolved = path_1.resolve(path);
        let stat = fs_1.lstatSync(resolved);
        data = this.getData(stat, resolved);
        let child = this.getFileFromType(path, data, parent);
        if (!child) {
            console.log(`path ${path} was created as null: `);
            return;
        }
        if (child.getParent()) {
            child.getParent().addChild(child);
        }
        return child;
    }
    createRoot() {
        let resolved = path_1.resolve(this.rootPath);
        let stat = fs_1.lstatSync(resolved);
        let data = this.getData(stat, resolved);
        return new Dirv2_1.Dir(this.rootPath, data, null, this);
    }
    ;
    getData(stat, resolved) {
        // let parent_f = createGetParent(parent)
        return {
            target_dir: this.target_dir,
            stat: stat,
            type: this.determineType(resolved, stat),
            ext: path_1.extname(resolved),
            // parent: parent_f ,
            isRoot: this.rootPath === resolved,
            rootDir: this.rootPath,
            path_abs: resolved,
            path_relative: this.rootPath === resolved ? '.' : path_1.relative(this.rootPath, resolved)
        };
    }
    getFileFromType(path, data, parent) {
        switch (data.type) {
            case interfaces_1.FileType.dir:
                return new Dirv2_1.Dir(path, data, parent, this);
                break;
            case interfaces_1.FileType.js:
                return new JSv2_1.JSFile(path, data, parent, this.isModule);
                break;
            case interfaces_1.FileType.package:
                return new PackageJSONv2_1.PackageJSON(path, data, parent);
                break;
            default:
                return null;
        }
    }
    determineType(path, stat) {
        if (stat.isDirectory()) {
            return interfaces_1.FileType.dir;
        }
        else if (stat.isFile()) {
            return determineFileType(path);
        }
        else {
            return interfaces_1.FileType.OTHER;
        }
        function determineFileType(path) {
            let ext = path_1.extname(path).toLowerCase();
            switch (ext) {
                case ".json":
                    if (path_1.basename(path, '.json') === "package") {
                        return interfaces_1.FileType.package;
                    }
                    else {
                        return interfaces_1.FileType.json;
                    }
                case ".js":
                    return interfaces_1.FileType.js;
                default:
                    return interfaces_1.FileType.OTHER;
            }
        }
    }
}
exports.FileFactory = FileFactory;
