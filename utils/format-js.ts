#!/usr/bin/env ts-node
import {writeFileSync as write,readFileSync as read} from "fs";
import {generate} from 'escodegen'
import {parseScript,parseModule} from 'esprima'
import {argv} from 'process'
import {join} from 'path'
console.log(argv)
console.log(argv.length)
console.log(argv[1])
console.log(join(__dirname, argv[1]))
console.log(join(__dirname, argv[2]))

if (argv[2]){

	let arg = argv[2]
	let scpt = false
	if (argv.length>3&&argv[2]&& argv[2]==='-m'){
		arg = argv[3]
		scpt = false
	}
	console.log(arg)
	let file:string = read(arg,'utf-8')
	let parse = scpt ?parseScript: parseModule
	write(arg, generate(parse(file)))
}
