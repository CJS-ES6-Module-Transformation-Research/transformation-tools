Object.defineProperty(exports, "__esModule", { value: true });
var FS_1 = require("src/abstract_representation/project_representation/FS");
var ProjectBuilder = /** @class */ (function () {
    function ProjectBuilder() {
        this.files = [];
        this.jsFiles = [];
    }
    ProjectBuilder.prototype.addFile = function (file) {
        this.files.push(file);
        if (file.isSource()) {
            this.jsFiles.push(file);
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
    return ProjectBuilder;
}());
var TransformableProject = /** @class */ (function () {
    function TransformableProject(builder) {
        var _this = this;
        this.fileMap = {};
        this.files = builder.files;
        this.jsFiles = builder.jsFiles;
        this.jsFiles.forEach(function (jsf) {
            _this.fileMap[jsf.getRelative()] = jsf;
        });
        this.projectDir = builder.projectDir;
        this.originalFiles = new Set();
        this.files.forEach(function (e) { return _this.originalFiles.add(e.getRelative()); });
    }
    TransformableProject.builder = function () {
        return new ProjectBuilder();
    };
    TransformableProject.ofBuilder = function (builder) {
        return new TransformableProject(builder);
    };
    ;
    TransformableProject.prototype.forEachFile = function (func) {
        this.files.forEach(func);
    };
    TransformableProject.prototype.forEachSource = function (func) {
        this.jsFiles.forEach(func);
    };
    TransformableProject.prototype.writeOut = function () {
        var _this = this;
        var inPlaceSuffix = '.old';
        this.originalFiles.forEach(function (e) {
            var prefix = _this.projectDir + "/" + e;
            FS_1.renameSync(prefix, "" + prefix + inPlaceSuffix);
        });
        this.jsFiles.forEach(function (jsf) {
            FS_1.writeFileSync(jsf.getFull(), jsf.makeString());
        });
    };
    TransformableProject.prototype.getJS = function (name) {
        return this.fileMap[name];
    };
    return TransformableProject;
}());
exports.TransformableProject = TransformableProject;
