import {replace, traverse, Visitor, VisitorOption} from "estraverse";
import {
	CallExpression,
	Directive,
	Expression,
	ExpressionStatement,
	Identifier,
	MemberExpression,
	ModuleDeclaration,
	Node,
	Property,
	SpreadElement,
	Statement,
	VariableDeclaration,
	VariableDeclarator
} from "estree";
import {id} from "../abstract_fs_v2/interfaces";
import {JSFile} from "../abstract_fs_v2/JSv2";
import {ProjectManager} from "../abstract_fs_v2/ProjectManager";
// import {asModuleDotExports} from "./pass0";
// import {flattenDirectAssignOfObjectLiteralToModuleDotExports} from "./subvisitors/exports/FlattenExportObjectAssignment";
// import {flattenVariableDeclarations} from "./subvisitors/general/FlattenVariableDeclarators";
// import {flattenRequireObjectDeconstructions2} from "./subvisitors/require/FlattenObjectDeconstructions";
import {exportsDot, isARequire, isModule_Dot_Exports, module_dot_exports} from "./utilities/helpers";
import {asRequire, RequireCall} from "./utilities/Require";


export const clean = (pm: ProjectManager) => {
	pm.forEachSource(janitor);
};
export {clean as default}

function tagRequire(node: Node, parent: Node) {
	if (node.type === "VariableDeclaration"
		&& node.declarations
	) {
		node.declarations.forEach((decl: VariableDeclarator) => {
			if (
				decl.id.type === "Identifier"
				&& decl.init
				&& isARequire(decl.init)

			) {
				// let rs =(<Literal>(<CallExpression> decl.init).arguments[0]).value.toString()
				// 	let _id = decl.id.name
				if (parent.type === "Program") {
					// @ts-ignore
					decl.init.topLevel = true
				} else {
					// @ts-ignore
					decl.init.topLevel = false

				}
			}
		})
		// let z = (declarator:VariableDeclarator)
	}
}

export function janitor(js: JSFile) {
	const body = js.getAST().body
	let rst = js.getRST()
	traverse(js.getAST(), {
		leave: (node: Node, parent: Node) => {
			if (isARequire(node)) {
				let rs = (node as RequireCall).arguments[0].value.toString();
				(node as RequireCall).arguments[0].value = rst.getTransformed(rs);
			}

			flattenDirectAssignOfObjectLiteralToModuleDotExports().leave(node, parent)
			flattenRequireObjectDeconstructions2(js).enter(node, parent)
			if (node.type === "MemberExpression" && node.object.type === "Identifier" && node.object.name === "exports") {
				node.object = module_dot_exports()
			}

		}

	})
	traverse(js.getAST(), {
		enter: tagRequire,
		leave: flattenVariableDeclarations
	});
	js.rebuildNamespace(js.getDefaultExport())
	cleanExports(js)


	let imports = hoistRequires(js)


	if (imports) {
		body.splice(0, 0, ... imports)
	}
}

function cleanExports(js: JSFile) {

	let exportData: { [id: string]: string } = {}
	let hasDefautl = false
	let toDefineList: string[] = []
	traverse(js.getAST(), {

		enter: (node: Node, parent: Node) => {

			if (
				node.type === "ExpressionStatement"
				&& node.expression.type === "AssignmentExpression"
				&& node.expression.left.type === "MemberExpression"
				&& (isModule_Dot_Exports(node.expression.left)
					|| (isModule_Dot_Exports(node.expression.left.object))
				)
				&& (parent.type === "Program"
				|| parent.type === "BlockStatement")
			) {
				let data = asModuleDotExports(node.expression.left)
				if (data) {
					// let list: Statement[] = []
					let identifier: Identifier
					switch (data.type) {
						case "name":
							if (!exportData[data.Export]) {

								let copy = js.getNamespace().generateBestName(data.Export)
								identifier = copy
								exportData[data.Export] = copy.name
							} else {
								identifier = id(exportData[data.Export])
							}
							break;
						case "default":
							hasDefautl = true;
							identifier = js.getDefaultExport()

							break;

					}
					node.expression.left = identifier

					if (!toDefineList.includes(identifier.name)) {
						toDefineList.push(identifier.name)
					}

				}
			}
		}
	})

	let dcls = toDefineList.map(e => declare(e, null))
	let dcl: VariableDeclaration = {
		kind: "var",
		type: "VariableDeclaration",
		declarations: dcls
	}
	if (dcls.length > 0) {
		js.getAST().body.splice(0, 0, dcl)
	}
	if (hasDefautl) {
		js.getAST().body.push(assignExport(js.getDefaultExport().name))
	}
	js.getAST().body.push(... Object.keys(exportData)
		.map(
			e => assignExport(e, exportData[e]))
	)
}

function assignExport(e1: string, e2: string = ''): ExpressionStatement {
	return {
		type: "ExpressionStatement",
		expression: {
			type: "AssignmentExpression", operator: '=',
			left: e2 === '' ? module_dot_exports() : {
				type: "MemberExpression",
				object: module_dot_exports(),
				property: id(e1),
				computed: false
			},
			right: id(e2 === '' ? e1 : e2)
		}
	}
}

function hoistRequires(js: JSFile) {
	let ids: { [key: string]: string } = {}
	let toAdd: Statement[] = []
	replace(js.getAST(), {
		enter: (node: Node, parent: Node) => {


			if (node.type === "VariableDeclaration"
				&& node.declarations.length === 1
				&& node.declarations[0].init
				&& node.declarations[0].id.type === "Identifier"
				&& isARequire(node.declarations[0].init)
			) {
				if (parent.type === "Program") {
					toAdd.push(node)

					let $ = asRequire(node.declarations[0].init)
					let rs = $.getRS()
					ids[rs] = node.declarations[0].id.name
					return VisitorOption.Remove
				} else {


					let $ = asRequire(node.declarations[0].init)
					let id2: Identifier
					let clean = $.getCleaned()
					let rs = $.getRS()

					if (!ids[rs]) {
						let id2_ = clean
						id2 = js.getNamespace().generateBestName(id2_)
						ids[rs] = id2.name
					} else {
						let id2_ = ids[rs]
						id2 = id(id2_)
					}
					toAdd.push(declaration(id2, $))
					node.declarations[0].init = id(id2.name)
					return (<VariableDeclaration>{
						type: "VariableDeclaration",
						kind: node.kind,
						declarations: [
							{type: "VariableDeclarator", id: node.declarations[0].id, init: id2}
						]
					})
				}


			} else {
				// @ts-ignore
				if (node.type === "CallExpression" && isARequire(node) && !node.topLevel) {
					let $ = asRequire(node)
					let id2: Identifier
					let clean = $.getCleaned()

					let rs = $.getRS()
					if (!ids[$.getRS()]) {
						ids[$.getRS()] = clean
					}
					id2 = js.getNamespace().generateBestName(ids[rs])
					toAdd.push(declaration(id2, $))
					return id2
				}
			}

		}
	})

	return toAdd
}

function declaration($id: string | Identifier, requireCallString: string | RequireCall) {
	let _id = typeof $id == "string" ? $id : $id.name

	let declaration: VariableDeclaration = {
		kind: "var",
		type: "VariableDeclaration", declarations: []
	}
	if (typeof requireCallString == "string") {
		let callex: CallExpression = {
			type: "CallExpression",
			arguments: [{type: "Literal", value: requireCallString}],
			callee: id('require')
		}
		declaration.declarations.push(declare(_id, callex))

	} else {
		declaration.declarations.push(declare(_id, requireCallString))

	}
	return declaration
}


function flattenVariableDeclarations(node: Node, parent: Node,): void {
	if (node.type === 'VariableDeclaration'
		&& node.declarations.length > 1) {
		// flattenDeclarations(node, parent);
		let {kind: _kind, type: _type} = node;
		let flattened: (Statement | VariableDeclaration)[] = node.declarations.map(
			(dclr: VariableDeclarator) => {
				return {
					kind: _kind,
					type: _type,
					declarations: [dclr]
				}
			})
		if ("Program" === parent.type || parent.type === "BlockStatement") {
			// insert back into body array
			let indexOf = parent.body.indexOf(node);

			// flattened.reverse().forEach((e) => {
			// 		parent.body.splice(indexOf, 0, e)
			// 	}
			// )
			indexOf = parent.body.indexOf(node);
			parent.body.splice(indexOf, 1, ... (flattened.reverse()))
		} else if ("ForStatement") {
			return;
		} else {
			throw new Error("don't know why it got here ")
		}
	}

	function getToFlatten(vdcln: VariableDeclaration): (Statement | VariableDeclaration)[] {
		let flattened: (Statement | VariableDeclaration)[] = []

		vdcln.declarations.forEach((decl: VariableDeclarator) => {
			//add declarator to be flattened.
			let ls: VariableDeclarator[] = []
			ls.push(decl)
			// if (decl.init && isARequire(decl.init)
			// ) {
			// }
			let flat: VariableDeclaration = {
				kind: vdcln.kind,
				type: vdcln.type,
				declarations: ls
			}

			//add to flatten decl list.
			flattened.push(flat)
		});
		return flattened
	}
}

function flattenDirectAssignOfObjectLiteralToModuleDotExports() {
	return {
		leave: function (node: Node, parent: Node):
			void {
			if (
				node.type === "ExpressionStatement"
				&& node.expression.type === "AssignmentExpression"
				&& node.expression.left.type === "MemberExpression"
				&& (parent.type === "Program" || parent.type === "BlockStatement")
			) {
				let exps: (Statement | ModuleDeclaration | Directive)[] = []
				if (node.expression.left.object.type === "Identifier"
					&& node.expression.left.property.type === "Identifier"
					&& node.expression.left.object.name === "module"
					&& node.expression.left.property.name === "exports"
					&& parent.type === "Program" || parent.type === "BlockStatement") {

					if (node.expression.right.type === "ObjectExpression"
						&& node.expression.right.properties.length > 0
					) {
						node.expression.right.properties.forEach((e: Property | SpreadElement) => {
							if (e.type !== "Property") {
								throw new Error()
							}


							exps.push({
								type: "ExpressionStatement",
								expression: {
									type: "AssignmentExpression",
									operator: "=",
									left: exportsDot((e.key as Identifier).name),
									right: e.value as Expression
								}
							})

						})
						parent.body.splice(parent.body.indexOf(node), 1, ... exps)
					}
				}
			}
		}
	}
}

export function flattenRequireObjectDeconstructions2(js: JSFile): Visitor {
	return (() => {
		let seenIds: { [key: string]: () => Identifier } = {}
		let visitor: Visitor = {
			enter: (node: Node, parent: Node) => {
				if (node.type === "VariableDeclaration" && node.declarations) {
					node.declarations.forEach((decl, i, arr) => {
						if (decl.id.type === "ObjectPattern" && isARequire(decl.init)) {
							let rc = asRequire(decl.init)
							let rs = rc.getRS()
							if (!seenIds[rs]) {
								seenIds[rs] = () => js.getNamespace().generateBestName(rc.getCleaned())
							}
							let __init: Identifier = seenIds[rs]()

							let toadd: VariableDeclarator[] = [
								declare(__init.name, decl.init)
							]

							decl.id.properties.forEach((prop) => {

								switch (prop.type) {
									case "Property":
										toadd.push({
											type: "VariableDeclarator",
											id: prop.value,
											init: {
												object: __init,
												property: prop.key,
												computed: false,
												type: "MemberExpression"
											}
										})


										i++

										break;
									case "RestElement":

										throw new Error("unsupported operation")
								}
							})
							arr.splice(i, 1, ... toadd);
							arr.splice(arr.indexOf(decl), 1);


						}

					})

				}
			}
		}
		return visitor
	})()
}


function declare(ident: string | Identifier, value: Expression = undefined): VariableDeclarator {
	let _id = typeof ident == 'string' ? id(ident) : ident
	return {id: _id, init: value || null, type: "VariableDeclarator"}
}

function asModuleDotExports(mx: MemberExpression): { Export: string, type: 'name' | 'default' } {
	if (mx.property.type === "Identifier") {
		if (mx.object.type === "Identifier"
			&& mx.object.name === "module"
			&& mx.property.name === "exports"
		) {
			return {Export: '', type: 'default'}
		} else if (isModule_Dot_Exports(mx.object)) {
			return {Export: mx.property.name, type: 'name'}
		}
	}
	return null
}
