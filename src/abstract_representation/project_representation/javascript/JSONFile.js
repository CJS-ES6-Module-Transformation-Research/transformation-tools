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
var FilesTypes_1 = require("../project/FilesTypes");
/**
 * project representation of a JSON object file.
 * contains text as data string.
 */
var JSONFile = /** @class */ (function (_super) {
    __extends(JSONFile, _super);
    function JSONFile(dir, rel, file) {
        return _super.call(this, dir, rel, file, 1) || this;
    }
    /**
     * is true, but is NOT source.
     */
    JSONFile.prototype.isData = function () {
        return true;
    };
    ;
    /**
     * creates an exportable version of itsself as an ES6 module.
     * //TODO implement
     */
    JSONFile.prototype.createJSExport = function () {
        throw new Error();
    };
    JSONFile.prototype.asJSON = function () {
        return JSON.parse(this.getText());
    };
    return JSONFile;
}(FilesTypes_1.ReadableFile));
exports.JSONFile = JSONFile;
/**
 * represents package.json. extends JSONFile to include setting default module type.
 */
var PackageJSON = /** @class */ (function (_super) {
    __extends(PackageJSON, _super);
    function PackageJSON(dir) {
        var _this = _super.call(this, dir, "package.json", "package.json") || this;
        try {
            _this.json = JSON.parse(_this.text);
        }
        catch (jsonParseError) {
            console.log("json parse error semicolon: " + jsonParseError + "\n in dir: " + dir);
        }
        return _this;
    }
    PackageJSON.prototype.setModuleType = function (modType) {
        var setType = modType === 'module' ? 'module' : 'commonjs';
        console.log("Setting module type of project: " + setType);
        this.json['type'] = setType;
    };
    return PackageJSON;
}(JSONFile));
exports.PackageJSON = PackageJSON;
// export const setModuleType = function
