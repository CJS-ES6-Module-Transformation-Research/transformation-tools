#!/Users/sam/.nvm/versions/node/v12.16.0/bin/ts-node
Object.defineProperty(exports, "__esModule", { value: true });
exports.project = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform";
exports.test_root = exports.project + "/test";
exports.fixtures = exports.test_root + "/res/fixtures";
exports.test_dir = exports.fixtures + "/test_dir";
exports.EXPECTED = exports.test_root + "/res/expected";
exports.ACTUAL = exports.test_root + "/res/actual";
exports.JPP = function (value) {
    return JSON.stringify(value, null, 3);
};
var FILE_TYPE;
(function (FILE_TYPE) {
    FILE_TYPE["JS"] = ".js";
    FILE_TYPE["JSON"] = ".json";
    FILE_TYPE["OTHER"] = "other";
    FILE_TYPE["SYMLINK"] = "SYMLINK";
})(FILE_TYPE = exports.FILE_TYPE || (exports.FILE_TYPE = {}));
