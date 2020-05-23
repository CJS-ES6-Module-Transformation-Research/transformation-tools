#!/usr/local/bin/ts-node
import {Transformer} from "../Transformer";
import {
    accessReplace,
    collectDefaultObjectAssignments,
    flattenDecls,
    jsonRequire,
    requireStringSanitizer
} from '../../';
import {argv} from "process";
import {projectReader, TransformableProject} from "../../abstract_representation/project_representation";
import {existsSync} from "fs";
import {join} from 'path';
// sanitize(transformer)
import {transformImport} from '../import_transformations/visitors/import_replacement'
import {transformBaseExports} from "./visitors/exportTransformMain";

argv.shift();
argv.shift();

const pwd = process.cwd();// dirname(argv.shift());

let source: string, dest: string, inPlace: boolean

switch (argv.length) {
    case 0:
        console.log("no arguments supplied");
        process.exit(1);
    case 1:
        let arg = argv.shift();
        if (arg === '-i') {
            console.log('please provide a project to transform')
        } else {
            console.log('please confirm you want to do this in place with the -i flag prior to your directory.')
        }
        process.exit(1);
    case 2:
        let first = argv.shift()
        let second = argv.shift()
        if (first === '-i') {
            inPlace = true;
            source = join(pwd, second);
            dest = join(pwd, source);
        } else {
            inPlace = false;
            source = join(pwd, first);
            dest = join(pwd, second);
        }
        if (!existsSync(dest)) {
            console.log(`Target directory ${dest} was not found: creating... `)
        }
        argv[2] = source;
        argv[3] = dest;
        console.log(argv)
        console.log()
        break;
    default: {
        console.log('Args: ')
        console.log(argv)
        console.log('could not parse arguments--try again')
        process.exit(1);
    }
}

let project: TransformableProject = projectReader(source);
let transformer: Transformer = Transformer.ofProject(project);

transformer.transform(transformBaseExports)
if (inPlace) {
    project.writeOutInPlace('.pre-transform')
} else {
    project.writeOutNewDir(dest)


}
console.log("finished.")
