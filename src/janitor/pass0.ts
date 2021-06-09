import {generate} from "escodegen";
import {traverse, VisitorOption} from "estraverse";
import {
	AssignmentExpression,
	AssignmentProperty,
	CallExpression,
	Directive,
	Expression,
	ExpressionStatement,
	Identifier,
	Literal,
	MemberExpression,
	ModuleDeclaration,
	Node,
	Property,
	SpreadElement,
	Statement,
	VariableDeclaration,
	VariableDeclarator
} from "estree";
import {id} from "../../abstract_fs_v2/interfaces";
import {JSFile} from "../../abstract_fs_v2/JSv2";
import {RequireStringTransformer} from "../../transformations/sanitizing/requireStringTransformer";

export const module_dot_exports: MemberExpression = {
	type: "MemberExpression",
	object: id('module'),
	property: id('exports'),
	computed: false
}

function cleanRequires(node: Node, parent: Node, ids: { [p: string]: string }, js: JSFile, rst: RequireStringTransformer): void {
	if (node.type === "CallExpression" && isARequire(node)) {

		if (parent && parent.type === "VariableDeclarator"
			&& parent.id.type === "Identifier") {
			ids[cleanRequire(node, js, rst)] = parent.id.name
		} else if (parent && parent.type !== "VariableDeclarator") {
			ids[cleanRequire(node, js, rst)] = ''; // so it is a key
		} else {
			//case where parent is variabledeclarator and not identifier
			// (handled in pattern flatten)
		}

	}
}

function flattenObjectPattern(node: Node, js: JSFile, rst: RequireStringTransformer, ids: { [p: string]: string }): void {
	if (node.type === "VariableDeclaration" && node.declarations) {
		node.declarations.forEach((decl, i, arr) => {
			let toadd: VariableDeclarator[] = []
			if (decl.id.type === "ObjectPattern") {
				let __init: Identifier = js.getNamespace().generateBestName('__init')
				let vdc: VariableDeclarator = {
					type: "VariableDeclarator",
					id: __init,
					init: decl.init
				}
				let toremove = decl
				console.log(generate(vdc))

				// arr.splice(arr.indexOf(decl), 0, vdc)
				toadd.push(vdc)
				console.log(i + decl.init.type)
				if (isARequire(decl.init)) {
					let requireString: string = cleanRequire(decl.init as CallExpression, js, rst)
					ids[requireString] = __init.name
				}
				decl.id.properties.forEach((prop) => {

						// console.log(generate(node ))
						switch (prop.type) {
							case "Property":
								prop = (prop as AssignmentProperty)
								let mx: MemberExpression = {
									object: __init,
									property: prop.key,
									computed: false,
									type: "MemberExpression"
								}

								let vdx: VariableDeclarator = {
									type: "VariableDeclarator",
									id: prop.value,
									init: mx
								}
								// console.log(generate(vdx))
								toadd.push(vdx)

								// arr.splice(i>=arr.length? arr.length:i, 0, vdx)

								i++
								// console.log(prop.key)
								// console.log(prop.value)

								break;
							case "RestElement":
								throw new Error("unsupported operation")
						}
					}
				)
				arr.splice(i, 1, ... toadd);
				arr.splice(arr.indexOf(toremove), 1);


			}
		})

	}
}

function getToFlatten(vdcln: VariableDeclaration): (Statement | VariableDeclaration)[] {
	let flattened: (Statement | VariableDeclaration)[] = []

	vdcln.declarations.forEach((decl: VariableDeclarator) => {
		//add declarator to be flattened.
		let ls: VariableDeclarator[] = []
		ls.push(decl)
		if (decl.init && decl.init.type === "CallExpression"
			&& decl.init.callee.type === "Identifier"
			&& decl.init.callee.name === "require"

		) {
		}
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

function flattenDeclarations(node: VariableDeclaration, parent: Node): void {
	let flattened: (Statement | VariableDeclaration)[] = getToFlatten(node)
	if ("Program" === parent.type || parent.type === "BlockStatement") {
		// insert back into body array
		let indexof = parent.body.indexOf((node as Statement | Directive));
		flattened.reverse().forEach((e) => {
				parent.body.splice(indexof, 0, e)
			}
		)
		indexof = parent.body.indexOf((node as Statement | Directive));
		parent.body.splice(indexof, 1)
	} else if ("ForStatement") {
		return;
	} else {
		throw new Error("don't know why it got here ")
	}
}

export interface DataInterface {
	reqStrToIDMap: { [key: string]: string }
	exportNameToNodeList: { [key: string]: Node[] }
}

interface ExportInfo {
	defaultIsObjectExpr: boolean;
	hasNamed: boolean;
	hasBoth: boolean;
	hasDEfault: boolean
}

type Body = (Directive | Statement | ModuleDeclaration)[]

function dropAndFlattenExports(assign: AssignmentExpression, node: ExpressionStatement, parent: Node, js: JSFile): { tmp: Body, declareDefault: boolean } {
	let decls: (Directive | Statement | ModuleDeclaration)[] = []
	let tmp: (Directive | Statement | ModuleDeclaration)[] = []
	let declareDefault = false;
	if (assign.left.type === "MemberExpression"
	) {
		if ((parent.type === "Program" || parent.type === "BlockStatement")) {
			if (assign.left.object.type === "Identifier"
				&& assign.left.property.type === "Identifier"
				&& assign.left.object.name === "module"
				&& assign.left.property.name === "exports"
				&& parent.type === "Program" || parent.type === "BlockStatement") {

				if (assign.right.type === "ObjectExpression") {
					assign.right.properties.forEach((e: Property | SpreadElement) => {
						if (e.type !== "Property") {
							throw new Error()
						}
						let vd: VariableDeclarator = {
							type: "VariableDeclarator",
							id: (e.key) as Identifier,
							init: (e.value as Expression)
						}
						let expression: AssignmentExpression = {
							type: "AssignmentExpression",
							operator: "=",
							left: exportsDot((e.key as Identifier).name),
							right: (e.key) as Identifier
						}
						let ex: ExpressionStatement = {
							type: "ExpressionStatement",
							expression
						}
						decls.push({
							kind: "var",
							type: "VariableDeclaration",
							declarations: [vd]
						})
						tmp.push(ex)
					})
					parent.body.splice(parent.body.indexOf(node), 1, ... decls)

				} else {

					declareDefault = true
					assign.left = js.getNamespace().getDefaultExport()


				}
			}
			if (assign.left.type === "MemberExpression" && ((

				assign.left.object.type === "MemberExpression" &&
				assign.left.object.object.type === "Identifier"
				&& assign.left.object.property.type === "Identifier"
				&& assign.left.object.object.name === "module"
				&& assign.left.object.property.name === "exports"
				&& assign.left.property.type === "Identifier"
			) || (
				assign.left.object.type === "Identifier"
				&& assign.left.object.name === "exports"
				&& assign.left.property.type === "Identifier"

			))
			) {
				{
					let realname = assign.left.property.name
					let bestname = js.getNamespace().generateBestName(realname)
					console.log(realname)
					console.log(bestname.name)
					let vd: VariableDeclarator = {
						type: "VariableDeclarator",
						id: bestname,
						init: assign.right
					}
					let expression: AssignmentExpression = {
						type: "AssignmentExpression",
						operator: "=",
						left: exportsDot(realname),
						right: bestname
					}
					let ex: ExpressionStatement = {
						type: "ExpressionStatement",
						expression
					}
					// decls.push()
					tmp.push(ex)

					parent.body.splice(parent.body.indexOf(node), 1,
						{
							kind: "var",
							type: "VariableDeclaration",
							declarations: [vd]
						})
				}
			}
		} else {
			throw new Error('expecred type with body, got: ' + parent.type)
		}
	}
	return {tmp, declareDefault}
}

/**.
 * TransformFunction that does Variable Declaration Declarator flattening.
 * @param js the JSFile to transform.
 */
export default function (js: JSFile) {

	let reqStrToIDMap: { [key: string]: string } = {}
	let inits = 0;
	let rst: RequireStringTransformer = new RequireStringTransformer(js)
	// {
	// 	reqStrToIDMap
	// }
	let exportNameToNodeList: { [key: string]: Node[] } = {}
	let exportIDs: { [key: string]: string } = {}
	const di: DataInterface = {reqStrToIDMap, exportNameToNodeList}
	let defaultExport = js.getNamespace().getDefaultExport()

	js.setSDI(di)
	let defaultCount = 0;
	let defaultIsObjectExpr = false;
	let namedCOunt = 0;
	let kv: { [prop: string]: string } = {}

	function enter(node: Node, parent: Node | null) {

		cleanRequires(node, parent, reqStrToIDMap, js, rst);


		flattenObjectPattern(node, js, rst, reqStrToIDMap);
		if (node.type === "ExpressionStatement"
			&& node.expression.type === "AssignmentExpression"
			&& node.expression.left.type === "MemberExpression"
		) {
			let exps: (Statement | ModuleDeclaration | Directive)[] = []
			if ((parent.type === "Program" || parent.type === "BlockStatement")) {
				if (node.expression.left.object.type === "Identifier"
					&& node.expression.left.property.type === "Identifier"
					&& node.expression.left.object.name === "module"
					&& node.expression.left.property.name === "exports"
					&& parent.type === "Program" || parent.type === "BlockStatement") {

					if (node.expression.right.type === "ObjectExpression") {
						node.expression.right.properties.forEach((e: Property | SpreadElement) => {
							if (e.type !== "Property") {
								throw new Error()
							}
							let $_id: Identifier = e.shorthand ?
								js.getNamespace().generateBestName((e.key as Identifier).name)
								: (e.key as Identifier)
							let vd: VariableDeclarator = {
								type: "VariableDeclarator",
								id: $_id,
								init: e.key as Identifier
							}
							let expression: AssignmentExpression = {
								type: "AssignmentExpression",
								operator: "=",
								left: exportsDot((e.key as Identifier).name),
								right: $_id

							}
							kv[(e.key as Identifier).name] = $_id.name
							let ex: ExpressionStatement = {
								type: "ExpressionStatement",
								expression
							}
							let vdcln: VariableDeclaration = {
								kind: "var",
								type: "VariableDeclaration",
								declarations: [vd]
							}

							exps.push(vdcln)
							exps.push(ex)

						})
						parent.body.splice(parent.body.indexOf(node), 1, ... exps)

					}else{
						return js.getNamespace().getDefaultExport()
					}
				}else if(
					((node.expression.left.type === "MemberExpression"
					 && node.expression.left.object.type === "Identifier"
					 && node.expression.left.object.name === "exports"
						)
					|| node.expression.left.object.type === "MemberExpression"
						&& generate( node.expression.left.object) ==="module.exports"
					)
					 && node.expression.left.property.type === "Identifier"
				){
					if(!kv[node.expression.left.property.name] ) {
						kv[node.expression.left.property.name] =
							js.getNamespace().generateBestName(node.expression.left.property.name).name
						parent.body.splice(parent.body.indexOf(node),0,{
							type:"VariableDeclaration",
							kind:"var",
							declarations:[{
								type:"VariableDeclarator",
								id:id(kv[node.expression.left.property.name])
							}]
						})
					}
					node.expression.left = id(kv[node.expression.left.property.name] )

				}

			}
		}
		if (node.type === "MemberExpression"
			&& parent
			// && parent.type === "AssignmentExpression"
			// && parent.left ===node
		) {

			let name: string = ''
			if (node.object.type === "Identifier" && node.property.type === "Identifier") {
				if (node.object.name === "module") {
					name = defaultExport.name
					defaultCount++
					if (parent
						&& parent.type === "AssignmentExpression"
						&& parent.left === node
						&& parent.right.type === "ObjectExpression") {
						defaultIsObjectExpr = true;
					}
				} else if (node.object.name === "exports") {
					name = node.property.name
					namedCOunt++

				}
			} else if (
				node.object.type === "MemberExpression"
				&& node.object.object.type === "Identifier"
				&& node.object.object.name === "module"
				&& node.object.property.type === "Identifier"
				&& node.object.property.name === "exports"
				&& node.property.type === "Identifier") {
				name = node.property.name
				namedCOunt++
			}
			if (name) {

				/*  */
				// if(!exportIDs[name]){
				//  exportIDs[name] = js.getNamespace().generateBestName(name).name;
				// }

				// parent.left = {type:"Identifier",name:exportIDs[name]}
				/*  */

				if (!exportNameToNodeList[name]) {
					exportNameToNodeList[name] = [];
				}
				if (!exportNameToNodeList[name].includes(parent)) {
					exportNameToNodeList[name].push(parent)
				}
			}
		}


	}

	let hasDEfault = defaultCount > 0
	let hasNamed = namedCOunt > 0
	let hasBoth = hasDEfault && hasNamed
	let xportsdata: ExportInfo = {hasBoth, hasDEfault, hasNamed, defaultIsObjectExpr}
	let declareDefaultID = false;
	let _exports: (Directive | Statement | ModuleDeclaration)[] = []
	const leave = (node: Node, parent: Node): void => {
		if (node.type === "ExpressionStatement"
			&& node.expression.type === "AssignmentExpression"
			&& node.expression.left.type === "MemberExpression"
		) {

			// + assign.left.object.object.type === "Identifier"
			// + assign.left.object.property.type === "Identifier"
			//
			// + assign.left.object.object.name === "module"
			// + assign.left.object.property.name === "exports"
			// )
// 			let {tmp,declareDefault } = dropAndFlattenExports(node.expression, node, parent, js);
// 			_exports.push(... tmp)
// declareDefaultID = declareDefaultID||declareDefault

		}

		if (node.type === "ForStatement") {
			return; //handled elsewhere
		}
		if (node.type === 'VariableDeclaration') {

			if (node.type === 'VariableDeclaration'
				&& node.declarations.length > 1
				&& node) {
				flattenDeclarations(node, parent);

			}
		}
	};
	traverse(js.getAST(), {enter, leave});
	_exports.forEach(e => (js.getAST().body.push(e)))
	if (declareDefaultID) {
		js.getAST().body.splice(0, 0, {
			type: "VariableDeclaration",
			kind: "var",
			declarations: [{
				type: "VariableDeclarator",
				id: js.getNamespace().getDefaultExport()
			}]
		})

		js.getAST().body.push({
			type: "ExpressionStatement",
			expression: {
				type: "AssignmentExpression",
				operator: "=",
				left: module_dot_exports,
				right: js.getNamespace().getDefaultExport()
			}
		})
	}
	return di;

}


export const JSON_REGEX: RegExp = new RegExp('.+\.json$');


function cleanRequire(node: CallExpression, js: JSFile, rst: RequireStringTransformer) {
	if (node.callee.type === "Identifier"
		&& node.callee.name === "require"
		&& node.arguments[0].type === "Literal") {
		let literal = node.arguments[0].value.toString()
		let requireString: string = rst.getTransformed(literal)
		if (requireString !== literal) {
			//had to be cleaned
		}


		if (JSON_REGEX.test(requireString)) {
			//was json
			requireString = js.createCJSFromIdentifier(requireString)
		}

		node.arguments[0] = {type: "Literal", value: requireString}
		return requireString
	}
}

function isARequire(node) {
	return node.type === "CallExpression"
		&& node.callee.type === "Identifier"
		&& node.callee.name === "require";
}

function isAnExport(node: Node, parent: Node): boolean {
	if (node.type !== "MemberExpression"
		|| parent.type !== "AssignmentExpression") {
		return false
	}

	if (node.object.type === "Identifier" && node.property.type === "Identifier") {
		if (node.object.name === "module") {
			//name = 'default'
		} else if (node.object.name === "exports") {
			//name = node.property.name
		}
	} else if (
		node.object.type === "MemberExpression"
		&& node.object.object.type === "Identifier"
		&& node.object.object.name === "module"
		&& node.object.property.type === "Identifier"
		&& node.object.property.name === "exports"
		&& node.property.type === "Identifier") {

	}
}

// console.log(require('jsdiff').diffChars)
function walk2(js: JSFile, data: DataInterface) {
	let toRemove: number[] = []
	let toHoist: (ExpressionStatement | VariableDeclaration)[]


	function enter(node: Node, parent: Node | null) {
		if (node.type === "VariableDeclarator"
			&& node.init && isARequire(node.init)) {
			if (parent.type === "Program") {
				let rs = ((node.init as CallExpression).arguments[0] as Literal).value.toString()
				data.reqStrToIDMap[rs] = (node.id as Identifier).name
			} else {
				//TODO INTERESTING CASE
			}
		}
	}

	function leave(node: Node, parent: Node | null) {

		isAnExport(node, parent)


		switch (node.type) {
			case "MemberExpression":
				break;
			case "VariableDeclaration":
				if (node.declarations[0].init
					&& isARequire(node.declarations[0].init)) {

				}
				break;
		}
	}
}

function hoist(node: Node, parent: Node | null,): (VisitorOption | Node) {

	return null
}

function exportsDot(prop: string): MemberExpression {
	return {
		type: "MemberExpression",
		object: module_dot_exports,
		property: id(prop),
		computed: false
	}
}
