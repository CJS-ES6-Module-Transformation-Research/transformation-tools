#!/usr/local/bin/ts-node
import * as yargs from "yargs";
import {Arguments, Argv, CommandModule} from "yargs";
import {isAbsolute, join} from "path";
import {write_status} from "./src/abstract_fs_v2/interfaces";
import {ProjConstructionOpts, ProjectManager} from "./src/abstract_fs_v2/ProjectManager";
import {transformBaseExports} from "./src/transformations/export_transformations/visitors/exportTransformMain";
import {transformImport} from "./src/transformations/import_transformations/visitors/import_replacement";
import {
    accessReplace, collectDefaultObjectAssignments,
    flattenDecls,
    jsonRequire,
    requireStringSanitizer
} from "./src/transformations/sanitizing/visitors";
import {addLocationVariables, req_filler} from "./src/transformations/sanitizing/visitors/__dirname";
import {requireRegistration} from "./src/transformations/sanitizing/visitors/requireRegistration";


const cwd = process.cwd()

let assert = require('assert')
let path = require('path')

const copyCommandModule: CommandModule<ProgramArgs, ProgramArgs> = {
    command: "tf-copy <source> <dest>",
    builder: (args: Argv<ProgramArgs>): Argv<ProgramArgs> =>{
        // .option('filter',{})
        return args
            .option('include-node_modules',{})

    },
    aliases: 'c',
    describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project, copying the result to a destination.",
    handler(args: yargs.Arguments<ProgramArgs>): void {
        switch (args._[0]) {
            case 'c':
                args._[0] = 'tf-copy'
                break;
        }
    }
}

const inPlaceCommandModule: CommandModule<ProgramArgs, ProgramArgs> = {
    command: "tf-proj <source> [suffix]",
    builder:  (args: Argv<ProgramArgs>): Argv<ProgramArgs> =>  {
        return args.option('', {});
    },
    aliases: 'i',
    describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project directory in-place.",
    handler(args: yargs.Arguments<ProgramArgs>): void {
        switch (args._[0]) {
            case 'i':
                args._[0] = 'tf-proj'
                break;
        }
        if (!args['suffix']) {
            args['suffix'] = ''
        }
    }
}

function commandBuilder(args: Argv<ProgramArgs>): Argv<ProgramArgs> {
    return args.option('', {});
}
interface ProgramArgs{
    source:string
    dest?:string
    suffix?:string
    copy_node_modules?:boolean
}

const tf_args:Arguments<ProgramArgs>  = yargs
    .command(copyCommandModule)
    .command(inPlaceCommandModule)
    .argv;
let input: string = tf_args.source;
let output = '';
let suffix = '';
let operation: write_status




if (tf_args._[0] === "tf-proj") {
    operation = "in-place";
    suffix = tf_args.suffix
} else if (tf_args._[0] === "tf-copy") {
    operation = "copy";
    output = tf_args.dest
    if (output && !isAbsolute(output)) {
        output = join(cwd, output)
    }
}

//no need for else, yargs won't find command: will exit for us




if (!isAbsolute(input)) {
    input = join(cwd, input)
}



let opts: ProjConstructionOpts = {
    isModule: false,
    suffix: suffix,
    target_dir: output,
    write_status: operation,
    copy_node_modules:false //TODO
}


let projectManager = new ProjectManager(input, opts)
let rootabs = input


//require strings x2
projectManager.forEachSource(requireStringSanitizer)
projectManager.forEachSource(jsonRequire)

//location of require call to varaible declarations
projectManager.forEachSource(flattenDecls)

//get all requires already declared
projectManager.forEachSource(requireRegistration)

//declare undeclared requires
projectManager.forEachSource(accessReplace)


//__dirname
projectManager.forEachSource(addLocationVariables)

//push all requires back to ast
projectManager.forEachSource(req_filler)

//exports sanitize, flatten object literal assignment
projectManager.forEachSource(collectDefaultObjectAssignments)


projectManager.forEachSource(js=>{js.setAsModule()})
// importTransforms(projectManager)
projectManager.forEachPackage(pkg=>pkg.makeModule())
projectManager.forEachSource(transformImport);
;

projectManager.forEachSource(transformBaseExports)


projectManager.writeOut()
