var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var relative_1 = __importDefault(require("relative"));
var TransformableProject = /** @class */ (function () {
    function TransformableProject(builder) {
        var _this = this;
        this.fileMap = {};
        this.dirs = [];
        this.files = builder.files;
        this.jsFiles = builder.jsFiles;
        this.jsonFiles = builder.jsonFiles;
        this.jsFiles.forEach(function (jsf) {
            _this.fileMap[jsf.getRelative()] = jsf;
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
    TransformableProject.prototype.writeOut = function (inPlaceSuffix, newProjDir) {
        if (newProjDir === void 0) { newProjDir = this.projectDir; }
        if (!fs_1.existsSync(newProjDir)) {
            fs_1.mkdirSync(newProjDir, { recursive: true });
        }
        this.dirs.forEach(function (d) {
            try {
                fs_1.mkdirSync(d.getAbsolute(), { recursive: true });
            }
            catch (e) {
                console.log(e);
            }
        });
        if (inPlaceSuffix) {
            this.originalFiles.forEach(function (e) {
                var prefix = newProjDir + "/" + e;
                fs_1.renameSync(prefix, "" + prefix + inPlaceSuffix);
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
        return this.fileMap[name];
    };
    return TransformableProject;
}());
exports.TransformableProject = TransformableProject;
var ProjectBuilder = /** @class */ (function () {
    function ProjectBuilder() {
        this.files = [];
        this.jsFiles = [];
        this.jsonFiles = [];
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
    };
    return ProjectBuilder;
}());
