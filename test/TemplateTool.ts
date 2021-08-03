import {generate} from "escodegen";
import {parseModule, parseScript} from "esprima";
import {existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, writeFileSync} from "fs";
import {copySync} from 'fs-extra'
import {join} from "path";
import {_RTest} from './RuntimeTests'


export interface TestFileStringData {
	imports: string
	preamble: string
	tests: string
	suffix?: string
	filename: string
}

const gen_data: { [str: string]: TestFileStringData } = {}


let test_data = join(process.env.CJS, 'test_data')
let clean_root = join(test_data, `cleaning/equality`)


function format(program: string, isModule = true) {
	return generate(isModule ? parseModule(program) : parseScript(program))
}



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
		.filter(e => e !== '.DS_Store')
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



gen_data['unit_clean'] = buildUnitTests(test_data, 'cleaning/equality')
gen_data['run_clean'] = _RTest



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