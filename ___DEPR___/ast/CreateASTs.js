var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
var fs_1 = require("fs");
var esprima_1 = require("esprima");
var shebang_regex_1 = __importDefault(require("shebang-regex"));
function createASTs(project) {
    return project.files
        .filter(function (f) { return f.ftype === index_1.FILE_TYPE.JS; })
        .map(function (file) {
        try {
            var program = fs_1.readFileSync(file.full)
                .toString();
            var shebang = '';
            if (shebang_regex_1.default.test(program)) {
                shebang = shebang_regex_1.default.exec(program)[0];
            }
            if (shebang) {
                program.replace(shebang, '');
            }
            return {
                dir: file.dir,
                filePath: file.relative,
                shebang: shebang,
                ast: esprima_1.parseScript(program.split('\n')[0]
                    .startsWith("#!")
                    ? program
                        .replace(program
                        .split('\n')[0], '')
                    : program)
            };
        }
        catch (err) {
            console.log("ERROR: " + err + " in file: " + file.relative);
            throw new Error("ERROR: " + err + " in file: " + file.relative);
        }
    });
}
exports.createASTs = createASTs;
