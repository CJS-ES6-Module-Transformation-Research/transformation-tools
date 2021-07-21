import {generate} from "escodegen";
import {parseScript} from "esprima";
import {Program} from "estree";
import {JSFile} from "../../filesystem/JSFile";
import {Namespace    } from '../../filesystem/Namespace'
import { ProjectManager,ProjConstructionOpts} from '../../control'
import * as arg from "../../control/utility/arg_parse";
import {getReassignedPropsOrIDs} from "../../refactoring/utility/getReassigned";
import {Intermediate} from "../Intermediate";
import {getAccessedProperties} from "./accessed_properties";
import {forcedDefaults} from "./forced_defaults";
import {readIn} from "./readIn";
import {getShadowVars} from "./shadow_variables";

import chalk from 'chalk'
const {red,green , blue} = chalk
let log:{[key:string]:(...x)=> void} ={}
log. red =(...x)=>  console.log(...x.map(e=>red(e )) )
log. green =(...x)=>  console.log(...x.map(e=>green(e )) )
log. blue =(...x)=>  console.log(...x.map(e=>blue(e )) )
export function runAnalyses(pm: ProjectManager) {

	let js:JSFile = pm.getJS('main.js')


	pm.forEachSource(readIn)
	let im= js.getIntermediate()
	// log.red(	JSON.stringify(im.load_order,null,3)
	// )
	// log.red(	JSON.stringify(im.id_to_ms,null,3)
	// )
	pm.forEachSource(getShadowVars)
	// log.green( 	JSON.stringify(im.getShadowVars(),null,3))
 	pm.forEachSource(getAccessedProperties)
	log.green( 	JSON.stringify(im.getPropReads(),null,3))
	// log.green( 	JSON.stringify(im ,null,3))


	process.exit()
	pm.forEachSource(forcedDefaults)
	pm.forEachSource(getReassignedPropsOrIDs)
	// pm.forEachSource(e => console.log(e.getIntermediate()))
}

//
// export * from './accessed_properties'
// export * from './forced_defaults'
// export * from './readIn'
// export * from './shadow_variables'
// export * from './tagger'

interface JSMock {
	ast: Program

	getAST(): Program

	getNamespace(): Namespace

	generateProgram(): string

}


class JMock implements JSMock {
	ast: Program
	private _intermediate: Intermediate;

	constructor(str: string) {
		this.ast = parseScript(str)
	}

	generateProgram(): string {

		return generate(this.ast);
	}

	getAST(): Program {

		return this.ast;
	}

	getNamespace(): Namespace {
		return Namespace.create(this.ast);
	}

	setIntermediate(_intermediate: Intermediate) {
		this._intermediate = _intermediate
	}
}


let scpt = `
var x = require('x')
var y = require('./y.js')
var fs = require('fs')
var _a;
var b = 3;
_a = 'a'
module.exports. a = _a
describe(x.z,()=>{
	it('a',()=>{
		var a = y;
		var readFileSync = fs.readFileSync
	})
	it('b',()=>{
	var a = 3; 
		var b = y;
		var readFileSync = fs.readFileSync
	})
})
console.log(y())
console.log(new x.h())

// `
// let jsMock = new JMock(scpt)
// readIn(jsMock)


// let program = parseScript(scpt)


let opts: ProjConstructionOpts = arg.parse()
let {input, report} = opts
let pm: ProjectManager = new ProjectManager(input, opts);
// clean(pm)
runAnalyses(pm)
pm.writeOut();









