#!/usr/local/bin/ts-node
import {isAbsolute, join} from "path";
import * as yargs from "yargs";
import {Arguments, Argv, CommandModule, InferredOptionType, Options, options, RequiredOptionType} from "yargs";
import {write_status} from "./src/abstract_fs_v2/interfaces";
import {ProjConstructionOpts, ProjectManager} from "./src/abstract_fs_v2/ProjectManager";
import executioner from "./src/executioner";


const cwd = process.cwd()

// test_resources.import path from 'path'

const copyCommandModule: CommandModule<ProgramArgs, ProgramArgs> = {
	command: "tf-copy <source> <dest>",
	builder: (args: Argv<ProgramArgs>): Argv<ProgramArgs> => {
		// .option('filter',{})
		return args
			.option('include-node_modules', {})

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
	builder: (args: Argv<ProgramArgs>): Argv<ProgramArgs> => {
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
let lit = {demandOption:true, choices:["named", "default"], nargs:1}
type opt = {demandOption:true, choices:["named", "default"], nargs:1}
interface ProgramArgs {
	source: string
	dest?: string
	suffix?: string
	copy_node_modules?: boolean
	// imports: InferredOptionType<{demandOption:true, choices:["named", "default"], nargs:1} >
}
let nameDefault:Options = {
	demandOption:true,
	choices:["named", "default"]
}

interface IFCSW{demandOption:boolean, choices:string[], nargs:number}
type _type = InferredOptionType<IFCSW>
type intersection  = ProgramArgs &  _type
const tf_args:Arguments<ProgramArgs>  = yargs//: Arguments<ProgramArgs >
	.command( {
		command: "tf-proj <source> [suffix]",
		builder: (args: Argv<ProgramArgs>): Argv<ProgramArgs> => {
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
	})
	.command(inPlaceCommandModule)
	.demandCommand()
	// .option("imports", {demandOption:true, choices:["named", "default"], nargs:1} as IFCSW )
	.strict()
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

let t = (tf_args.imports as InferredOptionType<any>)
let opts: ProjConstructionOpts = {
	isModule: false,
	suffix: suffix,
	target_dir: output,
	write_status: operation,
	copy_node_modules: false, //TODO
	isNamed:true //  tf_args.imports==="named"
}

executioner(new ProjectManager(input, opts))