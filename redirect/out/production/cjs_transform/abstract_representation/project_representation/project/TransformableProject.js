var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformableProject = void 0;
const JSFile_1 = require("../javascript/JSFile");
const fs_1 = require("fs");
const relative_1 = __importDefault(require("relative"));
const path_1 = __importDefault(require("path"));
class TransformableProject {
    constructor(builder) {
        this.jsFileMap = {};
        this.jsonFileMap = {};
        this.dirs = [];
        this.files = builder.files;
        this.packageJSON = builder.packageJSON;
        this.projType = builder.projType;
        this.jsFiles = builder.jsFiles;
        this.jsFiles.forEach((jsf) => {
            this.jsFileMap[jsf.getRelative()] = jsf;
        });
        this.jsonFiles = builder.jsonFiles;
        this.jsonFiles.forEach(jsf => {
            this.jsonFileMap[jsf.getRelative()] = jsf;
        });
        this.dirs = builder.dirs;
        this.projectDir = builder.projectDir;
        this.originalFiles = new Set();
        this.files.forEach((e) => this.originalFiles.add(e.getRelative()));
    }
    static getSpecifiedRelativeFile(relativeFile, jsonRequire, dir) {
        let REL = relative_1.default(relativeFile, jsonRequire, null);
        return REL;
    }
    static builder(options = {}) {
        return new ProjectBuilder();
    }
    static ofBuilder(builder) {
        return new TransformableProject(builder);
    }
    ;
    forEachSource(func) {
        this.jsFiles.forEach(func);
    }
    writeOutInPlace(suffix) {
        this.writeOut(suffix, this.projectDir);
    }
    writeOutNewDir(rootDir) {
        this.writeOut('', rootDir);
    }
    writeOut(inPlaceSuffix, newProjDir) {
        if (this.projType === "module") {
            this.packageJSON.setModuleType(this.projType);
        }
        try {
            if (!fs_1.existsSync(newProjDir)) {
                fs_1.mkdirSync(newProjDir, { recursive: true });
            }
        }
        catch (err) {
            console.log(`ERROR IN MK RootDir: ${err}`);
            throw err;
        }
        this.dirs.forEach((d) => {
            try {
                fs_1.mkdirSync(newProjDir + '/' + d.getRelative(), { recursive: true });
            }
            catch (e) {
                console.log(`ERROR IN MKDIR: ${e}`);
                throw e;
            }
        });
        if (inPlaceSuffix) {
            this.files.filter(e => !e.isData()).forEach(e => {
                let prefix = newProjDir + "/" + e.getRelative();
                fs_1.copyFileSync(prefix, `${prefix}${inPlaceSuffix}`);
            });
        }
        this.jsFiles.forEach((jsf) => {
            fs_1.writeFileSync(newProjDir + "/" + jsf.getRelative(), jsf.makeString());
        });
        this.jsonFiles.forEach((jsf) => {
            fs_1.writeFileSync(newProjDir + "/" + jsf.getRelative(), jsf.getText());
        });
    }
    getJS(name) {
        return this.jsFileMap[name];
    }
    getJSON(json) {
        return this.jsonFileMap[json];
    }
    addJS(relative, data) {
        let added = new JSFile_1.JSFile(this.projectDir, relative, path_1.default.basename(relative), this.projType, data);
        this.files.push(added);
        this.jsFiles.push(added);
        this.jsFileMap[added.getRelative()] = added;
    }
    getJSNames() {
        return this.jsFiles.map(e => e.getRelative());
    }
    display() {
        console.log(`_____dir_____s`);
        this.dirs.forEach(e => {
            console.log(`DIR:${e.getDir()}\tREL:${e.getRelative()}\tABS:${e.getAbsolute()}`);
        });
        console.log(`_____jsFiles_____`);
        this.jsFiles.forEach(e => {
            console.log(`DIR:${e.getDir()}\tREL:${e.getRelative()}\tABS:${e.getAbsolute()}`);
        });
        console.log(`_____jsonFiles_____`);
        this.jsonFiles.forEach(e => {
            console.log(`DIR:${e.getDir()}\tREL:${e.getRelative()}\tABS:${e.getAbsolute()}`);
        });
        // console.log(`files`)
        // this.files.forEach(e=>{   console.log(`DIR:${e.getDir()}\tREL:${e.getRelative()}\tABS:${e.getAbsolute()}`)})
    }
}
exports.TransformableProject = TransformableProject;
class ProjectBuilder {
    constructor() {
        this.files = [];
        this.jsFiles = [];
        this.jsonFiles = [];
        this.dirs = [];
    }
    addFile(file) {
        this.files.push(file);
        if (file.isSource()) { // source code data
            this.jsFiles.push(file);
        }
        else if (file.isData()) { // non source code data
            this.jsonFiles.push(file);
        }
        return this;
    }
    setProjectDir(dir) {
        this.projectDir = dir;
        return this;
    }
    build() {
        return TransformableProject.ofBuilder(this);
    }
    addDir(dir) {
        this.dirs.push(dir);
        return this;
    }
    setProjType(projType) {
        this.projType = projType;
        return this;
    }
    addPackageJson(packageJSON) {
        this.packageJSON = packageJSON;
    }
}
