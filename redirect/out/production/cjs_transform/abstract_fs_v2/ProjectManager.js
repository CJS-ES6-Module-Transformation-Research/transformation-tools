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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const interfaces_1 = require("./interfaces");
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
        this.additions = {}; //AbstractDataFile[] = []
        this.suffixFsData = {};
        this.src = path;
        this.write_status = opts.write_status;
        this.suffix = opts.suffix;
        console.log(JSON.stringify(opts, null, 3));
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
        if (this.write_status === "in-place" && this.suffix) {
            this.dataFiles.forEach(e => {
                let ser = e.makeSerializable();
                this.suffixFsData[ser.relativePath + this.suffix] = ser.fileData;
            });
        }
    }
    addSource(newestMember) {
        this.additions[newestMember.getRelative()] = newestMember;
    }
    receiveFactoryUpdate(file, type, factory) {
        if (this.factory === factory) {
            switch (type) {
                case interfaces_1.FileType.cjs:
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
            this.writeInPlace();
        }
        else if (this.write_status === "copy") {
            this.copyOut();
        }
        else {
            throw new Error('write status not set!');
        }
    }
    writeInPlace() {
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
            let data = this.suffixFsData[relative];
            fs_1.writeFileSync(path_1.join(this.root.getAbsolute(), relative), data);
        }
        this.removeAll();
        this.writeAll();
    }
    removeAll(root_dir = this.root.getAbsolute()) {
        let unlinkAsyncFunc = (file) => __awaiter(this, void 0, void 0, function* () {
            return fs_1.unlink(file, (err) => {
                if (err) {
                    console.log('error deleting old files: ' + err);
                }
            });
        });
        this.dataFiles.forEach((file) => {
            path_1.join(root_dir, file.getRelative());
            unlinkAsyncFunc(path_1.join(root_dir, file.getRelative()));
        });
        // this.dataFiles.forEach((file: AbstractDataFile) => {
        //     let toRemove: string = join(root_dir, file.getRelative());
        //     unlinkSync(toRemove)
        // });
    }
    writeAll(root_dir = this.root.getAbsolute()) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dataFiles.map((file) => {
                return file.makeSerializable();
            }).forEach(serialized => {
                fs_1.writeFile(path_1.join(root_dir, serialized.relativePath), serialized.fileData, (err) => {
                    if (err) {
                        console.log('error occurred: ' + err);
                    }
                });
            });
            // writeFileSync(join(root_dir, serialized.relativePath), serialized.fileData);
            for (let filename in this.additions) {
                let serialized = this.additions[filename].makeSerializable();
                fs_1.writeFile(path_1.join(root_dir, serialized.relativePath), serialized.fileData, (err) => {
                    if (err) {
                        console.log('error occurred: ' + err);
                    }
                });
                // let dir = path.dirname(join(root_dir, serialized.relativePath))
                // writeFileSync(join(root_dir, serialized.relativePath), serialized.fileData);
            }
        });
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
    copyOut() {
        return __awaiter(this, void 0, void 0, function* () {
            // require('ncp')(this.src, this.target, {}, () => {
            //     this.removeAll(allFiles, this.target);
            //     this.writeAll(allFiles, this.target);
            // })
            // .then(()=>{
            // })
            yield cpr_1.default(this.src, this.target, {
                confirm: false, filter: function (testFile) {
                    let ext = path_1.default.extname(testFile);
                    let js = ext === '.js';
                    let cjs = ext === '.cjs';
                    let pkg = path_1.default.basename(testFile) === 'package.json';
                    return !(pkg || js || cjs);
                }
            }, () => {
            });
            yield this.writeAll(this.target);
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
