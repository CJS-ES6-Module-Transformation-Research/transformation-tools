// #!/usr/local/bin/ts-node
import {parseModule} from "esprima";
import {ExportDefaultDeclaration, ExpressionStatement, ObjectExpression, Program} from 'estree'

let ast: Program

// requireMgr.getList().forEach(vardecl => listOfVars.push( (vardecl.declarations[0].id as Identifier).name))

// let outData: { [id: string]: OutData } = {};
// function containsNode(nodelist: Node[], n: Node): boolean {
// 	let retVal = false;
// 	nodelist.forEach(v => {
// 		if (v.type == n.type && generate(v) == generate(n)) {
// 			retVal = true;
// 		}
// 	});
// 	return retVal;
// }
//
// function getReqPropertiesAccessed(ast: Program, listOfVars: string[], mapOfRPIs: { [id: string]: ReqPropInfo }): void {
// 	// let listOfProps = [];
// 	traverse(ast, {
// 		enter: (node, parent) => {
// 			switch (node.type) {
// 				case "MemberExpression":
// 					if (node.object.type === "Identifier"
// 						&& node.property.type === "Identifier"
// 						&& listOfVars.includes(node.object.name)  /*containsNode( )*/) {
// 						// listOfProps.push( node);
// 						let name = node.object.name
// 						if (!mapOfRPIs[name]) {
// 							mapOfRPIs[name] = {
// 								listOfAllPropsAccessed: new Set(), listOfPropsCalledOrAccessed: new Set()};
// 							}
// 							mapOfRPIs[name].listOfAllPropsAccessed.add(node.property.name)
// 						}
// 						break;
// 					}
// 			}
// 		});
// 	// return listOfProps;
// }
//
// function getPropsCalledOrAccd(ast: Program, mapOfRPIs: { [id: string]: ReqPropInfo }): void {
// 	// let notPrimProps = []
// 	let nameS: string;
// 	traverse(ast, {
// 		enter: (node, parent) => {
// 			switch (node.type) {
// 				case "MemberExpression":
// 					if (node.object.type == "MemberExpression"
// 						&& node.object.object.type == "Identifier"
// 						&& node.property.type == "Identifier"
// 						&& node.object.property.type === "Identifier") {
//
// 						nameS = node.object.object.name;
// 						let key = node.object.property.name
// 						let value = node.property.name
// 						if (mapOfRPIs[nameS] && mapOfRPIs[nameS].listOfAllPropsAccessed.has(key)) {
// 							// containsNode(mapOfRPIs[nameS].listOfAllPropsAccessed, node.object)) {
// 							// notPrimProps.push( node.object);
// 							mapOfRPIs[nameS].listOfPropsCalledOrAccessed.add(key);
// 						}
// 					}
// 					break;
// 				case "CallExpression":
// 					if (node.callee.type == "MemberExpression"
// 						&& node.callee.object.type == "Identifier"
// 						&& node.callee.property.type == "Identifier") {
//
// 						nameS = node.callee.object.name;
// 						if (mapOfRPIs[nameS] && mapOfRPIs[nameS].listOfAllPropsAccessed.has(node.callee.property.name)) {
// 							// notPrimProps.push( node.callee);
// 							mapOfRPIs[nameS].listOfPropsCalledOrAccessed.add(
// 								node.callee.property.name);
// 						}
// 					}
// 					break;
// 			}
// 		}
// 	});
// 	// return notPrimProps;
// }
//
// test_resources.export const reqPropertyInfoGather = (js: JSFile) => {
// 	let ast = js.getAST()
// 	let list = []
// 	let requireMgr: RequireTracker = js.getRequireTracker();
// 	let listOfVars = requireMgr.getList().map(vardecl => <Identifier>(vardecl.declarations[0].id));
//
// 	let rpis: { [id: string]: ReqPropInfo } = {};
//
// 	getReqPropertiesAccessed(ast, listOfVars.map(e => e.name), rpis);
// 	getPropsCalledOrAccd(ast, rpis);
//
// 	// requireMgr.setReqPropsAccessedMap(rpis);
//
// }
//
// test_resources.export interface ReqPropInfo {
// 	// listOfAllPropsAccessed: string[];
// 	listOfAllPropsAccessed: Set<String>;
// 	// listOfPropsCalledOrAccessed: { key: string, value: string }[];
// 	listOfPropsCalledOrAccessed: Set<String>;
// }
//
// ast = parseScript(`
//
// var path = require('y')
// var http = require('z')
// var url = require('f')
// var {p,q,r} = require('t');
//
// path.join('c','u')
// path.join_()
// path.joinx.join()
// path.createPath('a',path.sep).z
//
// let _http = http
// _http(x.path.sep)
// var x= http._http
// path.y(q.z)
// url(url.as_path)
//
//
//
//
// `)
//
//
// let listOfVars: string[] = ['url', 'http', 'path'];
// let idListOfVars: Identifier[] = listOfVars.map(e => {
// 	return {type: "Identifier", name: e}
// })
// let set = new Set<String>()
// listOfVars.forEach(e => set.add(e))
// let mapOfRPIS: { [key: string]: ReqPropInfo } = {}
// getReqPropertiesAccessed(ast, listOfVars, mapOfRPIS);
// getPropsCalledOrAccd(ast, mapOfRPIS)
// let copyList :string[] =[]
// for (let str in mapOfRPIS) {
//
// 	let value = mapOfRPIS[str]
// 	let _strs: string[] = []
// 	let __strs: string[] = []
// 	value.listOfAllPropsAccessed.forEach((e: string) => __strs.push(e))
// 	value.listOfPropsCalledOrAccessed.forEach((e: string)  => _strs.push(e))
// 	// value.listOfPropsCalledOrAccessed.forEach(e => _strs.push(`${e.key}${e.value ? " : " + e.value : "(_)"}`))
// 	console.log(`${str}:
//
// props: ${__strs}
// calledOrPropst: ${_strs}
// `)

// }
// for (let key in outData) {
// 	let value = outData[key]
// 	value.all.forEach(e => console.log(`${key}: ${e}`))
// }
// console.log(`\n`)
// getPropsCalledOrAccd(ast, outData)
// for (let key in outData) {
// 	let value = outData[key]
// 	console.log(`${key} size is: ${value.objs.size}`)
// 	value.objs.forEach(e => console.log(`${key}: ${e}`))
// }

//
// for (let key in outData) {
// 	let value = outData[key]
// 	console.log(`${key} size is: ${value.objs.size}`)
// 	value.objs.forEach(e => console.log(`${key}: ${e}`))
// }

ast = parseModule(`
require('mocha');
`)
let b = (ast.body[0 ] as ExpressionStatement).expression
console.log(b )







