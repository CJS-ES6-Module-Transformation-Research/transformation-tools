#!/Users/sam/.nvm/versions/node/v12.16.0/bin/ts-node
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var sanitize_1 = require("../depr/sanitize/sanitize");
var projectStructurBuilder_1 = require("./projectStructurBuilder");
var readOut_1 = require("../depr/io/readOut");
var transformationTools_1 = require("../depr/ast/transformationTools");
var transform_import_1 = require("../depr/import_transformations/transform_import");
console.log("TEST0");
function default_1(args) {
    var len = -1;
    function verifyArgs(arr) {
        if (arr.length < 3) {
            console.log("Must pass 2 arguments: source project and target location for new project");
        }
        else if (!fs_1.existsSync(arr[2])) {
            console.log("Project directory root " + arr[2] + " does not exist!");
        }
        else if (arr.length >= 4 && fs_1.existsSync(arr[3])) {
            console.log("BAD STATE: " + arr[3] + " cannot already exist in the filesystem.");
        }
        else {
            return false;
        }
        return true;
    }
    if (verifyArgs(args)) {
        console.log('exit');
        process.exit(3);
    }
    var projectName = path_1.resolve(args[2]);
    var projectTarget = '';
    var project;
    if (args[3]) {
        projectTarget = path_1.resolve(args[3]);
        project = projectStructurBuilder_1.generateProjectData(projectName, projectTarget);
    }
    else {
        project = projectStructurBuilder_1.generateProjectData(projectName);
    }
    console.log("TARGET " + projectTarget);
    var transformer = new transformationTools_1.ASTTransformer(project.asts);
    sanitize_1.sanitize(transformer);
    //TODO     program.body.reverse().forEach((dirname) => program.body.splice(0, 0, dirname))
    //TODO     find a better place (not replaceJS) for string replace
    transform_import_1.transformImports(transformer);
    console.log("TARGET " + projectTarget);
    readOut_1.replaceJS(project.asts, project.project.files, projectName, projectTarget);
}
exports.default = default_1;
console.log("TEST1 ");
