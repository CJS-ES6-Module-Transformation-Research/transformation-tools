import {expect} from "chai";
import {readdirSync} from 'fs'
import 'mocha';

import {join} from 'path'
import {clean} from "../src/janitor/janitor";
import {createProject} from "./index";

let test_root = `${process.env.CJS}/test_data/cleaning/equality`
type suite_tests = {[suite:string]:string[]}
/*
function getAll() {
	let map: { [suite: string]: string[] } = {}
	readdirSync(test_root).forEach(
		(test_suite:string) => {
			if (!map[test_suite]) {
				map[test_suite] = []
			}
			readdirSync(join(test_root, test_suite))
				.forEach((testname) => {
					map[test_suite].push(testname)
				})
		})
	return map
};*/
// let suite_path = join(test_root, suite)

let suites =readdirSync(`${process.env.CJS}/test_data/cleaning/equality`)
describe ('equality',()=> {
	suites
		.forEach(suite => {
 				let tests = readdirSync(join(test_root, suite))

				describe(suite, () => {
					tests.forEach((test) => {
						//if (test.includes('deconstr'))
						it(test, () => {

							let test_path = join(test_root,suite, test)

							let actual = createProject(join(test_path, 'actual'), true)
							let expected = createProject(join(test_path, 'expected'), true)
							clean(actual)
							let relatives = actual.getJSRelativeStrings()
							relatives.forEach(file => {
								expect(actual.getJS(file).makeSerializable().fileData, `test file: ${test_path}`)
									.to
									.be
									.eq(expected.getJS(file).makeSerializable().fileData)
							})
						})
					})
				})
			}
		)
})
	 // .forEach(test_suite=>createSuite(test_suite,readdirSync(join(test_root, test_suite))))


	//  .map(
	// (test_suite:string) => {
	// 	let _: {[key:string]:string[]} = {}
	// 	_[test_suite] =  readdirSync(join(test_root, test_suite))
	// 	return  [test_suite, ];
	// }).
 // forEach(testSuite=>{
	// 	let name = testSuite
 // })
// 	 .reduce((e,r)=>{
// 		return {...e,...r};
// })//.forEach((suite:string)=>{

// 	}
// )
//.reduce(e:)

function createSuite(suite:string,tests:string[]){
	 describe(suite, () => {
		let suitepath = join(test_root, suite)
		tests.forEach((test) => {
			it(test, () => {

				let testpath = join(suitepath, test)

				let dirA = join(testpath, 'actual')
				let dirE = join(testpath, 'expected')
				let actual = createProject(dirA, true)
				let expected = createProject(dirE, true)
				clean(actual)
				let relatives = actual.getJSRelativeStrings()
				relatives.forEach(file => {
					expect(actual.getJS(file).makeSerializable().fileData, `test file: ${testpath}`)
						.to
						.be
						.eq(expected.getJS(file).makeSerializable().fileData)
				})
			})
		})
	})
}

// let map: { [suite: string]: string[] } = getAll()
// Object.keys(map).forEach(suite => {

	// describe(suite, () => {
	// 	let suitepath = join(test_root, suite)
	// 	map[suite].forEach(test => {
	// 		it(test, () => {
	//
	// 		let testpath = join(suitepath, test)
	//
	// 		let dirA = join(testpath, 'actual')
	// 		let dirE = join(testpath, 'expected')
	// 		let actual = createProject(dirA, true)
	// 		let expected = createProject(dirE, true)
	// 		clean(actual)
	// 		let relatives = actual.getJSRelativeStrings()
	// 		relatives.forEach(file => {
	// 			expect(actual.getJS(file).makeSerializable().fileData, `test file: ${testpath}`)
	// 				.to
	// 				.be
	// 				.eq(expected.getJS(file).makeSerializable().fileData)
	// 		})
	// 	})
	// 	})
	// })
	// })
	// })
	// let dir = join(${rest},${test})
	// let dirA = join (dir,'actual')
	// let dirE = join (dir,'expected')
	// let actual = createProject(dirA,true )
	// let expected = createProject(dirE,true  )
	// })
// });


/*
let testString= (rest, test)=>{
	`
	let dir = join(${rest},${test})
	let dirA = join (dir,'actual')
	let dirE = join (dir,'expected')
	let actual = createProject(dirA, createOpts(dirA))
	let expected = createProject(dirE, createOpts(dirE))
	`
}

function suiteFactory (suiteName:string): {suite, body} {
	let suite: Program = parseScript(`describe('${suiteName}',function(){})`)
	let describeHook = ((suite.body[0] as ExpressionStatement).expression as SimpleCallExpression).arguments[1] as FunctionExpression
	let body =
		describeHook.body
	return {suite,body}
}
function testFactory (restOfString, testName:string) {
	let it = (parseScript(`it('${testName}',function(){})`).body[0] as ExpressionStatement).expression as SimpleCallExpression
	let body =
		(it.arguments[1] as FunctionExpression).body
	let testBody = parseScript('testString').body
	// @ts-ignore
	body.push(...testBody)

}

function build(root:string,suiteName:string,testNames:string[]){

}
// console.log(suiteFactory('X'))
*/