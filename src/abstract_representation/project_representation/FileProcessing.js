var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var FS_1 = require("src/abstract_representation/project_representation/FS");
var path_1 = require("path");
var relative_1 = __importDefault(require("relative"));
var FS_2 = require("./FS");
var JS_1 = require("./JS");
var FilesTypes_1 = require("./FilesTypes");
var illegalDirs = new Set();
illegalDirs.add("node_modules");
exports.ProcessProject = function (proj_dir, processType) {
    if (processType === void 0) { processType = 'script'; }
    var builder = FS_2.TransformableProject.builder();
    builder.setProjectDir(proj_dir);
    var absDir = '/' + relative_1.default('/', proj_dir, null);
    traverseRecurseOO(absDir);
    function traverseRecurseOO(dir) {
        var ls = FS_1.readdirSync(dir);
        ls.forEach(function (file) {
            var absFile = dir + "/" + file;
            var rel = relative_1.default(absDir, dir + "/" + file, null);
            if (FS_1.lstatSync(absFile).isFile()) {
                var ext = path_1.extname(absFile);
                switch (ext) {
                    case ".js":
                        builder.addFile(new JS_1.JSFile(dir, rel, file, processType));
                        break;
                    case ".json":
                        builder.addFile(new FilesTypes_1.JSONFile(dir, rel, file));
                        break;
                    default:
                        builder.addFile(new FilesTypes_1.OtherFile(dir, rel, file));
                        break;
                }
            }
            else if (FS_1.lstatSync(absFile).isDirectory()) {
                var absRelative = path_1.basename(absFile);
                if (illegalDirs.has(absRelative)) {
                    console.log("ignoring " + absRelative + " aka " + absFile);
                    return;
                }
                traverseRecurseOO(absFile);
            }
            else if (FS_1.lstatSync(absFile).isSymbolicLink()) {
                var ext = path_1.extname(absFile);
                builder.addFile(new FilesTypes_1.SymLink(dir, rel, file));
            }
            else {
                console.log("NONE OF THE ABOVE: " + absFile + " is not a file, link or dir!");
            }
        });
    }
    return builder.build();
};
