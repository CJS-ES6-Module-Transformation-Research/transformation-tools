#!/usr/local/bin/ts-node
Object.defineProperty(exports, "__esModule", { value: true });
const Transformer_1 = require("../Transformer");
const process_1 = require("process");
const project_representation_1 = require("../../abstract_representation/project_representation");
const fs_1 = require("fs");
const path_1 = require("path");
const exportTransformMain_1 = require("./visitors/exportTransformMain");
process_1.argv.shift();
process_1.argv.shift();
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
            console.log(`Target directory ${dest} was not found: creating... `);
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
transformer.transform(exportTransformMain_1.transformBaseExports);
if (inPlace) {
    project.writeOutInPlace('.pre-transform');
}
else {
    project.writeOutNewDir(dest);
}
console.log("finished.");