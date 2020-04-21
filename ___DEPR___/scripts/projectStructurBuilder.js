Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var walker_1 = require("../fsys/walker");
var CreateASTs_1 = require("../ast/CreateASTs");
function initProjectFS(projectName, projectTarget, project) {
    fs_1.mkdirSync(projectTarget, { recursive: true });
    var dirs = project.dirs.map(function (d) { return d.relative; });
    dirs.forEach(function (d) {
        try {
            fs_1.mkdirSync(projectTarget + "/" + d, { recursive: true });
        }
        catch (err) {
            console.log("FAILURE: " + err);
        }
        fs_1.mkdirSync(d, { recursive: true });
    });
}
function generateProjectData(projectName, projectTarget) {
    if (projectTarget === void 0) { projectTarget = ''; }
    var project = walker_1.traverseProject(projectName);
    if (projectTarget) {
        initProjectFS(projectName, projectTarget, project);
    }
    var astdata = CreateASTs_1.createASTs(project);
    return {
        project: project,
        asts: astdata
    };
}
exports.generateProjectData = generateProjectData;
