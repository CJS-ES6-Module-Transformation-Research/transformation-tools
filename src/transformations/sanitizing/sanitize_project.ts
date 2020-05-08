#!/usr/local/bin/ts-node
import {Transformer} from "../Transformer";
import {
    accessReplace,
    collectDefaultObjectAssignments,
    flattenDecls,
    requireStringSanitizer,
    jsonRequire
} from "./visitors";
import {argv} from "process";
import {projectReader, TransformableProject} from "../../abstract_representation/project_representation";
import {existsSync} from "fs";
import {join, dirname} from 'path';

console.log(argv)
console.log()

export function santiize(transformer: Transformer) {

    transformer.transform(requireStringSanitizer)
    transformer.transformWithProject(jsonRequire)
    transformer.transform(flattenDecls)
    transformer.transform(accessReplace)
    transformer.rebuildNamespace()
    // transformer.transform(collectDefaultObjectAssignments)

}


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
            console.log(`Source directory ${source} was not found. Please check input data.`)
        }

        break;
    default: {
        console.log('could not parse arguments--try again')
        process.exit(1);
    }
}

// console.log(pwd)
// console.log(`source ${source}`)
// console.log(`dest ${dest}`)
// console.log(`inmpl=ace ${inPlace}`)
// process.exit(1);


// const cjs = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform`;
// const srcDrawer = `${cjs}/real_projects`
// const projStr = `${srcDrawer}/get-repository-url`
// const OUT_DIR = `${cjs}/real_san/get-repository-url`
// let project: TransformableProject = projectReader(projStr);
// let transformer: Transformer = Transformer.ofProject(project);

// const cjs = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform`;
// const srcDrawer = `${cjs}/real_projects`
// const projStr = `${srcDrawer}/get-repository-url`
// const OUT_DIR = `${cjs}/real_san/get-repository-url`

let project: TransformableProject = projectReader(source);
let transformer: Transformer = Transformer.ofProject(project);





santiize(transformer)
if (inPlace) {
    project.writeOutInPlace('.pre-transform')
} else {
    project.writeOutNewDir(dest)

}
console.log("finished.")