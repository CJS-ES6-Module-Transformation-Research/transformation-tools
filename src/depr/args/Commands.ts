//
// const main: CommandModule<{}, {}> = {
// 	command: "execute <source>  [suffix]",
// 	builder: (depr.args: Argv<{}>): Argv<{}> => {
// 		return depr.args.options({
// 			'target': {type: 'string', alias: 't'},
// 			'suffix': {type: 'string'},
// 			'report': {type: 'string', alias: 'r'},
// 			'ignored': {type: 'array'}
// 		})
// 			.option('use_names',
// 				{type: 'boolean', alias: 'n', demandOption: true})
// 	},
// 	aliases: ['exec', 't'],
// 	describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project directory.",
// 	handler(depr.args: yargs.Arguments<ProgramArgs>): void {
// 		console.log(depr.args)
// 		depr.args['goal'] = 'transform'
// 	}
// }
// const clean: CommandModule<{}, {}> = {
// 	command: "clean <source>  [suffix]",
// 	builder: (depr.args: Argv<{}>): Argv<{}> => {
// 		return depr.args.options({
// 			'target': {type: 'string', alias: 't'},
// 			'suffix': {type: 'string'},
// 			'report': {type: 'string', alias: 'r'},
// 			'ignored': {type: 'array'}
// 		})
// 	},
// 	aliases: ['c'],
// 	describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project directory.",
// 	handler(depr.args: yargs.Arguments<ProgramArgs>): void {
// 		console.log(depr.args)
// 		depr.args['goal'] = 'clean'
// 	}
// }
// const reformat: CommandModule<{}, {}> = {
// 	command: "reformat <source>  [suffix]",
// 	builder: (depr.args: Argv<{}>): Argv<{}> => {
// 		return depr.args.options({
// 			'target': {type: 'string', alias: 't'},
// 			'suffix': {type: 'string'},
// 			'report': {type: 'string', alias: 'r'},
// 			'ignored': {type: 'array'}
// 		})
// 	},
// 	aliases: ['rf', 'fmt'],
// 	describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project directory.",
// 	handler(depr.args: yargs.Arguments<ProgramArgs>): void {
// 		depr.args['goal'] = 'format'
// 	}
// }
//
// export interface PM_Opts {
// 	input: string
// 	naming_format: naming
// 	goal: ExecutionGoal
//
//
// 	operation_type: op_type
// 	output: string
// 	suffix: string
// 	isModule?: boolean
// 	isNamed: boolean
// 	copy_node_modules?: boolean
// 	ignored?: string[]
// 	report: boolean
// 	testing?: boolean
// }
//
// export interface ProgramArgs {
// 	goal: ExecutionGoal//
// 	hasTarget: boolean
// 	source: string//
// 	dest?: string//
// 	suffix?: string//
// 	copy_node_modules?: boolean
// 	export_type?: naming//
// 	ignored?: string[]//
// 	report: boolean//
// 	_: string[]
// 	$0: string
// }


// let z: {
// goal: ExecutionGoal;
// hasTarget: boolean;
// source: string;
// dest?: string; suffix?: string; copy_node_modules?: boolean;
//
// 	 string[]; $0: string } = f()
// let tf_args = yargs
// 	.command(copyCommandModule())
// 	.command(inPlaceCommandModule())
// 	.option('import_type', {choices: ["named", "default"], nargs: 1})
// 	.option('n', {nargs: 0})
// 	.option('ignored', {type: "string", array: true})
// 	.option('report', {type: "boolean", nargs: 0})
//
// 	.strict()
// 	.argv
//
//
// let io: InferredOptionType<any>
// type opt_type = { type: ('boolean' | 'string' | 'array' | 'number'), alias?: string }
// type OType = { [opt: string]: opt_type }
// const options = () => {
// 	let opts: OType = {
// 		'target': {type: 'string', alias: 't'},
// 		'suffix': {type: 'string'},
// 		'report': {type: 'string', alias: 'r'},
// 		'ignored': {type: 'array'}
// 	};
// 	return opts;
// }
//
// let Arrgs = yargs
// 	.command(main)
// 	.command(clean)
// 	.command(reformat)
//
// 	.strict()
// 	.argv
//
// ///////////////////////////////////
// function getPMOptsFromYargs(cwd: string) {
// 	let toReturnPMOpts: PM_Opts = {
// 		input: '',
// 		naming_format: 'named',
// 		goal: "format",
//
//
// 		operation_type: "in-place",
// 		output: null,
// 		suffix: '',
// 		isNamed: true,
// 		ignored: [],
// 		report: false,
// 		testing: false
// 	}
// 	let Arrgs = yargs
// 		.command(main)
// 		.command(clean)
// 		.command(reformat)
//
// 		.strict()
// 		.argv
//
// 	function setOpts(depr.args: yargs.Arguments<ProgramArgs>) {
// 		toReturnPMOpts.input = depr.args.input as string
// 	}
// }
//
// export default function (cwd: string) {
//
// }
//
//
//

