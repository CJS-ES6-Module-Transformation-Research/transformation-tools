function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var TransformableProject_1 = require("./abstract_representation/project_representation/project/TransformableProject");
exports.TransformableProject = TransformableProject_1.TransformableProject;
var FileProcessing_1 = require("./abstract_representation/project_representation/project/FileProcessing");
exports.projectReader = FileProcessing_1.projectReader;
var visitors_1 = require("./transformations/sanitizing/visitors");
exports.accessReplace = visitors_1.accessReplace;
exports.flattenDecls = visitors_1.flattenDecls;
exports.requireStringSanitizer = visitors_1.requireStringSanitizer;
exports.collectDefaultObjectAssignments = visitors_1.collectDefaultObjectAssignments;
__export(require("./abstract_representation/project_representation"));
