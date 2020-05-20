#!/usr/local/bin/ts-node

import {projectReader} from '../abstract_representation/project_representation/project/FileProcessing'
import {TransformableProject} from "../abstract_representation/project_representation/project/TransformableProject";

import yargs from "yargs";

import {Transformer} from "./Transformer";

import {argv as process_args} from "process";
import {existsSync} from "fs";
import {join, dirname} from 'path';
import {transformImport} from "./import_transformations/visitors/import_replacement";
import {sanitize} from "./sanitizing/sanitize_project";
// import {Options, argv, CommandBuilder, CommandModule, Arguments} from "yargs";
import {cli_parse} from "../util/cli/yargs_utils";
//
// for (let i = 0; i < 2; i++){
//     argv.shift();
//
// }
// const pwd = process.cwd();
//
// let source: string, dest: string, inPlace: boolean
//
// switch (argv.length) {
//     case 0:
//         console.log("no arguments supplied");
//         process.exit(1);
//     case 1:
//         let arg = argv.shift();
//         if (arg === '-i') {
//             console.log('please provide a project to transform')
//         } else {
//             console.log('please confirm you want to do this in place with the -i flag prior to your directory.')
//         }
//         process.exit(1);
//     case 2:
//         let first = argv.shift()
//         let second = argv.shift()
//         if (first === '-i') {
//             inPlace = true;
//             source = join(pwd, second);
//             dest = join(pwd, source);
//         } else {
//             inPlace = false;
//             source = join(pwd, first);
//             dest = join(pwd, second);
//         }
//         if (!existsSync(dest)) {
//             console.log(`Source directory ${source} was not found. Please check input data.`)
//         }
//         argv[2] = source;
//         argv[3] = dest;
//         console.log(argv)
//         console.log()
//         break;
//     default: {
//         console.log('Args: ')
//         console.log(argv)
//         console.log('could not parse arguments--try again')
//         process.exit(1);
//     }
// }


// myBuilder['sanitize'] = {
//     builder: args => {
//         console.log(`ARGS${args}`)
//     },
//     aliases:'s'
//
// }

// .options()
//     \.completion("exec", function (current, argv) {
//     if (argv.length === 0) {
//
//     }
//     switch (argv[argv.length - 1]) {
//
//     }
// })
console.log('test!')
const args = cli_parse(yargs);
type sani =  'sanitize'| null
type imp =  'import'| null
type exp =  'export'| null
type all =  'all'| null

//////////////////////////////////////////////////////////////////////////////
interface commands {
    sanitize_only?: 'sanitize_only';
    sanitize? : sani,
    import? : imp,
    export? : exp,
    all? : all
}
//////////////////////////////////////////////////////////////////////////////
const inputPath: string = args.in;
const output: string = args.out;
if (!args['in-place'] && !args["out"]) {
    console.log(`Please either choose an output directory --out <out-dir> or use the flag --in-place`)
    process.exit(1);
}

const no_sanitize = args["no-sanitize"]
//////////////////////////////////////////////////////////////////////////////
function extract_cmd_args():commands {
    let command_parse: commands = {}

    if (args.cmd === 'sanitize') {
        command_parse.sanitize = 'sanitize';
    }
    if (args.cmd === 'sanitize-only') {
        command_parse.sanitize_only = 'sanitize_only';
    }
    if (args.cmd === 'import') {
        command_parse.import = 'import';
    }
    if (args.cmd === 'export') {
        command_parse.export = 'export';
    }
    if (args.cmd === 'all') {
        command_parse.all = 'all';
    }
    return command_parse;
}
//////////////////////////////////////////////////////////////////////////////
let command_list = extract_cmd_args();
const inputProject:string  =args.input;
const outputProjectDir:string = args.out === 'in-place' ? inputProject: args.out;
let inPlace:boolean = false;
if (args.out === 'in-place'){
    inPlace = true;
}
//////////////////////////////////////////////////////////////////////////////







switch (args.cmd) {
    case "sanitize":

        break;
        if (no_sanitize) break;
    case "import":
        break;
    case "export":
        break;
    case "run-all":
    case "execute":

        break;
    default:
        break;
}



    console.log(args)

// console.log(JSON.stringify(args, null, 4))


// let project: TransformableProject = projectReader(source);
// let transformer: Transformer = Transformer.ofProject(project);
//
//
// sanitize(transformer)
// transformer.transform(transformImport)
// if (inPlace) {
//     project.writeOutInPlace('.pre-transform')
// } else {
//     project.writeOutNewDir(dest)
//
// }
// console.log("finished.")
