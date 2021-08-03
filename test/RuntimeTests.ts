import {readdirSync, writeFileSync} from 'fs'
import {join} from 'path'
import {TestFileStringData} from "./TemplateTool";

let testsDir = join(process.env.CJS, `test_data/cleaning/runtime_states`)

let tests_roots = readdirSync(testsDir).map(e => join(testsDir, e))


let imports = `
import {expect} from "chai";
import {execSync} from "child_process";
import {readdirSync, readFileSync} from "fs";
import 'mocha';
import {join} from "path";
import {ProjectManager} from "../../src/control";
import {clean} from "../../src/refactoring";
import {betweenLines, copyTest} from '../TemplateTool';



`

let preamble = `
let tmp
let original
let pm
 
 
`

let testFunction = `
() => {
let tmpRds = readdirSync(tmp);
let actual =  execSync('node ' + join(tmp, 'main.js') ).toString('utf-8');
expect(actual).to.be.eq(betweenLines(JSON.parse(readFileSync(join(original, 'expected'), 'utf-8'  ))['expected']))
}
`
let suffix = `


function getPM(tmp){
  return  new ProjectManager(tmp,  {
        input:tmp,
        output: '',
        suffix: '',
        isNamed: true,
        report: false,
        operation_type: 'in-place'
    })
}

`
let suite = ''
suite += `describe ('runtime', ()=>{\n`
let tests = ''
tests_roots.forEach(test => {
	tests += `let test = '${test}';\n`
	tests += `it(test,(done)=>{\n`
	tests += `original = join(test, 'original')\n`
	tests += `tmp = join(test, 'tmp')\n`
	tests += `copyTest(original, tmp)\n`
	tests += `pm = \tpm = getPM(tmp);\n`
	tests += `clean(pm)\n`
	tests += `pm.writeOut().then(${testFunction}).then(done)\n`

	tests += '})\n\n'

})
suite += tests
suite += `\n})`

let total = `
${imports}
${preamble}
${suite}

${suffix}
`
export const _RTest:TestFileStringData = {imports,preamble,tests:suite, suffix,filename:`test/generated_tests/runtime.generated.ts`}
