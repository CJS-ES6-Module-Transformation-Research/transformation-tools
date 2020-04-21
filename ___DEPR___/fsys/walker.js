var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = __importStar(require("path"));
var index_1 = require("../../index");
var relative_1 = __importDefault(require("relative"));
var illegalDirs = new Set();
illegalDirs.add("node_modules");
function traverseProject(proj_dir) {
    var absDir = '/' + relative_1.default('/', proj_dir, null);
    var files_tr = [];
    var dirs_tr = [];
    traverseRecurse(absDir);
    function getFT(ext) {
        switch (ext) {
            case index_1.FILE_TYPE.JS:
                return index_1.FILE_TYPE.JS;
            case index_1.FILE_TYPE.JSON:
                return index_1.FILE_TYPE.JSON;
            default:
                return index_1.FILE_TYPE.OTHER;
        }
    }
    function traverseRecurse(dir) {
        var ls = fs_1.readdirSync(dir);
        ls.forEach(function (file) {
            var absFile = dir + "/" + file;
            if (fs_1.lstatSync(absFile).isFile()) {
                var ext = path_1.extname(absFile);
                files_tr.push({
                    dir: dir,
                    file: file,
                    full: dir + '/' + file,
                    ftype: getFT(ext),
                    relative: relative_1.default(absDir, dir + "/" + file, null)
                });
            }
            else if (fs_1.lstatSync(absFile).isDirectory()) {
                var absRelative = path_1.default.basename(absFile);
                if (illegalDirs.has(absRelative)) {
                    console.log("ignoring " + absRelative + " aka " + absFile);
                    return;
                }
                dirs_tr.push({ dir: absFile, relative: relative_1.default(absDir, absFile, null) });
                traverseRecurse(absFile);
            }
            else if (fs_1.lstatSync(absFile).isSymbolicLink()) {
                var ext = path_1.extname(absFile);
                files_tr.push({
                    dir: dir,
                    file: file,
                    full: dir + '/' + file,
                    ftype: index_1.FILE_TYPE.SYMLINK,
                    relative: relative_1.default(absDir, dir + "/" + file, null)
                });
            }
            else {
                console.log("NONE OF THE ABOVE: " + absFile + " is not a file, link or dir!");
            }
        });
    }
    var projectFS = { project: absDir, files: files_tr, dirs: dirs_tr };
    return projectFS;
}
exports.traverseProject = traverseProject;
