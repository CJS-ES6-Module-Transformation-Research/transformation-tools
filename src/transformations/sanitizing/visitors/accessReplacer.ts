#!/bin/env ts-node
import {replace, traverse, Visitor, VisitorOption} from 'estraverse'
import {
	ArrayPattern,
	AssignmentExpression,
	AssignmentPattern,
	BlockStatement,
	Directive,
	Expression,
	Identifier,
	Literal,
	MemberExpression,
	ModuleDeclaration,
	Node,
	ObjectPattern,
	Pattern,
	Program,
	Property,
	RestElement,
	SimpleCallExpression,
	SpreadElement,
	Statement,
	VariableDeclaration,
	VariableDeclarator
} from 'estree'
import _ from 'lodash'
import {id} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {Namespace} from "../../../abstract_fs_v2/Namespace";
import {createRequireDecl} from '../../../abstract_representation/es_tree_stuff/astTools';
import {InfoTracker} from "../../../InfoTracker";
// test_resources.import {JSFile} from "../../../index";


const lower = 'qwertyuioplkjhgfdsazxcvbnm';
const upper = 'QWERTYUIOPLKJHGFDSAZXCVBNM';
const numeric = '1234567890';
export const alphaNumericString: string = `${lower}${upper}${numeric}`


/**
 * TransformFunction to replace 'accesses' of require calls.
 * @param js the JSFile to transform.
 */
export function accessReplace(js: JSFile) {
	let requireTracker = js.getInfoTracker();
	let imports: RequireAccessIDs = {};

	let names = js.getNamespace()
	runTraversal(imports, requireTracker, names, js);
	for (const reqStr in imports) {

		names.addToNamespace(imports[reqStr])
	}

	// deconstructDeconstructors(js)

	// js.getInfoTracker().getRPI_()
	populateAccessDecls(js, imports, js.getAST().body, names)
}

function populateAccessDecls(js: JSFile, reqStrMap: RequireAccessIDs, body: Node[], names: Namespace) {
	let reverse: VariableDeclaration[] = []
	for (const reqStr in reqStrMap) {
		let vName: string = reqStrMap[reqStr];
		reverse[reqStr] = vName;
		names.addToNamespace(vName)

		reverse.push(createRequireDecl(vName, reqStr, "const"))
	}
	reverse.reverse().forEach(e => {
		body.splice(0, 0, e)
	})

}

interface RequireAccessIDs {
	[key: string]: string
}


function runTraversal(imports: RequireAccessIDs, requireTracker: InfoTracker, ns: Namespace, js: JSFile) {
	let ast = js.getAST()
	console.log(js.getRelative())
	let visitor: Visitor = {
		enter: (node: Node, parent: Node | null) => {

				let access_replaceID: Identifier


				if (isARequire(node)) {
					let require: Require = node as Require
					let requireString: string = (require.arguments[0] as Literal).value.toString();
// imports
					let idStr: string = requireTracker.getFromDeMap(requireString, "ms")
					console.log(`acc   ${idStr}`
					)
					if (!idStr) {
						if (imports[requireString]) { //already have made import string
							access_replaceID = id(imports[requireString])
						} else {// make import string
							access_replaceID = extractBestModuleName(requireString, ns)
							// imports[requireString] = idStr
						}
					}  else
						{
							//made import string during declarations
							access_replaceID = id(idStr)
						}

						//check is call expression and not single-identifier declarator
						if (parent && "CallExpression" === parent.type ||
							"MemberExpression" === parent.type ||
							"AssignmentExpression" === parent.type ||
							("VariableDeclarator" === parent.type && parent.id.type === "ObjectPattern")) {


							switch (parent.type) {
								case "CallExpression":
									if (node === parent.callee) {
										parent.callee = access_replaceID;
									} else {
										parent.arguments.forEach((elem: Expression | SpreadElement, index: number, array: Node[]) => {
											if (elem === node) {
												array[index] = access_replaceID;
											}
										});
									}

									return;
								case "MemberExpression":
									parent.object = access_replaceID;
									return;
								case "AssignmentExpression":
									parent.right = access_replaceID;
									return;
								case "VariableDeclarator":
									if (parent.id.type === "ObjectPattern" && (!js.usesNamed())) {
										// return VisitorOption.Remove
										js.getInfoTracker().addDeconsId(access_replaceID)
									} else if (parent.id.type === "ObjectPattern") {
										parent.init = access_replaceID
										//return VisitorOption.Remove;
									} else {
										return node;
									}

							}
						} else {
							switch (parent.type) {
								case "NewExpression":
								case "IfStatement":
								case"WhileStatement":
								case"DoWhileStatement":
								case "ForStatement":
								case "LogicalExpression":
								case  "ConditionalExpression":
								case "SwitchCase":
									return access_replaceID;
									break;
								case "FunctionDeclaration" :
								case "FunctionExpression" :
								case "ArrowFunctionExpression":

									//not needed here because parent would be body
									break;
								case"VariableDeclarator":
									return;
								default:
									return;
							}

						}
					} else if (parent === null) {
						return;
					}
					//if there is a variable declaration of any type inside a for loop
					if (isForLoopAccess(node, parent)
						&& node.type === "VariableDeclaration"
					) {
						node.declarations.forEach((e: VariableDeclarator) => {
							extractRequireDataForAccess(e, extractBestModuleName, ns);
						});
					}

				} ,
				leave: (node, parentNode) => {
					if (node.type === "VariableDeclaration"
						&& node.declarations[0]
						&& node.declarations[0].id.type === "ObjectPattern"
						&& (!node.declarations[0].init)
					) {
						return VisitorOption.Remove;
					}

				}
			};



	// function extractBestIdentifier(requireStr: string, ns: Namespace): Identifier {
	// 	let cleaned = cleanValue(requireStr);
	// 	let idName = `_moduleAccess_${cleaned}`
	// 	let identifier: Identifier;
	// 	if (!imports[requireStr]) {
	// 		identifier = ns.generateBestName(idName);
	// 		// identifier = {type:"Identifier", name:imports[requireStr]}
	// 		imports[requireStr] = identifier.name;
	// 	} else {
	// 		identifier = {type: "Identifier", name: imports[requireStr]}
	// 	}
	// 	return identifier;
	// }


	function extractBestModuleName(requireStr: string, ns: Namespace): Identifier {
		// let cleaned = cleanValue(requireStr);
		let idName = `${cleanValue(requireStr)}`;

		if (!imports[requireStr]) {
			imports[requireStr] = ns.generateBestName(idName).name
			ns.addToNamespace(imports[requireStr])
		}
		return id(imports[requireStr]) //identifier = {type: "Identifier", name: }
	}


	replace(js.getAST(), visitor)
	js.getAST().body.forEach(e => {
		traverse(e, {
			enter: (node, parent) => {
				if (parent !== null && node.type === "VariableDeclaration") {
					node.declarations.forEach(e => {
						extractRequireDataForAccess(e, extractBestModuleName, ns);
					})
				}
			}
		})
	});
	// replace(ast, visitor)
	// TODO IS THIS NECESSARY?
	// ast.body.forEach(e => {
	// 	traverse(e, {
	// 		enter: (node, parent) => {
	// 			if (parent !== null && node.type === "VariableDeclaration") {
	// 				node.declarations.forEach(e => {
	// 					extractRequireDataForAccess(e, extract , ns);
	// 				})
	// 			}
	// 		}
	// 	})
	// });
	// return imports;
}


function cleanValue(requireStr: string): string {
	let replaceDotJS: RegExp = new RegExp(`(\.json)|(\.js)`, 'g')// /[\.js|]/gi
	let illegal: RegExp = new RegExp(`([^${alphaNumericString}_])`, "g"); ///[alphaNumericString|_]/g
	let cleaned = requireStr.replace(replaceDotJS, '');
	cleaned = cleaned.replace(illegal, "_");

	return cleaned;
}


function getRequireStringFromDecl(node: VariableDeclarator) {
	if (node.init.type === "CallExpression"
		&& node.init.callee.type === "Identifier"
		&& node.init.callee.name === "require"
		&& node.init.arguments && node.init.arguments[0] !== null
		&& node.init.arguments[0].type === "Literal") {
		return node.init.arguments[0].value.toString();
	}
}

function isForLoopAccess(node: Node, parent: Node) {
	return ((
		parent && (parent.type === "ForStatement" && parent.init && parent.init.type === "VariableDeclaration"
		|| parent.type === "ForInStatement" && parent.left && parent.left.type === "VariableDeclaration")
		&& node.type === "VariableDeclaration"
		&& node.declarations.length > 0
		&& ((parent.type === "ForStatement" && node === parent.init)
		|| (parent.type === "ForInStatement" && node === parent.left))));

}

function extractObjectData(oPatt, obj: (Identifier | ObjectPattern | ArrayPattern | RestElement |
	AssignmentPattern | MemberExpression | AssignmentExpression)) {
	let key = (oPatt.obj as Property).key as (Identifier | ObjectPattern | ArrayPattern | RestElement |
		AssignmentPattern | MemberExpression | AssignmentExpression) as Pattern;

	let val = obj// (oPatt.obj as Property).value
	let vd: VariableDeclarator = {
		type: "VariableDeclarator",
		id: key,
		init: val as Expression
	}
	let vn: VariableDeclaration = {
		type: "VariableDeclaration",
		kind: "const",
		declarations: [vd]

	}
	return vn;
}

function extractRequireDataForAccess(e: VariableDeclarator, extract: (requireStr: string, ns: Namespace) => Identifier, ns: Namespace) {
	if ((e.init && e.init.type === "CallExpression"
		&& e.init.callee.type === "Identifier"
		&& e.init.callee.name === "require"
		&& e.init.arguments && e.init.arguments[0] !== null
		&& e.init.arguments[0].type === "Literal")) {
		let id = extract(getRequireStringFromDecl(e), ns);
		e.init = id;
	}
}


function toAssignOrDecl(typeName: string, id: Pattern, value: MemberExpression): Statement {
	if (typeName === "ExpressionStatement") {
		let as: AssignmentExpression = {
			type: "AssignmentExpression",
			left: id,
			right: value,
			operator: "="
		};
		return {
			type: "ExpressionStatement",
			expression: as
		}

	} else if (typeName === "VariableDeclaration") {
		let variableDeclarator: VariableDeclarator = {
			type: "VariableDeclarator",
			id: id,
			init: value
		}
		return {
			type: "VariableDeclaration",
			kind: "const",
			declarations: [variableDeclarator],
		}
	} else {
		throw new Error("unexpected state");
	}
}


function makeAMembery(objID: Expression, propID: Expression): MemberExpression {
	return {
		type: "MemberExpression",
		computed: false,
		object: objID,
		property: propID
	}
}

interface Require extends SimpleCallExpression {
	callee: { type: "Identifier", name: "require" }
	arguments: Array<Literal>
}

function isARequire(node: Node): boolean {
	return node.type === "CallExpression"
		&& node.callee.type === "Identifier"
		&& node.callee.name === "require";
}

function deconstructDeconstructors(node: VariableDeclaration, parent: Node | null, info: InfoTracker, js: JSFile) {

	let ids = info.getIDs()

	let stmts: VariableDeclaration[] = [];
	let init: Identifier = node.declarations[0].init as Identifier;
	let memexFactory: (x: string) => MemberExpression = (e: string) => {
		return {
			type: "MemberExpression",
			object: init,
			property: id(e),
			computed: false
		}
	}
	(node.declarations[0].id as ObjectPattern).properties.forEach((e: Property | RestElement) => {
		if (e.type === "Property") {
			if (e.shorthand && e.value.type === "Identifier") {
				stmts.push({
					type: "VariableDeclaration",
					kind: node.kind,
					declarations: [{
						type: "VariableDeclarator",
						id: e.value,
						init: memexFactory(e.value.name)
					}]
				})
			} else if (e.key.type === "Identifier" && e.value.type === "Identifier") {
				//not shorthand
				stmts.push({
					type: "VariableDeclaration",
					kind: node.kind,
					declarations: [{
						type: "VariableDeclarator",
						id: e.value,
						init: memexFactory(e.key.name)
					}]
				})
			}
		} else if (e.type === "RestElement") {
			throw new Error("TODO? ")
			//TODO/IS THIS DOABLE/DONE?
			// e.argument
			// stmts.push({
			// 	type: "VariableDeclaration",
			// 	kind: node.kind,
			// 	declarations: [{
			// 		type: "VariableDeclarator",
			// 		id: e.value,
			// 		init: memexFactory(e.key.name)
			// 	}]
			// })
		}
	});

	let body: (Statement | Directive | ModuleDeclaration)[]

	// get body or code block
	if ("Program" === parent.type) {
		body = (parent as Program).body
	} else if (parent.type === "BlockStatement") {
		body = (parent as BlockStatement).body
	} else if (parent.type === "ForStatement") {
		//error/won't happen
		return;
	} else {
		throw new Error("don't know why it got here ")
	}
	let index = body.indexOf(node)
	// = body[body.indexOf(node)]

	stmts.forEach(e => {
		// body .splice(index,0,e)
		js.addToTop(e)
	})
	index = body.indexOf(node)
	body.splice(index, 1)

	return VisitorOption.Remove
}
