// import {replace, traverse, VisitorOption} from "estraverse";
// import {
// 	CallExpression,
// 	Directive,
// 	Expression,
// 	Identifier,
// 	Literal,
// 	ModuleDeclaration,
// 	Node,
// 	Property,
// 	SpreadElement,
// 	Statement,
// 	VariableDeclaration,
// 	VariableDeclarator
// } from "estree";
// import {id} from "../../abstract_fs_v2/interfaces";
// import {JSFile} from "../../abstract_fs_v2/JSv2";
// import {ProjectManager} from "../../abstract_fs_v2/ProjectManager";
// import {asModuleDotExports} from "../pass0";
// import {flattenDirectAssignOfObjectLiteralToModuleDotExports} from "../subvisitors/exports/FlattenExportObjectAssignment";
// import {flattenVariableDeclarations} from "../subvisitors/general/FlattenVariableDeclarators";
// import {flattenRequireObjectDeconstructions2} from "../subvisitors/require/FlattenObjectDeconstructions";
// import {declare, exportsDot, isARequire, isModule_Dot_Exports, module_dot_exports} from "../utilities/helpers";
// import {asRequire, RequireCall} from "../utilities/Require";
//
// export default function janitor(pm: ProjectManager) {
//
// 	//merge two
// 	;
// 	//sole purpose of IIFE is to block out execution of janitor from nested functions
// 	(function (projectManager: ProjectManager) {
// 		projectManager.forEachSource(cleanRequireString)
// 		projectManager.forEachSource(cleanExports_and_extractRequireDeclarations)
//
// 		projectManager.forEachSource(flattenObjectAssign)
// 		projectManager.forEachSource(deconstructRequire)
// 		projectManager.forEachSource(flattenVariableDeclarations)
// 		projectManager.forEachSource(requireCalls)
//
// 	})(pm);
//
//
// 	// let requireStrings: { [rs: string]: { count: number, topLevel: true | undefined } } = {}
// 	// let requireToIDMap: { [key: string]: { ident: string, isTopLevelDecl } } = {}
// 	// let vardecls: VariableDeclaration[] = []
// //
// //
// // 	function requireCalls(js: JSFile): string | void {
// // 		/*js.getAST().body.forEach(node => {
// // 			if (
// // 				node.type === "VariableDeclaration"
// // 				&& node.declarations[0].init
// // 				&& isARequire(node.declarations[0].init)
// // 				&& node.declarations[0].id
// // 				&& node.declarations[0].id.type === "Identifier"
// // 			) {
// // 				let rs = (<Literal>(<CallExpression>node.declarations[0].init).arguments[0]).value.toString()
// // 				requireToIDMap[rs] = {ident: node.declarations[0].id.name, isTopLevelDecl: true}
// // 				// @ts-ignore
// // 				node.declarations[0].init.tagged = true
// // 			}
// //
// // 		})
// // */
// // 		function handleRequireCallNot_TL_Declaration(node: CallExpression): Identifier {
// // 			let RC = asRequire(node)
// // 			let _id = id(RC.getCleaned())
// // 			vardecls.push({
// // 				type: "VariableDeclaration",
// // 				declarations: [declare(_id, RC)],
// // 				kind: 'var'
// // 			})
// // 			return _id
// // 		}
// //
// // 		replace(js.getAST(), {
// // 			leave: (node: Node, parent: Node) => {
// //
// // 				if (
// // 					node.type === "VariableDeclaration"
// // 					&& node.declarations[0].init
// // 					&& isARequire(node.declarations[0].init)
// // 					&&  node.declarations[0].id.type ==="Identifier"
// // 				){
// // 					if (parent.type==="Program"){
// // 						vardecls.push(node	)
// // 						return VisitorOption.Remove
// // 					}else{
// //
// // 						return handleRequireCallNot_TL_Declaration(node.declarations[0].init as CallExpression);
// //
// // 						//variable declaration not top level
// // 					}
// //
// // 				}else{
// // 					if (isARequire(node)&& node.type ==="CallExpression"){
// // 						return handleRequireCallNot_TL_Declaration(node);
// // 					}
// // 					//not a variable declaration... replace with generated id
// // 				}
// //
// //
// // 			}
// // 		})
// // 		js.getAST().body.splice(0,0,...vardecls)
// // 	}
// //
// //
// // 	function cleanRequireString(js: JSFile) {
// // 		let rst = js.getRST()
// // 		traverse(js.getAST(), {
// // 			enter: (node, parent) => {
// // 				if (isARequire(node)) {
// //
// // 					let rs = (node as RequireCall).arguments[0].value.toString();
// // 					(node as RequireCall).arguments[0].value = rst.getTransformed(rs);
// // 					if (parent.type !== "VariableDeclarator") {
// //
// // 						if (requireStrings[rs]) {
// // 							requireStrings[rs].count++
// //
// // 						} else {
// // 							requireStrings[rs] = {count: 1, topLevel: undefined}
// // 						}
// //
// // 					} else {
// // 						if (requireStrings[rs]) {
// // 							requireStrings[rs].count++
// // 							requireStrings[rs].topLevel = undefined
// //
// // 						} else {
// // 							requireStrings[rs] = {count: 1, topLevel: undefined}
// // 						}
// //
// // 					}
// //
// // 				}
// //
// // 			}
// // 		})
// // 	}
// //
// // 	function cleanExports_and_extractRequireDeclarations(js: JSFile) {
// // 		traverse(js.getAST(), {
// // 			enter: (node, parent) => {
// //
// // 				if (node.type === "MemberExpression" && node.object.type === "Identifier" && node.object.name === "exports") {
// // 					node.object = module_dot_exports()
// // 				}
// // 			}
// // 		})
// // 	}
// //
// // 	function flattenObjectAssign(js: JSFile) {
// // 		traverse(js.getAST(), {
// // 			leave: function (node: Node, parent: Node):
// // 				void {
// // 				if (
// // 					node.type === "ExpressionStatement"
// // 					&& node.expression.type === "AssignmentExpression"
// // 					&& node.expression.left.type === "MemberExpression"
// // 					&& (parent.type === "Program" || parent.type === "BlockStatement")
// // 				) {
// // 					let exps: (Statement | ModuleDeclaration | Directive)[] = []
// // 					if (node.expression.left.object.type === "Identifier"
// // 						&& node.expression.left.property.type === "Identifier"
// // 						&& node.expression.left.object.name === "module"
// // 						&& node.expression.left.property.name === "exports"
// // 						&& parent.type === "Program" || parent.type === "BlockStatement") {
// //
// // 						if (node.expression.right.type === "ObjectExpression") {
// // 							node.expression.right.properties.forEach((e: Property | SpreadElement) => {
// // 								if (e.type !== "Property") {
// // 									throw new Error()
// // 								}
// //
// //
// // 								exps.push({
// // 									type: "ExpressionStatement",
// // 									expression: {
// // 										type: "AssignmentExpression",
// // 										operator: "=",
// // 										left: exportsDot((e.key as Identifier).name),
// // 										right: e.value as Expression
// // 									}
// // 								})
// //
// // 							})
// // 							parent.body.splice(parent.body.indexOf(node), 1, ... exps)
// // 						}
// // 					}
// // 				}
// // 			}
// // 		})
// // 	}
// //
// // 	function deconstructRequire(js: JSFile): void {
// //
// //
// // 		let seenIds: { [key: string]: () => Identifier } = {}
// // 		traverse(js.getAST(), {
// // 			enter: (node: Node, parent: Node) => {
// // 				if (node.type === "VariableDeclaration" && node.declarations) {
// // 					node.declarations.forEach((decl, i, arr) => {
// // 						if (decl.id.type === "ObjectPattern" && isARequire(decl.init)) {
// // 							let rc = asRequire(decl.init)
// // 							let rs = rc.getRS()
// // 							if (!seenIds[rs]) {
// // 								seenIds[rs] = () => js.getNamespace().generateBestName(rc.getCleaned())
// // 							}
// // 							let __init: Identifier = seenIds[rs]()
// //
// // 							let toadd: VariableDeclarator[] = [
// // 								declare(__init.name, decl.init)
// // 							]
// //
// // 							decl.id.properties.forEach((prop) => {
// //
// // 								switch (prop.type) {
// // 									case "Property":
// // 										toadd.push({
// // 											type: "VariableDeclarator",
// // 											id: prop.value,
// // 											init: {
// // 												object: __init,
// // 												property: prop.key,
// // 												computed: false,
// // 												type: "MemberExpression"
// // 											}
// // 										})
// //
// //
// // 										i++
// //
// // 										break;
// // 									case "RestElement":
// //
// // 										throw new Error("unsupported operation")
// // 								}
// // 							})
// // 							arr.splice(i, 1, ... toadd);
// // 							arr.splice(arr.indexOf(decl), 1);
// //
// //
// // 						}
// //
// // 					})
// //
// // 				}
// // 			}
// // 		})
// //
// // 	}
// //
// // 	function flattenVariableDeclarations(js: JSFile) {
// // 		traverse(js.getAST(), {
// // 			leave: (node: Node, parent: Node,) => {
// // 				if (node.type === 'VariableDeclaration'
// // 					&& node.declarations.length > 1) {
// // 					// flattenDeclarations(node, parent);
// // 					let {kind: _kind, type: _type} = node;
// // 					let flattened: (Statement | VariableDeclaration)[] = node.declarations.map(
// // 						(dclr: VariableDeclarator) => {
// // 							return {
// // 								kind: _kind,
// // 								type: _type,
// // 								declarations: [dclr]
// // 							}
// // 						})
// // 					if ("Program" === parent.type || parent.type === "BlockStatement") {
// //
// // 						let indexOf = parent.body.indexOf(node);
// // 						parent.body.splice(indexOf, 1, ... (flattened.reverse()))
// // 					} else if ("ForStatement") {
// // 						return;
// // 					} else {
// // 						throw new Error("don't know why it got here ")
// // 					}
// // 				}
// //
// // 				function getToFlatten(vdcln: VariableDeclaration): (Statement | VariableDeclaration)[] {
// // 					let flattened: (Statement | VariableDeclaration)[] = []
// //
// // 					vdcln.declarations.forEach((decl: VariableDeclarator) => {
// // 						//add declarator to be flattened.
// // 						let ls: VariableDeclarator[] = []
// // 						ls.push(decl)
// // 						// if (decl.init && isARequire(decl.init)
// // 						// ) {
// // 						// }
// // 						let flat: VariableDeclaration = {
// // 							kind: vdcln.kind,
// // 							type: vdcln.type,
// // 							declarations: ls
// // 						}
// //
// // 						//add to flatten decl list.
// // 						flattened.push(flat)
// // 					});
// // 					return flattened
// // 				}
// // 			}
// // 		})
// // 	}
// //
// // }
//
//
// function janitor(js: JSFile) {
// 	let rst = js.getRST()
// 	traverse(js.getAST(), {
// 		leave: (node: Node, parent: Node) => {
// 			if (isARequire(node)) {
// 				let rs = (node as RequireCall).arguments[0].value.toString();
// 				(node as RequireCall).arguments[0].value = rst.getTransformed(rs);
// 			}
//
//
// 			flattenDirectAssignOfObjectLiteralToModuleDotExports().leave(node, parent)
// 			flattenRequireObjectDeconstructions2(js).enter(node, parent)
// 			if (node.type === "MemberExpression" && node.object.type === "Identifier" && node.object.name === "exports") {
// 				node.object = module_dot_exports()
// 			}
// 		}
// 	})
// 	traverse(js.getAST(), {leave: flattenVariableDeclarations});
// 	js.rebuildNamespace(js.getDefaultExport())
// 	cleanExports()
//
//
// 	hoistRequires()
//
// 	function cleanExports() {
// 		let exportData: { [id: string]: string } = {}
//
// 		let toDefineList: string[] = []
// 		traverse(js.getAST(), {
// 			enter: (node: Node, parent: Node) => {
// 				if (
// 					node.type === "ExpressionStatement"
// 					&& node.expression.type === "AssignmentExpression"
// 					&& node.expression.left.type === "MemberExpression"
// 					&& (isModule_Dot_Exports(node.expression.left)
// 						|| (isModule_Dot_Exports(node.expression.left.object))
// 					)
// 					&& (parent.type === "Program"
// 					|| parent.type === "BlockStatement")
// 				) {
// 					let data = asModuleDotExports(node.expression.left)
// 					if (data) {
// 						let list: Statement[] = []
// 						let identifier: Identifier
// 						switch (data.type) {
// 							case "name":
// 								let copy = js.getNamespace().generateBestName(data.Export)
// 								identifier = copy
//
// 								break;
// 							case "default":
// 								identifier = js.getDefaultExport()
//
// 								break;
//
// 						}
// 						list.push({
// 							declarations: [declare(identifier.name, node.expression.right)],
// 							type: "VariableDeclaration",
// 							kind: "var"
// 						})
// 						if (!toDefineList.includes(identifier.name)) {
// 							toDefineList.push(identifier.name)
// 						}
// 						node.expression.right = identifier
// 						list.push(node)
// 						let indexOf = parent.body.indexOf(node)
// 						parent.body.splice(indexOf, 1, ... list)
// 					}
// 				}
// 			}
// 		})
// 		let dcls = toDefineList.map(e => declare(e, null))
// 		let dcl: VariableDeclaration = {
// 			kind: "var",
// 			type: "VariableDeclaration",
// 			declarations: dcls
// 		}
// 		if(dcls.length>0){
// 			js.getAST().body.splice(0, 0, dcl)
// 		}
// 	}
//
// 	function hoistRequires() {
// 		let ids: { [key: string]: string } = {}
// 		let toAdd: Statement[] = []
// 		replace(js.getAST(), {
// 			leave: (node: Node, parent: Node) => {
// 				if (node.type === "VariableDeclaration"
// 					&& node.declarations.length === 1
// 					&& node.declarations[0].init
// 					&& node.declarations[0].id.type === "Identifier"
// 					&& isARequire(node.declarations[0].init)
// 				) {
// 					console.log('INIT : ' + node.declarations[0].init)
//
// 					if (parent.type === "Program") {
// 						toAdd.push(node)
//
//
// 						let $ = asRequire(node.declarations[0].init)
// 						let rs = $.getRS()
// 						ids[rs] = node.declarations[0].id.name
// 						return VisitorOption.Remove
// 					} else {
// 						let $ = asRequire(node.declarations[0].init)
// 						let id2: Identifier
// 						let clean = $.getCleaned()
// 						let rs = $.getRS()
//
// 						if (!ids[rs]) {
// 							id2 =js.getNamespace().generateBestName(  ids[rs])
// 							ids[rs] =id2.name
// 						} else{
// 							id2 = id(id[rs])
// 						}
// 						toAdd.push(declaration(id2, $))
// 						node.declarations[0].init = id2
// 					}
//
//
// 				} else if (node.type === "CallExpression" && isARequire(node)) {
// 					let $ = asRequire(node)
// 					let id2: Identifier
// 					console.log(`CALLEX: ${(node.arguments[0] as Literal).value.toString()}`)
// 					let clean = $.getCleaned()
//
// 					let rs = $.getRS()
// 					if (!ids[$.getRS()]) {
// 						ids[$.getRS()] =clean
// 					}
// 					id2 =js.getNamespace().generateBestName(  ids[rs])
// 					toAdd.push(declaration(id2, $))
// 					return id2
// 				}
//
// 			}
// 		})
// 	}
// }
// function declaration($id:string | Identifier, requireCallString:string| RequireCall){
// 	let _id = typeof $id =="string" ? $id: $id.name
// 	let declaration:VariableDeclaration={kind:"var",type:"VariableDeclaration",declarations:[]}
// 	if( typeof requireCallString =="string"){
// 		let callex :CallExpression={type:"CallExpression",arguments:[{type:"Literal",value:requireCallString}],callee:id('require')}
// 		declaration.declarations.push(declare(_id, callex ))
//
// 	}else{
// 		declaration.declarations.push(declare(_id, requireCallString ))
//
// 	}
// 	return declaration
// }
