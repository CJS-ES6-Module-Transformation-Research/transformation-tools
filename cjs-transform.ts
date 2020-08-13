#!/usr/local/bin/ts-node
import {isAbsolute, join} from "path";
import * as yargs from "yargs";
import {Arguments, Argv, CommandModule} from "yargs";
import {write_status} from "./src/abstract_fs_v2/interfaces";
import {ProjConstructionOpts, ProjectManager} from "./src/abstract_fs_v2/ProjectManager";
import executioner from "./src/executioner";


const cwd = process.cwd()

// test_resources.import path from 'path'

let lit = {demandOption: true, choices: ["named", "default"], nargs: 1}
type opt = { demandOption: true, choices: ["named", "default"], nargs: 1 }

type naming = "default" | "named"
let {input, output, suffix, operation, naming_format} = getOptionData(yargs
	.command(copyCommandModule())
	.command(inPlaceCommandModule())
	.option("named", {type: "boolean"})
	.option("default", {type: "boolean"})
	.strict()
	.argv);
// .option('named',{type:"string", choices:["named","default"]})


executioner(new ProjectManager(input,
	getProjConstructionOpts(suffix, output, operation,naming_format)))


export interface ProgramArgs {
	source: string
	dest?: string
	suffix?: string
	copy_node_modules?: boolean
	// naming?:naming
	named?: boolean
	'default'?: boolean
}

export function getProjConstructionOpts(suffix, output, operation, naming_format: "default" | "named"): ProjConstructionOpts {
	return {
		isModule: false,
		suffix: suffix,
		target_dir: output,
		write_status: operation,
		copy_node_modules: false, //TODO
		isNamed: naming_format === "named"
	};
}

function getOptionData(tf_args: Arguments<ProgramArgs>) {
	let input: string = tf_args.source;
	let output = '';
	let suffix = '';
	let operation: write_status
	let naming_format: naming = "default";

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
	if (tf_args.named && tf_args.default) {
		console.log(`Please choose ONE name specification method '--named' or '--default'`)
		process.exit(1)

	} else if (tf_args.named)  {
		naming_format = "named"
		console.log('naming is ' + naming_format)

	} else if (tf_args.default){
		naming_format = "default"
		console.log('naming is ' + naming_format)

	}

	if (!isAbsolute(input)) {
		input = join(cwd, input)
	}
	return {input, output, suffix, operation, naming_format};
}

function copyCommandModule(): CommandModule<ProgramArgs, ProgramArgs> {


	// const copyCommandModule: CommandModule<ProgramArgs, ProgramArgs> =
	return {
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
}

function inPlaceCommandModule(): CommandModule<ProgramArgs, ProgramArgs> {
	// const inPlaceCommandModule: CommandModule<ProgramArgs, ProgramArgs> =
	return {
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
}