Object.defineProperty(exports, "__esModule", { value: true });
var import_visitor_1 = require("./import-visitor");
function transformImports(transformer) {
    console.log("Starting Import Transformations");
    transformer.transformWithTypeReturn(import_visitor_1.importVisitor, import_visitor_1.mutator_imports);
    transformer.currentPrograms().forEach(function (e) { return console.log(e.name + "\n" + e.program + "\n\n"); });
    console.log("Finished Import Transformations");
}
exports.transformImports = transformImports;
