import {generate} from "escodegen";
import {parseModule, parseScript} from "esprima";
import {
	ArrowFunctionExpression,
	BlockStatement,
	Expression,
	ExpressionStatement,
	Identifier,
	ObjectPattern,
	Pattern,
	Property,
	SimpleCallExpression,
	SimpleLiteral,
	Statement,
	VariableDeclaration
} from "estree";
import {readdirSync, readFileSync, writeFileSync, watch} from "fs";
import {basename, join} from "path";






let _test //= //`
const _Testing_Data_Root = `${process.env.CJS}/test_data`
const _Cleaning_Test_Root = join(_Testing_Data_Root, `cleaning`)
const _Cleaning_Equality = join(_Cleaning_Test_Root, `equality`)
const SUITES: { [suiteName: string]: string } = {};
SUITES['cleaning'] = _Cleaning_Equality
/*

if (SUITES.x) {
	readdirSync(join(process.env.CJS, 'test', 'templates')).map(file => {
		return {
			file, body: parseModule(
				readFileSync('./templates.ts', 'utf-8')).body
		}
	}).map(e => {
		let base = basename(e.file)
		base = base.replace(/\.ts/g, '')

		let _body = (e.body.filter(stmt => stmt.type === "VariableDeclaration")) as VariableDeclaration[]
		return {file: base, body: _body};
	}).forEach(thing => {
		let body = thing.body
		let toReplace: string[] = []
		let template: Expression
		body.forEach(decl => {
			let dc = decl.declarations[0];
			if (dc.init && dc.init.type === "Identifier" && dc.init.name === "TO_REPLACE") {
				(dc.id as ObjectPattern).properties.forEach(f => toReplace.push(((f as Property).value as Identifier).name))
			}
			if (dc.id.type === "Identifier" && dc.id.name === "$" && dc.init) {
				template = dc.init
			}

		})

	})
}*/
let _init_suites = 'let suites =readdirSync(`${process.env.CJS}/test_data/cleaning/equality`);\n'

// console.log(JSON.stringify(testprogram.body,null,3)   )
// console.log(generate(testprogram))

// @ts-ignore
let describep = parseScript(`describe('name', ()=>{})`).body[0].expression
// @ts-ignore
let itp = parseScript(`it('test-name',()=>{test})`).body[0].expression

let TR = `${process.env.CJS}/test_data`
let clean_root = join(TR, `cleaning/equality`)
let test_data = join(process.env.CJS, 'test_data')
let test_root = join(test_data, 'cleaning/equality')
console.log( readdirSync(clean_root).filter(e=> e != '.DS_Store'))
// let suites = readdirSync(clean_root).filter(e=> e != '.DS_Store')




let format = (program: string) => generate(parseScript(program))


function forEachSuite(suite: string, test_root: string) {
	let _suite = '';
	let tests = readdirSync(join(test_root, suite)).filter(e=> e != '.DS_Store')
	_suite += `describe('${suite}', () => {`
	_suite += tests.map(forEachTest).reduce((e, r) => e + '\n\n' + r)

	_suite += '})'
	return _suite;

	function forEachTest(test: string) {
		let str = ''
		str += `it('${test}', () => {\n`

		str += `let test_path = join( test_root,'${suite}' , '${test}')\n`

		str += `let actual = createProject(join(test_path, 'actual'), true)\n`
		str += `let expected = createProject(join(test_path, 'expected'), true)\n`
		str += `clean(actual);\n`
		str += `let relatives = actual.getJSRelativeStrings()\n`
		str += `relatives.forEach(file => {\n`
		str += `expect(actual.getJS(file).makeSerializable().fileData,  `
		str += `'test file: \${test_path} ') .to .be .eq(expected.getJS(file).makeSerializable().fileData)		})\n`
		str += `})\n`
		return str
	}

}

const import_statements =  `
import {expect} from 'chai';
import 'mocha';
import {join} from "path";
import {clean} from "../src/janitor/janitor";
import {createProject} from "../test";

`
const preamble =   (`
let test_data = join(process.env.CJS , 'test_data' )
let test_root =join (test_data, 'cleaning/equality')
`)
let stringReducer = ((str='\n') =>  (e:string,r:string)=> e + str + r)
let getSuites =() => readdirSync(clean_root).filter(e=> e != '.DS_Store')
let generateCleanSuite = (suite:string)=> forEachSuite(suite, clean_root)
let suites = readdirSync(clean_root).filter(e=> e != '.DS_Store')
function regenerate():string{
	return getSuites()
		.map(e=> generateCleanSuite(e))
		.reduce(stringReducer('\n\n\n') , '')
}

let zzt = suites
	.map((suite) =>
		forEachSuite(suite, clean_root))
	.reduce(
		(s1, s2) => `${s1}\n\n${s2}`, '')
let total =   `
${import_statements}

${preamble}

${format ( regenerate() )
}
`;
// let z = readdirSync(clean_root).filter(e=> e != '.DS_Store').map(e=>  join (clean_root, e))
// z.map(e=>[e,readdirSync(e)])
// 	.map(e=>
// 			e[1].map(r => join(e[0],r)))
// // watch()
writeFileSync(`${process.env.CJS}/test/cleaning.generated.ts`, total)










