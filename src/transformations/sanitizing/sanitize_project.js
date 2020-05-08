#!/usr/local/bin/ts-node
Object.defineProperty(exports, "__esModule", { value: true });
var Transformer_1 = require("../Transformer");
var visitors_1 = require("./visitors");
var process_1 = require("process");
var project_representation_1 = require("../../abstract_representation/project_representation");
var fs_1 = require("fs");
var path_1 = require("path");
console.log(process_1.argv);
console.log();
function santiize(transformer) {
    transformer.transform(visitors_1.requireStringSanitizer);
    transformer.transformWithProject(visitors_1.jsonRequire);
    transformer.transform(visitors_1.flattenDecls);
    transformer.transform(visitors_1.accessReplace);
    transformer.rebuildNamespace();
    transformer.transform(visitors_1.collectDefaultObjectAssignments);
}
exports.santiize = santiize;
process_1.argv.shift();
process_1.argv.shift();
var pwd = process.cwd(); // dirname(argv.shift());
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
            source = path_1.join(pwd, second);
            dest = path_1.join(pwd, source);
        }
        else {
            inPlace = false;
            source = path_1.join(pwd, first);
            dest = path_1.join(pwd, second);
        }
        if (!fs_1.existsSync(dest)) {
            console.log("Source directory " + source + " was not found. Please check input data.");
        }
        break;
    default: {
        console.log('could not parse arguments--try again');
        process.exit(1);
    }
}
// console.log(pwd)
// console.log(`source ${source}`)
// console.log(`dest ${dest}`)
// console.log(`inmpl=ace ${inPlace}`)
// process.exit(1);
var cjs = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform";
var srcDrawer = cjs + "/real_projects";
var projStr = srcDrawer + "/get-repository-url";
var OUT_DIR = cjs + "/real_san/get-repository-url";
var project = project_representation_1.projectReader(projStr);
var transformer = Transformer_1.Transformer.ofProject(project);
santiize(transformer);
if (inPlace) {
    project.writeOutInPlace('.pre-transform');
}
else {
    project.writeOutNewDir(OUT_DIR);
}
console.log("finished.");
