var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectReader = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const relative_1 = __importDefault(require("relative"));
const TransformableProject_1 = require("./TransformableProject");
const JSFile_1 = require("../javascript/JSFile");
const JSONFile_1 = require("../javascript/JSONFile");
const FilesTypes_1 = require("./FilesTypes");
const illegalDirs = new Set();
illegalDirs.add("node_modules");
illegalDirs.add(".git");
/**
 * creates a TransformableProject from project path string.
 * @param proj_dir project path string
 * @param processType string represernting whether the project uses ECMAScript modules or not.
 */
exports.projectReader = function (proj_dir, processType = 'script') {
    let builder = TransformableProject_1.TransformableProject.builder();
    builder.setProjType(processType).setProjectDir(proj_dir);
    let absDir = '/' + relative_1.default('/', proj_dir, null);
    walk(absDir, processType);
    /**
     * recursive directory walk using a ProjectBuilder builder to add created ProjectFile(s) to the project.
     * @param dir the current directory being walked.
     */
    function walk(dir, readType = 'script') {
        let ls;
        try {
            ls = fs_1.readdirSync(dir);
        }
        catch (readDirError) {
            console.log(`ERROR: ${readDirError} \n in file ${proj_dir} \ncurrent called dir: ${dir}`);
            throw readDirError;
        }
        //for file|dir in `ls`
        ls.forEach((file) => {
            //helps generate relative path
            let absFile = `${dir}/${file}`;
            //relative path wrt absolute directory
            let rel = relative_1.default(absDir, `${dir}/${file}`, null);
            //case isFile
            if (fs_1.lstatSync(absFile).isFile()) {
                let ext = path_1.extname(absFile);
                switch (ext) {
                    case ".js":
                        try {
                            builder.addFile(new JSFile_1.JSFile(absDir, rel, file, readType));
                        }
                        catch (errrr) {
                            console.log(errrr);
                            console.log(`${absFile}  `);
                        }
                        break;
                    case ".json":
                        let json;
                        //package.json test //TODO add cases for multi package files
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
                let absRelative = path_1.basename(absFile);
                if (illegalDirs.has(absRelative)) {
                    console.log(`ignoring ${absRelative} aka ${absFile}`);
                    return;
                }
                builder.addDir(new FilesTypes_1.Dir(dir, rel, file, 10));
                walk(absFile, readType);
                //case is symLink
            }
            else if (fs_1.lstatSync(absFile).isSymbolicLink()) {
                let ext = path_1.extname(absFile);
                builder.addFile(new FilesTypes_1.SymLink(dir, rel, file));
            }
            else {
                console.log(`NONE OF THE ABOVE: ${absFile} is not a file, link or dir!`);
            }
        });
    }
    return builder.build();
};
