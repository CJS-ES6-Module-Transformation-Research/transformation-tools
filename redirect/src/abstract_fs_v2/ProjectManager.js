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
const path_1 = require("path");
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
        this.includeGit = false;
        this.includeNodeModules = false;
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
        console.log("DONE!");
    }
    removeAll(root_dir = this.root.getAbsolute()) {
        let unlinkAsyncFunc = (file) => fs_1.unlinkSync(file
        //     , (err) => {
        //     if (err) {
        //         console.log('error deleting old files: ' + err)
        //     }
        // }
        );
        this.dataFiles.forEach((file) => {
            // join(root_dir, file.getRelative());
            fs_1.unlinkSync(path_1.join(root_dir, file.getRelative()));
        });
        // this.dataFiles.forEach((file: AbstractDataFile) => {
        //     let toRemove: string = join(root_dir, file.getRelative());
        //     unlinkSync(toRemove)
        // });
    }
    writeAll(root_dir = this.root.getAbsolute()) {
        this.dataFiles.forEach(file => {
            let serialized = file.makeSerializable();
            fs_1.writeFileSync(path_1.join(root_dir, serialized.relativePath), serialized.fileData);
        });
        // writeFileSync(join(root_dir, serialized.relativePath), serialized.fileData);
        for (let filename in this.additions) {
            let serialized = this.additions[filename].makeSerializable();
            let file = path_1.join(root_dir, serialized.relativePath);
            // require('fs').open(file,'w',(e,f)=>{
            fs_1.writeFileSync(file, serialized.fileData);
            //     , (err) => {
            //     if (err) {
            //         console.log('error occurred: ' + err)
            //         throw err;
            //     }
            // }
            // })
            // let dir = path.dirname(join(root_dir, serialized.relativePath))
            // writeFileSync(join(root_dir, serialized.relativePath), serialized.fileData);
        }
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
        // require('ncp')(this.src, this.target, {}, () => {
        //     this.removeAll(allFiles, this.target);
        //     this.writeAll(allFiles, this.target);
        // })
        // .then(()=>{
        // })
        let src = this.src;
        let _target = this.target;
        let cpy = require('cpy');
        this.root.mkdirs(this.target);
        // cpy(this.src, this.target, {
        //     // parents: true,
        //     filter: (file) => {
        //
        //
        //     return _filter(file.path)
        //     }
        // }).then(() => {
        //     this.writeAll(_target)
        // }).then(()=>{
        //     console.log("DONE!")
        // }).catch(err => console.log(err))
        //
        cpr_1.default(this.src, this.target, {
            confirm: false, filter: _filter
            // function (testFile) {
            //     let rel_proj_root = relative(src, testFile)
            //     console.log(rel_proj_root)
            //     if (dirname(testFile) === ".git") {
            //         return false;
            //     } else if (rel_proj_root.startsWith('.git')) {
            //
            //         return false;
            //     }
            //
            //     // if (nodeMod.includes("node_modules")) {
            //     //     return false;
            //     // }
            //     let ext = extname(testFile)
            //
            //     let js = ext === '.js'
            //     let cjs = ext === '.cjs'
            //     let pkg = basename(testFile) === 'package.json'
            //
            //     return !(pkg || js || cjs)
            // }
        }, () => {
            this.writeAll(_target);
            console.log("DONE!");
        });
        let includeGit = this.includeGit;
        let includeModules = this.includeNodeModules;
        function _filter(testFile) {
            let rel_proj_root = path_1.relative(src, testFile);
            if (path_1.dirname(testFile) === ".git" && includeGit) {
                return false;
            }
            else if (rel_proj_root.startsWith('.git') && includeGit) {
                return false;
            }
            else if (rel_proj_root.startsWith('node_modules') && includeModules) {
                return false;
            }
            // join(src,testFile).includes("node_modules")
            // if (nodeMod.includes("node_modules")) {
            //     return false;
            // }
            let ext = path_1.extname(testFile);
            let js = ext === '.js';
            let cjs = ext === '.cjs';
            let pkg = path_1.basename(testFile) === 'package.json';
            return !(pkg || js || cjs);
        }
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
    //
    // /**
    //  * Runs a namespace re-building on all javascript files in the project.
    //  */
    // rebuildNamespace() {
    //     this.forEachSource((js: JSFile) => {
    //         js.rebuildNamespace();
    //     })
    // }
    forEachPackage(pkg) {
        this.package_json.forEach(p => {
            pkg(p);
        });
    }
}
exports.ProjectManager = ProjectManager;
