var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var JSFile_1 = require("../javascript/JSFile");
var fs_1 = require("fs");
var relative_1 = __importDefault(require("relative"));
var path_1 = __importDefault(require("path"));
var TransformableProject = /** @class */ (function () {
    function TransformableProject(builder) {
        var _this = this;
        this.jsFileMap = {};
        this.jsonFileMap = {};
        this.dirs = [];
        this.files = builder.files;
        this.packageJSON = builder.packageJSON;
        this.projType = builder.projType;
        this.jsFiles = builder.jsFiles;
        this.jsFiles.forEach(function (jsf) {
            _this.jsFileMap[jsf.getRelative()] = jsf;
        });
        this.jsonFiles = builder.jsonFiles;
        this.jsonFiles.forEach(function (jsf) {
            _this.jsonFileMap[jsf.getRelative()] = jsf;
        });
        this.dirs = builder.dirs;
        this.projectDir = builder.projectDir;
        this.originalFiles = new Set();
        this.files.forEach(function (e) { return _this.originalFiles.add(e.getRelative()); });
    }
    TransformableProject.getSpecifiedRelativeFile = function (relativeFile, jsonRequire, dir) {
        var REL = relative_1.default(relativeFile, jsonRequire, null);
        return REL;
    };
    TransformableProject.builder = function () {
        return new ProjectBuilder();
    };
    TransformableProject.ofBuilder = function (builder) {
        return new TransformableProject(builder);
    };
    ;
    TransformableProject.prototype.forEachSource = function (func) {
        this.jsFiles.forEach(func);
    };
    TransformableProject.prototype.writeOutInPlace = function (suffix) {
        this.writeOut(suffix, this.projectDir);
    };
    TransformableProject.prototype.writeOutNewDir = function (rootDir) {
        this.writeOut('', rootDir);
    };
    TransformableProject.prototype.writeOut = function (inPlaceSuffix, newProjDir) {
        if (this.projType === "module") {
            this.packageJSON.setModuleType(this.projType);
        }
        try {
            if (!fs_1.existsSync(newProjDir)) {
                fs_1.mkdirSync(newProjDir, { recursive: true });
            }
        }
        catch (err) {
            console.log("ERROR IN MK RootDir: " + err);
            throw err;
        }
        this.dirs.forEach(function (d) {
            try {
                fs_1.mkdirSync(newProjDir + '/' + d.getRelative(), { recursive: true });
            }
            catch (e) {
                console.log("ERROR IN MKDIR: " + e);
                throw e;
            }
        });
        if (inPlaceSuffix) {
            this.files.filter(function (e) { return !e.isData(); }).forEach(function (e) {
                var prefix = newProjDir + "/" + e.getRelative();
                fs_1.copyFileSync(prefix, "" + prefix + inPlaceSuffix);
            });
        }
        this.jsFiles.forEach(function (jsf) {
            fs_1.writeFileSync(newProjDir + "/" + jsf.getRelative(), jsf.makeString());
        });
        this.jsonFiles.forEach(function (jsf) {
            fs_1.writeFileSync(newProjDir + "/" + jsf.getRelative(), jsf.getText());
        });
    };
    TransformableProject.prototype.getJS = function (name) {
        return this.jsFileMap[name];
    };
    TransformableProject.prototype.getJSON = function (json) {
        return this.jsonFileMap[json];
    };
    TransformableProject.prototype.addJS = function (relative, data) {
        var added = new JSFile_1.JSFile(this.projectDir, relative, path_1.default.basename(relative), this.projType, data);
        this.files.push(added);
        this.jsFiles.push(added);
        this.jsFileMap[added.getRelative()] = added;
    };
    TransformableProject.prototype.getJSNames = function () {
        return this.jsFiles.map(function (e) { return e.getRelative(); });
    };
    TransformableProject.prototype.display = function () {
        console.log("_____dir_____s");
        this.dirs.forEach(function (e) {
            console.log("DIR:" + e.getDir() + "\tREL:" + e.getRelative() + "\tABS:" + e.getAbsolute());
        });
        console.log("_____jsFiles_____");
        this.jsFiles.forEach(function (e) {
            console.log("DIR:" + e.getDir() + "\tREL:" + e.getRelative() + "\tABS:" + e.getAbsolute());
        });
        console.log("_____jsonFiles_____");
        this.jsonFiles.forEach(function (e) {
            console.log("DIR:" + e.getDir() + "\tREL:" + e.getRelative() + "\tABS:" + e.getAbsolute());
        });
        // console.log(`files`)
        // this.files.forEach(e=>{   console.log(`DIR:${e.getDir()}\tREL:${e.getRelative()}\tABS:${e.getAbsolute()}`)})
    };
    return TransformableProject;
}());
exports.TransformableProject = TransformableProject;
var ProjectBuilder = /** @class */ (function () {
    function ProjectBuilder() {
        this.files = [];
        this.jsFiles = [];
        this.jsonFiles = [];
        this.dirs = [];
    }
    ProjectBuilder.prototype.addFile = function (file) {
        this.files.push(file);
        if (file.isSource()) { // source code data
            this.jsFiles.push(file);
        }
        else if (file.isData()) { // non source code data
            this.jsonFiles.push(file);
        }
        return this;
    };
    ProjectBuilder.prototype.setProjectDir = function (dir) {
        this.projectDir = dir;
        return this;
    };
    ProjectBuilder.prototype.build = function () {
        return TransformableProject.ofBuilder(this);
    };
    ProjectBuilder.prototype.addDir = function (dir) {
        this.dirs.push(dir);
        return this;
    };
    ProjectBuilder.prototype.setProjType = function (projType) {
        this.projType = projType;
        return this;
    };
    ProjectBuilder.prototype.addPackageJson = function (packageJSON) {
        this.packageJSON = packageJSON;
    };
    return ProjectBuilder;
}());
