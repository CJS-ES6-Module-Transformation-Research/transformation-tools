var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var relative_1 = __importDefault(require("relative"));
var TransformableProject_1 = require("./TransformableProject");
var JSFile_1 = require("../javascript/JSFile");
var JSONFile_1 = require("../javascript/JSONFile");
var FilesTypes_1 = require("./FilesTypes");
var illegalDirs = new Set();
illegalDirs.add("node_modules");
/**
 * creates a TransformableProject from project path string.
 * @param proj_dir project path string
 * @param processType string represernting whether the project uses ECMAScript modules or not.
 */
exports.projectReader = function (proj_dir, processType) {
    if (processType === void 0) { processType = 'script'; }
    var builder = TransformableProject_1.TransformableProject.builder();
    builder.setProjType(processType).setProjectDir(proj_dir);
    var absDir = '/' + relative_1.default('/', proj_dir, null);
    walk(absDir, processType);
    /**
     * recursive directory walk using a ProjectBuilder builder to add created ProjectFile(s) to the project.
     * @param dir the current directory being walked.
     */
    function walk(dir, readType) {
        if (readType === void 0) { readType = 'script'; }
        var ls = fs_1.readdirSync(dir);
        //for file|dir in `ls`
        ls.forEach(function (file) {
            //helps generate relative path
            var absFile = dir + "/" + file;
            //relative path wrt absolute directory
            var rel = relative_1.default(absDir, dir + "/" + file, null);
            //case isFile
            if (fs_1.lstatSync(absFile).isFile()) {
                var ext = path_1.extname(absFile);
                switch (ext) {
                    case ".js":
                        builder.addFile(new JSFile_1.JSFile(absDir, rel, file, readType));
                        break;
                    case ".json":
                        var json = void 0;
                        if (file === "package.json" && rel === "package.json") {
                            json = new JSONFile_1.PackageJSON(absDir);
                            builder.addPackageJson(json);
                        }
                        else {
                            json = new JSONFile_1.JSONFile(absDir, rel, file);
                        }
                        builder.addFile(json);
                        break;
                    default:
                        builder.addFile(new FilesTypes_1.OtherFile(absDir, rel, file));
                        break;
                }
                //case isDir
            }
            else if (fs_1.lstatSync(absFile).isDirectory()) {
                var absRelative = path_1.basename(absFile);
                if (illegalDirs.has(absRelative)) {
                    console.log("ignoring " + absRelative + " aka " + absFile);
                    return;
                }
                builder.addDir(new FilesTypes_1.Dir(dir, rel, file, 10));
                walk(absFile, readType);
                //case is symLink
            }
            else if (fs_1.lstatSync(absFile).isSymbolicLink()) {
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
