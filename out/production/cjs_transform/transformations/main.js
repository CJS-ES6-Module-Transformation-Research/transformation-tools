Object.defineProperty(exports, "__esModule", { value: true });
var FileProcessing_1 = require("../abstract_representation/project_representation/project/FileProcessing");
var requireString_1 = require("./sanitizing/visitors/requireString");
var accessReplacer_1 = require("./sanitizing/visitors/accessReplacer");
var declFlattener_1 = require("./sanitizing/visitors/declFlattener");
var exportObjectNamer_1 = require("./sanitizing/visitors/exportObjectNamer");
var Transformer_1 = require("./Transformer");
var test_root = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/fixtures/test_dir";
var import_replacement_1 = require("./import_transformations/visitors/import_replacement");
var exportCollector_1 = require("./export_transformations/visitors/exportCollector");
var arg1 = test_root + "_2";
console.log("script start");
var project = FileProcessing_1.projectReader(arg1);
console.log("finished reading in");
var transformer = Transformer_1.Transformer.ofProject(project);
// console.log('about to tf')
transformer.transform(requireString_1.requireStringSanitizer);
// console.log('about to tf1')
//
transformer.transform(declFlattener_1.flattenDecls);
// console.log('about to tf2')
transformer.transform(accessReplacer_1.accessReplace);
transformer.rebuildNamespace();
transformer.transform(exportObjectNamer_1.collectDefaultObjectAssignments);
// console.log('about to write out')
transformer.transform(import_replacement_1.transformImport);
transformer.transform(exportCollector_1.exportTransform);
project.writeOut('.old');
