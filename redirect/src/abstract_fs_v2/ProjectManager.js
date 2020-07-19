var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
const Dirv2_1 = require("./Dirv2");
const JSv2_1 = require("./JSv2");
const PackageJSONv2_1 = require("./PackageJSONv2");
const Factory_1 = require("./Factory");
const Abstractions_1 = require("./Abstractions");
const assert_1 = require("assert");
const fs_1 = require("fs");
const path_1 = __importStar(require("path"));
const internals_1 = require("./internals");
const cpr_1 = __importDefault(require("cpr"));
class ProjectManager {
    constructor(path, opts) {
        this.dirs = {};
        this.dirList = [];
        this.jsMap = {};
        this.jsFiles = [];
        this.package_json = [];
        this.allFiles = [];
        this.dataFiles = [];
        this.src = path;
        this.write_status = opts.write_status;
        this.suffix = opts.suffix;
        assert_1.ok(fs_1.lstatSync(path).isDirectory(), `project path: ${path} was not a directory!`);
        this.factory = new Factory_1.FileFactory(path, opts.isModule, this);
        this.root = this.factory.getRoot();
        this.root.buildTree();
        this.target = opts.target_dir ? opts.target_dir : path;
        if (this.target && this.write_status) {
            if (!fs_1.existsSync(this.target)) {
                fs_1.mkdirSync(this.target);
            }
            else {
                assert_1.ok(!this.target || fs_1.lstatSync(this.target).isDirectory(), `target path: ${path} was not a directory!`);
            }
        }
        this.loadFileClassLists();
    }
    recieveFactoryUpdate(file, type, factory) {
        if (this.factory === factory) {
            switch (type) {
                case internals_1.FileType.cjs:
                    this.allFiles.push(file);
                    break;
                default:
                    return;
            }
        }
    }
    loadFileClassLists() {
        this.root.visit(node => {
            this.allFiles.push(node);
            if (node instanceof Abstractions_1.AbstractDataFile) {
                this.dataFiles.push(node);
            }
            if (node instanceof Dirv2_1.Dir) {
                this.dirList.push(node);
                this.dirs[node.getRelative()] = node;
            }
            else if (node instanceof JSv2_1.JSFile) {
                this.jsFiles.push(node);
                this.jsMap[node.getRelative()] = node;
            }
            else if (node instanceof PackageJSONv2_1.PackageJSON) {
                this.package_json.push(node);
            }
        });
    }
    forEachSource(func) {
        this.jsFiles.forEach(e => func(e));
    }
    getJS(name) {
        return this.jsMap[name];
    }
    ;
    writeOut() {
        if (this.write_status === "in-place") {
            if (this.suffix) {
                this.appendSuffix(this.dataFiles, this.suffix);
            }
            this.writeInPlace(this.dataFiles, this.suffix);
        }
        else if (this.write_status === "copy") {
            this.copyOut(this.dataFiles);
        }
        else {
            throw new Error('write status not set!');
        }
    }
    appendSuffix(allFiles, suffix) {
        allFiles.map(e => {
            let relative = e.getRelative();
            return {
                orig: relative,
                suffix: relative + suffix
            };
        });
    }
    writeInPlace(allFiles, suffix = '') {
        if (suffix) {
            allFiles.forEach((file) => {
                let absolute = path_1.join(this.root.getAbsolute(), file.getRelative());
                fs_1.copyFileSync(absolute, absolute + suffix);
            });
        }
        this.removeAll(allFiles);
        this.writeAll(allFiles);
    }
    removeAll(allFiles, root_dir = this.root.getAbsolute()) {
        allFiles.forEach((file) => {
            let toRemove = path_1.join(root_dir, file.getRelative());
            fs_1.unlinkSync(toRemove);
        });
    }
    writeAll(allFiles, root_dir = this.root.getAbsolute()) {
        allFiles.forEach((file) => {
            let serialized = file.makeSerializable();
            let dir = path_1.default.dirname(path_1.join(root_dir, serialized.relativePath));
            if (!fs_1.existsSync(dir)) {
                fs_1.mkdirSync(dir, { recursive: true });
            }
            fs_1.appendFileSync(path_1.join(root_dir, serialized.relativePath), serialized.fileData);
        });
    }
    copyOut(allFiles) {
        cpr_1.default(this.src, this.target, { confirm: false, deleteFirst: true, overwrite: true }, () => {
            this.removeAll(allFiles, this.target);
            this.writeAll(allFiles, this.target);
        });
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
    setSourceAsModule() {
        this.root.visit(e => {
            if (e instanceof PackageJSONv2_1.PackageJSON) {
                e.makeModule();
            }
            else if (e instanceof JSv2_1.JSFile) {
                e.setAsModule();
            }
        });
    }
    /**
     * Runs a namespace re-building on all javascript files in the project.
     */
    rebuildNamespace() {
        this.forEachSource((js) => {
            js.rebuildNamespace();
        });
    }
}
exports.ProjectManager = ProjectManager;
