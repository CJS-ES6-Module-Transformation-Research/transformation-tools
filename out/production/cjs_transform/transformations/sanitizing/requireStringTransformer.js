var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var relative_1 = __importDefault(require("relative"));
var _JS = ".js";
var _JSON = ".json";
var RequireStringTransformer = /** @class */ (function () {
    function RequireStringTransformer(dirname) {
        this.dirname = dirname;
    }
    RequireStringTransformer.prototype.absPath = function (path) {
        return path_1.resolve(this.dirname, path);
    };
    RequireStringTransformer.prototype.getTransformed = function (path) {
        var absolute = this.absPath(path);
        var computedPath;
        if (path.charAt(0) !== '.' && path.charAt(0) !== '/') {
            return path;
        }
        else if ((isBoth(absolute) && path.lastIndexOf('/') !== (path.length - 1))
            || !isDir(absolute)) {
            if (isJS(absolute)) {
                computedPath = path_1.extname(absolute) !== "" ? absolute : absolute + _JS;
            }
            else if (isJSON(absolute)) {
                computedPath = path_1.extname(absolute) !== "" ? absolute : absolute + _JSON;
            }
            else {
                computedPath = absolute;
            }
        }
        else { //directory
            computedPath = absolute + "/index.js";
        }
        var relativized = relative_1.default(this.dirname, computedPath, null);
        if (!(relativized.charAt(0) === '.') && !(relativized.charAt(0) === '/')) {
            relativized = "./" + relativized;
        }
        function isBoth(path) {
            return ((isJS(path) || isJSON(path))
                && isDir(path));
        }
        function isJS(path) {
            return path_1.extname(path) === _JS
                || fs_1.existsSync(path + _JS);
        }
        function isJSON(path) {
            return path_1.extname(path) === _JSON || fs_1.existsSync(path + _JSON);
        }
        function isDir(path) {
            try {
                return fs_1.lstatSync(path).isDirectory();
            }
            catch (err) {
                return false;
            }
        }
        return relativized;
    };
    return RequireStringTransformer;
}());
exports.RequireStringTransformer = RequireStringTransformer;
