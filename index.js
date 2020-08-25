Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE_TYPE = exports.print = exports.JPP = exports.project = void 0;
const path_1 = require("path");
exports.project = path_1.join(__dirname);
exports.JPP = (value) => {
    return JSON.stringify(value, null, 3);
};
function print(val) {
    console.log(val);
}
exports.print = print;
var FILE_TYPE;
(function (FILE_TYPE) {
    FILE_TYPE["JS"] = ".js";
    FILE_TYPE["JSON"] = ".json";
    FILE_TYPE["OTHER"] = "other";
    FILE_TYPE["SYMLINK"] = "SYMLINK";
})(FILE_TYPE = exports.FILE_TYPE || (exports.FILE_TYPE = {}));
//# sourceMappingURL=index.js.map