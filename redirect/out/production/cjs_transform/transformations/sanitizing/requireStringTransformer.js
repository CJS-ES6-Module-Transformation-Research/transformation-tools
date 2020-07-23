var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireStringTransformer = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const relative_1 = __importDefault(require("relative"));
const _JS = ".js";
const _JSON = ".json";
/**
 * Require String object transformer that generates the expected ES6 version of the require string.
 */
class RequireStringTransformer {
    constructor(dirname, main) {
        this.dirname = dirname;
        this.main = main;
    }
    absPath(path) {
        return path_1.resolve(this.dirname, path);
    }
    /**
     * Transforms require string to ES6 string based on project.
     * @param path require string.
     */
    getTransformed(path) {
        let absolute = this.absPath(path);
        let computedPath;
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
            computedPath = `${absolute}/${this.main ? this.main : 'index.js'}`;
        }
        let relativized = relative_1.default(this.dirname, computedPath, null);
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
    }
}
exports.RequireStringTransformer = RequireStringTransformer;
