Object.defineProperty(exports, "__esModule", { value: true });
var Transformer_1 = require("../Transformer");
var visitors_1 = require("./visitors");
var process_1 = require("process");
var project_representation_1 = require("../../abstract_representation/project_representation");
function santiize(transformer) {
    transformer.transform(visitors_1.requireStringSanitizer);
    transformer.transformWithProject(visitors_1.jsonRequire);
    transformer.transform(visitors_1.flattenDecls);
    transformer.transform(visitors_1.accessReplace);
    transformer.rebuildNamespace();
    transformer.transform(visitors_1.collectDefaultObjectAssignments);
}
exports.santiize = santiize;
var pwd = process_1.argv.shift();
process_1.argv.shift();
var source, dest, inPlace;
switch (process_1.argv.length) {
    case 0:
        console.log("no arguments supplied");
        process.exit(1);
    case 1:
        var arg = process_1.argv.shift();
        if (arg === '-i') {
            console.log('please provide a project to transform');
        }
        else {
            console.log('please confirm you want to do this in place with the -i flag prior to your directory.');
        }
        process.exit(1);
    case 2:
        var first = process_1.argv.shift();
        var second = process_1.argv.shift();
        if (first === '-i') {
            inPlace = true;
            source = second;
            dest = source;
        }
        else {
            inPlace = false;
            source = first;
            dest = second;
        }
        break;
    default: {
        console.log('could not parse arguments--try again');
        process.exit(1);
    }
}
var project = project_representation_1.projectReader(source, 'script');
var transformer = Transformer_1.Transformer.ofProject(project);
santiize(transformer);
if (inPlace) {
    project.writeOutInPlace('.pre-transform');
}
else {
    project.writeOutNewDir(dest);
}
console.log("finished.");
