import {expect} from "chai";
import {existsSync, mkdir, mkdirSync, readdirSync, readFileSync, writeFile, writeFileSync} from "fs";
import {join} from "path";
import {JSFile} from "../../../src/abstract_fs_v2/JSv2";
import {ProjectManager} from "../../../src/abstract_fs_v2/ProjectManager";
import {flattenDecls, requireStringSanitizer} from "../../../src/transformations/sanitizing/visitors";
import {createProject, TEST_DIR} from '../../index'

export const TEST_FILES_ROOT = join(TEST_DIR, `test_data`)

export function getTestDir(name: string) {
	let dir = join(TEST_FILES_ROOT, name)
	return {
		test_dir: dir,
		tests: readdirSync(dir)
	}
}

// let it = parseScript(`it(${name}, ()=>{})`).body[0] as ExpressionStatement
// let test_input = ''


let category:string =''
let operation:string='MANY'

let testFile = join(TEST_DIR, `test_resources/templates/lists`,category)
let dir = join(TEST_DIR, `test_data`,category)
let arrayOfTests= readFileSync(testFile,'utf-8').split('\n')

	let target =
	 '/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/tests/' +
	`${category}.ts` 

// let arrayOfTests = ['parallel_json_require',
// 	'up_one_json_require',
// 	'down_one_json_require',
// 	'multi_json_require_same_mid',
// 	'js_has_priority']


let ex=
	`function MANY(js:JSFile){throw new Error('IMPLEMENT THE API_BUILD TESTS THING ')}
	 `
+
		`describe('${category}', ()=>{
${(arrayOfTests)
	.map(e=>{
		return  createIT(e,
			e.includes('__named') )} )
	.reduce((prev,curr)=>{
				return prev+'\n'+curr
	},'')}
	});`

 function createIT(test_name: string,   isNamed: boolean

 ) {
	 let str = join(  `test_data`,category,test_name)
	return `it('${test_name}', ()=>{ 
	const project =  createProject(join(TEST_DIR,'${str}'), ${isNamed}) 
	let actualJS: JSFile = project.getJS(  '${test_name}.actual.js');
	${operation}(actualJS)
	let prjS = project.getJS('${test_name}.expected.js')

	let expected = prjS.makeSerializable().fileData
	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ${test_name}');
});`

 }

writeFileSync(
	target,

	`

import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {createProject} from "../index";
import {TEST_DIR} from "../index";
import {join} from "path";
import { expect } from "chai";
`
	 +  ex );
