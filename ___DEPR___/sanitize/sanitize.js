Object.defineProperty(exports, "__esModule", { value: true });
var requireString_1 = require("./sanitize-visitors/requireString");
var declFlattener_1 = require("./sanitize-visitors/declFlattener");
var accessReplacer_1 = require("./sanitize-visitors/accessReplacer");
//OLD SIG = projectName: string, projectTarget: string | null
// export function depr.sanitize(project: ProjectData) {
function sanitize(transformer) {
    console.log("Starting SANITIZE Operations");
    transformer.transformWrapped(requireString_1.requireStringSanitizer);
    transformer.currentPrograms().forEach(function (e) { return console.log(e.name + "\n" + e.program + "\n\n"); });
    transformer.transformWithVisitors({ leave: declFlattener_1.leaveFlatten });
    transformer.currentPrograms().forEach(function (e) { return console.log(e.name + "\n" + e.program + "\n\n"); });
    transformer
        .transformWithTypeReturn(accessReplacer_1.accessDetectTransformer, {
        supplier: function () {
            var x = {};
            return x;
        },
        mutator: accessReplacer_1.populateAccessDecls
    });
    transformer.currentPrograms().forEach(function (e) { return console.log(e.name + "\n" + e.program + "\n\n"); });
    console.log("Finished SANITIZE Operations");
}
exports.sanitize = sanitize;
