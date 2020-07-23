#!/usr/local/bin/ts-node
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = void 0;
const visitors_1 = require("./visitors");
const process_1 = require("process");
// import {projectReader, TransformableProject} from "../../abstract_representation/project_representation";
const fs_1 = require("fs");
const path_1 = require("path");
function sanitize(projectManager) {
    projectManager.forEachSource(visitors_1.requireStringSanitizer);
    projectManager.forEachSource(visitors_1.jsonRequire);
    projectManager.forEachSource(visitors_1.flattenDecls);
    projectManager.forEachSource(visitors_1.accessReplace);
    projectManager.rebuildNamespace();
    projectManager.forEachSource(visitors_1.collectDefaultObjectAssignments);
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
