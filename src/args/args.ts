import {isAbsolute, join} from "path";
import {Argv, CommandModule} from "yargs";
import * as yargs from "yargs";
import {write_status} from "../abstract_fs_v2/interfaces";
import {ProjConstructionOpts} from "../abstract_fs_v2/ProjectManager";
import {ExecutionGoal} from "../run-from-cli";

export function getOptionData(cwd:string):{ output: string; input: string; ignored: string[]; naming_format: "default" | "named"; goal: string; operation_type: "copy" | "in-place"; report: boolean; isNamed: boolean; suffix: string } {
	let tf_args = yargs
		.command(copyCommandModule())
		.command(inPlaceCommandModule())
		.option('import_type', {choices: ["named", "default"], nargs: 1})
		.option('n', {nargs: 0})
		.option('ignored', {type: "string", array: true})
		.option('report', {type: "boolean", nargs: 0})

		.strict()
		.argv
	let input: string = tf_args.source;
	let output = '';
	let suffix = '';
	let operation_type: write_status
	// @ts-ignore
	let naming_format: naming;

	if (tf_args.import_type) {
		naming_format = tf_args.import_type as naming
	} else if (tf_args.n) {
		naming_format = "named"
	} else {
		naming_format = "default";
	}

	// @ts-ignore
	let ignored: string[] = tf_args.ignored ? tf_args.ignored : [];
	if (tf_args._[0] === "tf-proj") {
		operation_type = "in-place";
		suffix = tf_args.suffix
	} else if (tf_args._[0] === "tf-copy") {
		operation_type = "copy";
		output = tf_args.dest
		if (output && !isAbsolute(output)) {
			output = join(cwd, output)
		}
	}

	if (!isAbsolute(input)) {
		input = join(cwd, input)
	}
	ignored.forEach((elem, index, arr) => {
		if (!isAbsolute(elem)) {
			arr[index] = join(cwd, elem)
		}
	});

	return {goal:'transform',isNamed: naming_format==="named", input, output, suffix, operation_type, naming_format, ignored,report:tf_args.report };
}

function copyCommandModule(): CommandModule<ProgramArgs, ProgramArgs> {


	// const copyCommandModule: CommandModule<ProgramArgs, ProgramArgs> =
	return {
		command: "runCopy <source> <dest>",
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
		command: "execute <source> [suffix]",
		builder: (args: Argv<ProgramArgs>): Argv<ProgramArgs> => {
			return args
			//optionized(args);
		},
		aliases: ['ex','i'],
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



 type naming = "default" | "named"

export interface PM_Opts extends ProjConstructionOpts{
	input:string
	naming_format: naming
	goal:ExecutionGoal
	report:boolean
	output:string
}
export interface ProgramArgs {
	source: string
	dest?: string
	suffix?: string
	copy_node_modules?: boolean
	named?: boolean
	'default'?: boolean
}

export function getProjConstructionOpts(suffix, target_dir, write_status, naming_format: "default" | "named", ignored,report, isModule=false ): ProjConstructionOpts {
	return {
		isModule,
		suffix,
		output: target_dir,
		operation_type: write_status,
		copy_node_modules: false, //TODO
		isNamed: naming_format === "named",
		ignored,
		report
	};
}
