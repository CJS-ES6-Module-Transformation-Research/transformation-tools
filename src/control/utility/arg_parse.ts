import yargs, {Argv, InferredOptionType, PositionalOptions} from 'yargs'
import {ProjConstructionOpts} from "../ProjectManager";

type t2 = { nargs: number; alias: string; type: string }
type actions = "format" | "clean" | "transform"

interface istr extends PositionalOptions {
	nargs: number;
	alias: string;
	type: 'string'
	demandOption?: boolean
}


interface ibool extends PositionalOptions {
	nargs: number;
	alias: string;
	type: 'boolean'
	demandOption?: boolean
}

type $Action = { action: InferredOptionType<istr> }
type Copy = { copy: InferredOptionType<istr> }
type Named = { named: InferredOptionType<ibool> }
type Report = { report: InferredOptionType<ibool> }

interface $_ {
	_: string[]
	$0: string
	input: string
}

//$Action&
type PArsed = Copy & Named & $_ & Report & { ignored: InferredOptionType<{ type: 'array' }> }

export type naming = "default" | "named"

// let parsed:  PArsed   =
export function parse(): ProjConstructionOpts {
	let parsed: PArsed =
		yargs
			.command('clean <input>', '',
				(e: Argv<PArsed>) => {
					return e.option('copy', {type: 'string', alias: 'cp', nargs: 1})
						.option('report', {type: 'boolean', nargs: 0})
						.option('ignored', {type: 'array'})
				},
				(e) => {
					e.command = 'clean'

				})
			.command('format <input>', '',
				(e: Argv<PArsed>) => {
					return e.option('copy', {type: 'string', alias: 'cp', nargs: 1})
						.option('report', {type: 'boolean', nargs: 0})
						.option('ignored', {type: 'array'})
				},
				(e) => {
					e.command = 'format'
				})

			.command('transform <input>', '',
				(e: Argv<PArsed>) => {
					return e
						.option('named', {type: 'boolean', alias: 'n', nargs: 0})
						.option('copy', {type: 'string', alias: 'cp', nargs: 1})
						.option('report', {type: 'boolean', nargs: 0})
						.option('ignored', {type: 'array'})
				},
				(e) => {
					e.command = 'transform'
				})
			.demandCommand(1)


			.argv
	console.log(parsed)
	return {
		output: parsed.copy || '',
		input: parsed.input,
		ignored: parsed.ignored as string[],
		operation_type: parsed.copy ? "copy" : "in-place",
		report: parsed.report,
		isNamed: parsed.named,
		suffix: ''
	}
}

// console.log(parsed)