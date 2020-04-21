Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var walker_1 = require("../fsys/walker");
function initProjectFS(projectName, projectTarget) {
    fs_1.mkdirSync(projectTarget, { recursive: true });
    var project = walker_1.traverseProject(projectName);
    var dirs = project.dirs.map(function (d) { return d.relative; });
    dirs.forEach(function (d) {
        try {
            fs_1.mkdirSync(projectTarget + "/" + d, { recursive: true });
        }
        catch (err) {
            // console.log( + " failed")
        }
        fs_1.mkdirSync(d, { recursive: true });
    });
    project.project = projectTarget;
    return project;
}
exports.initProjectFS = initProjectFS;
