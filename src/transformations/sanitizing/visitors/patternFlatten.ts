// import {replace, Visitor} from "estraverse";
// import {
// 	BlockStatement,
// 	CallExpression,
// 	Declaration,
// 	Directive,
// 	Identifier,
// 	ImportSpecifier,
// 	MemberExpression,
// 	ModuleDeclaration,
// 	Node,
// 	Program,
// 	Property,
// 	RestElement, SimpleLiteral,
// 	Statement,
// 	VariableDeclaration,
// 	VariableDeclarator
// } from "estree";
// import {JSFile} from "../../../abstract_fs_v2/JSv2";
// import {alphaNumericString} from "./accessReplacer";
// import { generate } from "escodegen";
//
//
// export function deconsFlatten(js: JSFile) {
// 	let toReturn: VariableDeclaration
// 	let visitor: Visitor = {
// 		leave: (node: Node, parent: Node | null) => {
// 			// if(node.type ==="ObjectPattern"){
// 			// 	console.log(generate(node))
// 			// 	console.log(generate(parent))
// 			// 	console.log(parent.type)
// 			// }
// 			if (node.type === "VariableDeclaration"
//
// 				&& node.declarations
// 				&& node.declarations[0]
// 				&& node.declarations[0].id
// 				&& node.declarations[0].id.type !== "Identifier"
//
// 			) {
// 				if (
// 					node.declarations[0].init
// 					&& node.declarations[0].id.type === "ObjectPattern"
// 					&& node.declarations[0].init.type === "CallExpression"
// 					&& node.declarations[0].init.callee.type === "Identifier"
// 					&& node.declarations[0].init.callee.name === "require"
// 					&& node.declarations[0].init.arguments
// 					&& node.declarations[0].init.arguments[0]
// 					&& node.declarations[0].init.arguments[0].type === "Literal"
// 				) {
// 					// let requireTracker = js.getInfoTracker()
// 					let declarator = node.declarations[0];
// 					// let ns = js.getNamespace()
// 					// let objPat: ObjectPattern = declarator.id as ObjectPattern
// 					let requireCall: CallExpression = declarator.init as CallExpression
// 					let requireString: string = (node.declarations[0].init.arguments[0] as SimpleLiteral).value.toString()
//
// 					let specifiers: ImportSpecifier[] = []
//
// 					if (parent) {
// 						let body: (Statement | Declaration | Directive | ModuleDeclaration)[]
// 						if ("Program" === parent.type) {
// 							body = (parent as Program).body
// 						} else if (parent.type === "BlockStatement") {
// 							body = (parent as BlockStatement).body
// 						} else if (parent.type === "ForStatement") {
// 							if (parent.init === node) {
// 								console.log(generate(parent))
// 								throw new Error(' "special" edge case deal w/ later') //TODO FIXME  this
// 							}
// 							if (parent.body.type === "BlockStatement"
// 								&& parent.body.body.includes(node)
// 							) {
// 								console.log('incluseion!!! ')
// 							}
//
// 							// else if(  parent.body.includes(node)){}
// 							// // throw new Error(' "special" edge case deal w/ later') //TODO FIXME  this
// 							// return;
// 						} else {
// 							throw new Error("should maybe not be here... likely unreachabvle")
// 						}
//
// 						// let idz :Identifier =
// 						let declArray: VariableDeclaration[] = []
// 						node.declarations[0].id.properties.forEach((prop: Property | RestElement) => {
// 							switch (prop.type) {
// 								case "Property":
// 									if (prop.value.type === "Identifier") {
// 										let x;
// 										if (prop.shorthand) {
// 											declArray.push(declaratorFactory(//identifier,
// 												prop.value, requireCall))
// 											x = declaratorFactory(//identifier,
// 												prop.value, requireCall)
// 											specifiers.push({
// 												type: "ImportSpecifier",
// 												local: prop.value,
// 												imported: prop.value
// 											})
//
// 											body.splice(body.indexOf(node), 0, x)
//
// 										} else if (prop.key.type === "Identifier") {
// 											declArray.push(declaratorFactory(//identifier,
// 												prop.key, requireCall, prop.value))
// 											x = declaratorFactory(// identifier,
// 												prop.key, requireCall, prop.value)
// 											specifiers.push({
// 												type: "ImportSpecifier",
// 												local: prop.key,
// 												imported: prop.value
// 											})
// 											js.getInfoTracker().registerAlias(requireString, prop.key.name,prop.value.name)
// 											body.splice(body.indexOf(node), 0, x)
// 											console.log(JSON.stringify(js.getInfoTracker().getAlias(requireString),null,3))
// 										}
// 										// console.log("__x ")
// 										// console.log(generate(x))
// 									}
// 									break;
// 								case "RestElement":
// 									break;
// 							}
// 							// js.getInfoTracker().addSpecifiers(requireString, specifiers)//.insertDeclPair().getFromDeMap()
// 						});
// 					}
// 				}
//
// 			}
//
// 		}
// 	}
//
// 	function declaratorFactory(/*base: Identifier, */ id: Identifier, callex: CallExpression, alias: Identifier = null): VariableDeclaration {
// 		let mmx: MemberExpression = {
// 			type: "MemberExpression",
// 			computed: false,
// 			object: callex,
// 			property: id
// 		}
// 		let declarator: VariableDeclarator = {
// 			type: "VariableDeclarator",
// 			id: alias ? alias : id,
// 			// init: {
// 			// 	type: "MemberExpression",
// 			// 	computed: false,
// 			// 	object: base,
// 			// 	property: id
// 			// }
// 			init: mmx
// 		};
//
//
// 		let vDCLN: VariableDeclaration = {
// 			kind: "var",
// 			type: "VariableDeclaration",
// 			declarations: [declarator]
// 		};
// 		return vDCLN
// 	}
//
// 	replace(js.getAST(), visitor)
// }
//
//
// function cleanValue(requireStr: string): string {
// 	let replaceDotJS: RegExp = new RegExp(`(\.json)|(\.js)`, 'g')// /[\.js|]/gi
// 	let illegal: RegExp = new RegExp(`([^${alphaNumericString}_])`, "g"); ///[alphaNumericString|_]/g
// 	let cleaned = requireStr.replace(replaceDotJS, '');
// 	cleaned = cleaned.replace(illegal, "_");
//
// 	return cleaned;
// }
//
//
