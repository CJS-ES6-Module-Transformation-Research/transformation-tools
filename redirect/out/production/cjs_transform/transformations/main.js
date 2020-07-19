Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = void 0;
const Transformer_1 = require("./Transformer");
const visitors_1 = require("./sanitizing/visitors");
const process_1 = require("process");
const path_1 = require("path");
const fs_1 = require("fs");
const project_representation_1 = require("../abstract_representation/project_representation");
const exec_transform_1 = require("./import_transformations/exec_transform");
const exportTransformMain_1 = require("./export_transformations/visitors/exportTransformMain");
function sanitize(transformer) {
    transformer.transform(visitors_1.requireStringSanitizer);
    transformer.transformWithProject(visitors_1.jsonRequire);
    transformer.transform(visitors_1.flattenDecls);
    transformer.transform(visitors_1.accessReplace);
    transformer.rebuildNamespace();
    transformer.transform(visitors_1.collectDefaultObjectAssignments);
}
exports.sanitize = sanitize;
process_1.argv.shift();
process_1.argv.shift();
// argv[0] = ``
// argv[1] = ``
const pwd = process.cwd(); // dirname(argv.shift());
let source, dest, inPlace;
switch (process_1.argv.length) {
    case 0:
        console.log("no arguments supplied");
        process.exit(1);
    case 1:
        let arg = process_1.argv.shift();
        if (arg === '-i') {
            console.log('please provide a project to transform');
        }
        else {
            console.log('please confirm you want to do this in place with the -i flag prior to your directory.');
        }
        process.exit(1);
    case 2:
        let first = process_1.argv.shift();
        let second = process_1.argv.shift();
        if (first === '-i') {
            inPlace = true;
            source = path_1.join(pwd, second);
            dest = path_1.join(pwd, source);
        }
        else {
            inPlace = false;
            source = path_1.join(pwd, first);
            dest = path_1.join(pwd, second);
        }
        if (!fs_1.existsSync(dest)) {
            console.log(`Target directory was not found: creating... `);
        }
        process_1.argv[2] = source;
        process_1.argv[3] = dest;
        console.log(process_1.argv);
        console.log();
        break;
    default: {
        console.log('Args: ');
        console.log(process_1.argv);
        console.log('could not parse arguments--try again');
        process.exit(1);
    }
}
let project = project_representation_1.projectReader(source);
let transformer = Transformer_1.Transformer.ofProject(project);
sanitize(transformer);
exec_transform_1.importTransforms(transformer);
transformer.transform(exportTransformMain_1.transformBaseExports);
// transformer.transform(transformImport)
if (inPlace) {
    project.writeOutInPlace('.suffix');
}
else {
    project.writeOutNewDir(dest);
}
console.log("finished.");
