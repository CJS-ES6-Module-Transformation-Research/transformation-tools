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
var fs_1 = require("fs");
/**
 * abstract representation of a file's basic navigational data.
 */
var FSObject = /** @class */ (function () {
    function FSObject(dir, rel, file, priority) {
        this.dir = dir;
        this.relative = rel;
        this.abs = dir + '/' + rel;
        this.reportPriority = priority;
    }
    FSObject.prototype.getDir = function () {
        return this.dir;
    };
    FSObject.prototype.getRelative = function () {
        return this.relative;
    };
    FSObject.prototype.getAbsolute = function () {
        return this.abs;
    };
    return FSObject;
}());
var Dir = /** @class */ (function (_super) {
    __extends(Dir, _super);
    function Dir(dir, rel, file, priority) {
        return _super.call(this, dir, rel, file, priority) || this;
    }
    return Dir;
}(FSObject));
exports.Dir = Dir;
/**
 * representation of a file in a project.
 */
var ProjectFile = /** @class */ (function (_super) {
    __extends(ProjectFile, _super);
    function ProjectFile(dir, rel, file, priority) {
        var _this = _super.call(this, dir, rel, file, priority) || this;
        _this.file = file;
        _this.abs = dir + '/' + rel;
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
/**
 * representation of a file containing data within a project (.js or .json).
 */
var ReadableFile = /** @class */ (function (_super) {
    __extends(ReadableFile, _super);
    function ReadableFile(dir, rel, file, priority, text) {
        if (text === void 0) { text = ""; }
        var _this = _super.call(this, dir, rel, file, priority) || this;
        if (!text) {
            try {
                _this.text = fs_1.readFileSync(_this.abs).toString();
            }
            catch (e) {
                // console.log(`CAUGHT!`)
                // console.log(`\tdir: ${dir}\n\trel: ${rel}\n\tfile: ${file}\n\tabs: ${this.abs}`)
                throw e;
            }
        }
        else {
            _this.text = text;
        }
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
/**
 * anything other than .js .json (a symlink) or (a dir)
 */
var OtherFile = /** @class */ (function (_super) {
    __extends(OtherFile, _super);
    function OtherFile(dir, rel, file) {
        return _super.call(this, dir, rel, file, 3) || this;
    }
    return OtherFile;
}(ProjectFile));
exports.OtherFile = OtherFile;
/**
 * project representation of a symlink.
 */
var SymLink = /** @class */ (function (_super) {
    __extends(SymLink, _super);
    function SymLink(dir, rel, file) {
        return _super.call(this, dir, rel, file, 3) || this;
    }
    return SymLink;
}(ProjectFile));
exports.SymLink = SymLink;
