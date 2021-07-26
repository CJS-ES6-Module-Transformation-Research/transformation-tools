import {generate} from "escodegen";
import {parseModule, parseScript} from "esprima";
import {existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, writeFileSync} from "fs";
import {copySync} from 'fs-extra'
import {join} from "path";
import {JSFile} from "../src/filesystem/JSFile";
import {runAnalyses} from "../src/utility/static-analysis";
import {_RTest} from './RuntimeTests'


export interface TestFileStringData {
	imports: string
	preamble: string
	tests: string
	suffix?: string
	filename: string
}

const gen_data: { [str: string]: TestFileStringData } = {}
const SA_TESTS = ['forced-defaults/call-expression', 'forced-defaults/direct-rhs'    ,   'forced-defaults/prop-reassign'   , 'property-reads'    ,  'shadow-vars'    , 'export-api-and-type']
let _test //= //`
// const _Testing_Data_Root = `${process.env.CJS}/test_data`
// const _Cleaning_Test_Root = join(_Testing_Data_Root, `cleaning`)
// const _Cleaning_Equality = join(_Cleaning_Test_Root, `equality`)
// const SUITES: { [suiteName: string]: string } = {};
// SUITES['cleaning'] = _Cleaning_Equality

let test_data = join(process.env.CJS, 'test_data')
let clean_root = join(test_data, `cleaning/equality`)
console.log(readdirSync(clean_root).filter(e => e !== '.DS_Store'))


function format(program: string, isModule = true) {
	return generate(isModule ? parseModule(program) : parseScript(program))
}

// function F(test_root: string, testing_dir: string): TestFileStringData {
// 	let local_root = join(test_root, testing_dir)
//
// 	function forEachSuite(suite: string) {
// 		let _suite = '';
// 		let tests = readdirSync(join(local_root, suite)).filter(e => e != '.DS_Store')
//
//
// 		_suite += `describe('${suite}', () => {`
// 		_suite += tests
// 			.map((test) => {
// 				return {
// 					test, data: readFileSync(join(local_root, suite, test, 'values.json'), 'utf-8')
// 				}
// 			})
// 			.map((test: { : string; data: string }) => makeTest())
// 			.reduce((e, r) => e + '\n\n' + r)
// 		_suite += '})'
// 		return _suite;
//
// 		// function makeTest(data: { test: string; data: string }): string {
// 		// 	let obj:{[d:string]:string|number|string[]}
// 		// 	let tst = obj['test_area'] as string
// 		// 	let str = ''
// 		//
// 		//
// 		// }
// 	}
// }
const SA_ROOT= join(test_data,'static_analysis/data-compare')
function buildStaticAnalysisTests(test_root: string='static_analysis/data-compare', testing_dir: string):TestFileStringData{
// return {imports,tests,suffix,preamble,filename}
	return null
}

let sa= join(test_data,'static_analysis/data-compare')
readdirSync(sa).filter(e=> e !== '.DS_Store')
	.map(e=> {return {test_type:e ,test_suites: readdirSync(join(sa,e)).filter(e=> e !== '.DS_Store') }})
	.map(e=> e.test_suites.map (r => { return { suite:r, test_dirs:readdirSync(join(sa,r)).filter(e=> e !== '.DS_Store')}}))




SA_TESTS.forEach(test_dir=> gen_data[test_dir]=buildStaticAnalysisTests(SA_ROOT, test_dir))



function buildUnitTests(test_root: string, testing_dir: string): TestFileStringData {
	let local_root = join(test_root, testing_dir)

	function forEachSuite(suite: string) {
		let _suite = '';
		let tests = readdirSync(join(local_root, suite)).filter(e => e !== '.DS_Store')


		_suite += `describe('${suite}', () => {`
		_suite += tests
			.map(forEachTestEq)
			.reduce((e, r) => e + '\n\n' + r)

		_suite += '})'
		return _suite;

		function forEachTestEq(test: string): string {
			let str = ''
			str += `it('${test}', () => {\n`
			str += `let test_path = join( test_root,'${suite}' , '${test}')\n`
			str += `let actual = createProject(join(test_path, 'actual'), true)\n`
			str += `let expected = createProject(join(test_path, 'expected'), true)\n`
			str += `clean(actual);`
			str += `let relatives = actual.getJSRelativeStrings()\n`
			str += `relatives.forEach(file => {\n`
			str += `expect(actual.getJS(file).makeSerializable().fileData,  `
			str += `'test file: \${test_path} ') .to .be .eq(expected.getJS(file).makeSerializable().fileData)		})\n`
			str += `})\n`

			return str
		}

	}


	let imports = `
import {expect} from 'chai';
import 'mocha';
import {join} from "path";
import {clean} from "../../src/refactoring";
import {createProject} from "../../test";

`
	let preamble = `
let test_data = join(process.env.CJS , 'test_data' )
let test_root =join (test_data, '${testing_dir}')
`

	let suites = readdirSync(local_root)
		.filter(e => e != '.DS_Store')
		.map(forEachSuite)
		.reduce((e: string, r: string) => (e + '\n\n\n' + r), '')
	return {
		imports,
		preamble,
		tests: suites,
		suffix: '',
		filename: `test/generated_tests/cleaning.generated.ts`
	}
}

SA_TESTS.map(test_dir=> buildStaticAnalysisTests(SA_ROOT, test_dir))



let sa_testsDir = 'static_analysis/equality'
gen_data['unit_clean'] = buildUnitTests(test_data, 'cleaning/equality')
gen_data['unit_static_analysis'] = buildUnitTests(test_data, sa_testsDir)
gen_data['run_clean'] = _RTest

// let suites = readdirSync(clean_root).filter(e => e != '.DS_Store')


function printGenData(gen: TestFileStringData): string {
	let {imports, tests, suffix, preamble} = gen
	let sep = '\n\n\n'
	let section: string
	try {
		section = 'preamble'
		preamble = format(preamble, false)
		section = 'test'
		tests = format(tests, false)
		if (suffix) {
			section = 'suffix'
			suffix = format(suffix, false)
		}
	} catch (e) {
		throw new Error(`FORMAT ERROR IN SECTION: ${section} `)
	}


	return (imports + sep + preamble + sep + tests + sep + suffix || '')
}


function writeTests(_data: { [str: string]: TestFileStringData }) {
	console.log(Object.keys(_data).length)
	Object.keys(_data).forEach((v) => {
		let o = _data[v]
		console.log(v)
		let _path = join(`${process.env.CJS}`, o.filename)
		console.log(`writing data to ${_path}`)
		let file_data = printGenData(o)
		console.log(file_data === '' || file_data == null )
		writeFileSync(_path, file_data)
	})
}

// writeFileSync(` , printGenData(gen_data['unit']))
writeTests(gen_data)

export function copyTest(path, to) {
	removeIfExists(to);
	mkdirSync(to)

	copySync(path, to, {recursive: true})

	function removeIfExists(to): void {
		if (existsSync(to)) {
			rmdirSync(to, {recursive: true})
		}
	}
}

export function betweenLines(... lines) {
	return lines.map(e => `${e}\n`).reduce((e, r) => e + r)
}