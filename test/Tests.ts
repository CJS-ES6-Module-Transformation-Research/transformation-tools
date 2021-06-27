// import {parseScript} from "esprima";
// import {
// 	ArrowFunctionExpression,
// 	CallExpression,
// 	ExpressionStatement,
// 	FunctionExpression,
// 	Program,
// 	SimpleCallExpression
// } from "estree";
// import 'mocha'
// import {readdirSync} from 'fs'
// import {basename,join } from 'path'
// import {createProject} from "./index";
// import {expect} from "chai";
// // import clean ,{}from '../src/janitor/main'
// import {clean} from '../src/janitor/janitor'
// import exp = require("constants");
// import AssertionError = Chai.AssertionError;
// // import landing = Mocha.reporters.landing;
// let test_root = `${process.env.CJS}/test/test-data-new`
// console.log()
// function getAll(){
// 	let map:{[suite:string]:string[]} = {}
//
// 	readdirSync(test_root).forEach(
// 		test_suite => {
// 			if (!map[test_suite] ) {
// 				map[test_suite]=  []
// 			}
// 			readdirSync(join(test_root, test_suite))
//
// 				.forEach((testname) => {
// 					map[test_suite].push(testname)
// 				})
// 		})
// 	return map
// };
// let map = getAll()
// console.log(join(__dirname , basename(__filename)))
// if (Object.keys(map))throw new Error(JSON.stringify(Object.keys(map)))
// console.log(`KEYS:::
//
// ${Object.keys(map)}
//
//
// `)
// Object.keys(map ).forEach(suite =>{
//
// 	describe(suite, ()=>{
// 			let suitepath = join (test_root,suite)
// 		map[suite].forEach(test=>{
// 			it(`${test} --> ${join(suitepath,test)}`,(done)=>{
//
// 				// if (Object.keys(map))throw new AssertionError(JSON.stringify(Object.keys(map)))
//
// 			let testpath = join(suitepath,test)
//
// 			let dirA = join (testpath,'actual')
// 			let dirE = join (testpath,'expected')
// 			let actual = createProject(dirA,true )
// 			let expected = createProject(dirE,true  )
// 			clean(actual)
// 			let relatives = actual.getJSRelativeStrings()
// 			relatives.forEach(file =>{
// 				expect(actual.getJS(file).makeSerializable().fileData,)
// 					.to
// 					.be
// 					.eq(expected.getJS(file).makeSerializable().fileData)
// 			})
// 		})})
//
// 		// (test,(done)=>{
// 		// 	let suitepath = join (test_root,suite)
// 		//
// 		// 	let testpath = join(suitepath,test)
// 		//
// 		// 	let dirA = join (testpath,'actual')
// 		// 	let dirE = join (testpath,'expected')
// 		// 	let actual = createProject(dirA,true )
// 		// 	let expected = createProject(dirE,true  )
// 		// 	clean(actual)
// 		// 	let relatives = actual.getJSRelativeStrings()
// 		// 	relatives.forEach(file =>{
// 		// 		expect(actual.getJS(file).makeSerializable().fileData)
// 		// 			.to
// 		// 			.be
// 		// 			.eq(expected.getJS(file).makeSerializable().fileData)
// 		// 	})
// 		//
// 		//
// 		// 	done()
// 		// })
// 	})
// })
// /*
// // @ts-ignore
// describe('suite', ()=>{
// 	// let tf =
// 	// // @ts-ignore
// 	it('testx',()=>{
// 		// let map:{[suite:string]:string[]} =getAll()
//
//
// 			let suitepath = join (test_root,suite)
// 			map[suite].forEach(test=>{
// 				let testpath = join(suitepath,test)
//
// 				let dirA = join (testpath,'actual')
// 				let dirE = join (testpath,'expected')
// 				let actual = createProject(dirA,true )
// 				let expected = createProject(dirE,true  )
// 				clean(actual)
// 				let relatives = actual.getJSRelativeStrings()
// 				relatives.forEach(file =>{
// 					expect(actual.getJS(file).makeSerializable().fileData)
// 						.to
// 						.be
// 						.eq(expected.getJS(file).makeSerializable().fileData)
// 				})
// 			})
//
// 		// let dir = join(${rest},${test})
// 		// let dirA = join (dir,'actual')
// 		// let dirE = join (dir,'expected')
// 		// let actual = createProject(dirA,true )
// 		// let expected = createProject(dirE,true  )
// 	})
// });
//
// */
// /*
// let testString= (rest, test)=>{
// 	`
// 	let dir = join(${rest},${test})
// 	let dirA = join (dir,'actual')
// 	let dirE = join (dir,'expected')
// 	let actual = createProject(dirA, createOpts(dirA))
// 	let expected = createProject(dirE, createOpts(dirE))
// 	`
// }
//
// function suiteFactory (suiteName:string): {suite, body} {
// 	let suite: Program = parseScript(`describe('${suiteName}',function(){})`)
// 	let describeHook = ((suite.body[0] as ExpressionStatement).expression as SimpleCallExpression).arguments[1] as FunctionExpression
// 	let body =
// 		describeHook.body
// 	return {suite,body}
// }
// function testFactory (restOfString, testName:string) {
// 	let it = (parseScript(`it('${testName}',function(){})`).body[0] as ExpressionStatement).expression as SimpleCallExpression
// 	let body =
// 		(it.arguments[1] as FunctionExpression).body
// 	let testBody = parseScript('testString').body
// 	// @ts-ignore
// 	body.push(...testBody)
//
// }
//
// function build(root:string,suiteName:string,testNames:string[]){
//
// }
// // console.log(suiteFactory('X'))
// */