#!/usr/local/bin/ts-node
import {isAbsolute, join} from "path";
import * as yargs from "yargs";
import {Argv, CommandModule, InferredOptionType, InferredOptionTypes} from "yargs";
import {write_status} from "./src/abstract_fs_v2/interfaces";
import {ProjConstructionOpts, ProjectManager} from "./src/abstract_fs_v2/ProjectManager";
import executioner from "./src/executioner";


const cwd = process.cwd()


type naming = "default" | "named"
let {input, output, suffix, operation, naming_format,ignored } = getOptionData();


executioner(new ProjectManager(input,
	getProjConstructionOpts(suffix, output, operation, naming_format,ignored)))

// interface _named{
// 	named:
// }
// interface  x extends InferredOptionTypes<any> {
// 	named?:{type: "boolean"}
// 	'default'?:{type: "boolean"}
// 	ignored?: {type: "string"}
//
// }
// type PA = x & ProgramArgs

export interface ProgramArgs {
	source: string
	dest?: string
	suffix?: string
	copy_node_modules?: boolean
	// naming?:naming
	named?: boolean
	'default'?: boolean
	// ignored?: string[]
	// import_type?:naming
}

export function getProjConstructionOpts(suffix, output, operation, naming_format: "default" | "named",ignored ): ProjConstructionOpts {
	return {
		isModule: false,
		suffix: suffix,
		target_dir: output,
		write_status: operation,
		copy_node_modules: false, //TODO
		isNamed: naming_format === "named",
		// ignored
	};
}

function getOptionData() {
	let tf_args = yargs
		.command(copyCommandModule())
		.command(inPlaceCommandModule())
		.option('import_type',   {choices: ["named", "default"], nargs: 1})
		.option(	'ignored', {type: "string", array: true})
		// .option({
		// 	import_type: {choices: ["named", "default"], nargs: 1},
		//
		// 	ignored: {type: "string", array: true} )
		.strict()
		.argv
	let input: string = tf_args.source;
	let output = '';
	let suffix = '';
	let operation: write_status
	// @ts-ignore
	let naming_format: naming = tf_args.import_type  ? tf_args.import_type  : "default";

	// @ts-ignore
	let ignored:string[] = tf_args.ignored ? tf_args.ignored:[] ;
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

	if (!isAbsolute(input)) {
		input = join(cwd, input)
	}
	ignored.forEach((elem, index,arr)=>{
		if (!isAbsolute(elem)){
			arr[index] = join(cwd, elem )
		}
	});

	return {input, output, suffix, operation, naming_format, ignored};
}

function copyCommandModule(): CommandModule<ProgramArgs, ProgramArgs> {


	// const copyCommandModule: CommandModule<ProgramArgs, ProgramArgs> =
	return {
		command: "tf-copy <source> <dest>",
		builder: (args: Argv<ProgramArgs>): Argv<ProgramArgs> => {
			// .option('filter',{})
			return optionized(args)
				// .option('include-node_modules', {type:"boolean"})

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

// type infOp = InferredOptionTypes<_Options>
function optionized(args: yargs.Argv<ProgramArgs>) {
	let _args
	 	= args.option({
		import_type: {choices: ["named", "default"], nargs: 1},

		ignored: {type: "string", array: true}
	});
	return _args
}

function inPlaceCommandModule(): CommandModule<ProgramArgs, ProgramArgs> {
	// const inPlaceCommandModule: CommandModule<ProgramArgs, ProgramArgs> =
	return {
		command: "tf-proj <source> [suffix]",
		builder: (args: Argv<ProgramArgs>): Argv<ProgramArgs> => {
			return  args
			//optionized(args);
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