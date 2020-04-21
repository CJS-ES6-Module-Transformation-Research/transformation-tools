var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FS_1 = require("src/abstract_representation/project_representation/FS");
var FSObject = /** @class */ (function () {
    function FSObject(dir, rel, priority) {
        this.dir = dir;
        this.relative = rel;
        this.full = dir + '/' + rel;
        this.reportPriority = priority;
    }
    FSObject.prototype.getDir = function () {
        return this.dir;
    };
    FSObject.prototype.getRelative = function () {
        return this.relative;
    };
    FSObject.prototype.getFull = function () {
        return this.full;
    };
    return FSObject;
}());
var Dir = /** @class */ (function (_super) {
    __extends(Dir, _super);
    function Dir(dir, rel) {
        return _super.call(this, dir, rel, 2) || this;
    }
    return Dir;
}(FSObject));
var ProjectFile = /** @class */ (function (_super) {
    __extends(ProjectFile, _super);
    function ProjectFile(dir, rel, file, priority) {
        var _this = _super.call(this, dir, rel, priority) || this;
        _this.file = file;
        _this.full = dir + '/' + file;
        return _this;
    }
    ProjectFile.prototype.isSource = function () {
        return false;
    };
    ;
    ProjectFile.prototype.isData = function () {
        return false;
    };
    ;
    return ProjectFile;
}(FSObject));
exports.ProjectFile = ProjectFile;
var ReadableFile = /** @class */ (function (_super) {
    __extends(ReadableFile, _super);
    function ReadableFile(dir, rel, file, priority) {
        var _this = _super.call(this, dir, rel, file, priority) || this;
        _this.text = FS_1.readFileSync(_this.full).toString();
        return _this;
    }
    ReadableFile.prototype.getText = function () {
        return this.text;
    };
    ReadableFile.prototype.isData = function () {
        return true;
    };
    return ReadableFile;
}(ProjectFile));
exports.ReadableFile = ReadableFile;
var JSONFile = /** @class */ (function (_super) {
    __extends(JSONFile, _super);
    function JSONFile(dir, rel, file) {
        return _super.call(this, dir, rel, file, 1) || this;
    }
    JSONFile.prototype.createJSExport = function () {
        throw new Error();
    };
    return JSONFile;
}(ReadableFile));
exports.JSONFile = JSONFile;
var OtherFile = /** @class */ (function (_super) {
    __extends(OtherFile, _super);
    function OtherFile(dir, rel, file) {
        return _super.call(this, dir, rel, file, 3) || this;
    }
    return OtherFile;
}(ProjectFile));
exports.OtherFile = OtherFile;
var SymLink = /** @class */ (function (_super) {
    __extends(SymLink, _super);
    function SymLink(dir, rel, file) {
        return _super.call(this, dir, rel, file, 3) || this;
    }
    return SymLink;
}(ProjectFile));
exports.SymLink = SymLink;
