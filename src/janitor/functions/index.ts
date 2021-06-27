import {replace, Visitor} from "estraverse";
import {
	AssignmentExpression,
	AssignmentProperty,
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
import {id} from "../../abstract_fs_v2/interfaces";
import {JSFile} from "../../abstract_fs_v2/JSv2";
import {JanitorRequireData} from "../data_management/RequireStringData";
import {moduleDotExports} from "../old/exports";
import {
	assign,
	EXPORT_INFO,
	exportsDot,
	isARequire,
	isModule_Dot_Exports,
	memberEx,
	module_dot_exports, ModuleDotExports
} from "../utilities/helpers";
import {asRequire} from "../utilities/Require";
interface ExportAssignmentStatement extends ExpressionStatement{
	expression:ExportAssignment
}
interface ExportAssignment extends AssignmentExpression{
	operator:'=',
	left : LHSExport,
	right: Identifier

}
interface LHSExport extends MemberExpression{
	object:ModuleDotExports | Identifier
	property:Identifier
	computed:false
}
function makeAnExportStatement(prop:ModuleDotExports | Identifier,name:Identifier, exportCopy:Identifier):ExportAssignmentStatement{
	let left:LHSExport = {computed: false, object: prop, property: name, type: "MemberExpression"}
	let expression:ExportAssignment ={left,right:exportCopy, type:"AssignmentExpression",operator:"="}
	let exp:ExportAssignmentStatement = {type:"ExpressionStatement",expression}
	return exp
}


export function flattenVariableDeclarations(node: Node, parent: Node,): void {
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

export function flattenRequireObjectDeconstructions(node: Node, js: JSFile, data: JanitorRequireData) {

	if (node.type === "VariableDeclaration" && node.declarations) {
		node.declarations.forEach((decl, i, arr) => {
			if (decl.id.type === "ObjectPattern" && isARequire(decl.init)) {
				let __init: Identifier = getRequireID(decl);
				let toadd: VariableDeclarator[] = [
					{
						type: "VariableDeclarator",
						id: __init,
						init: decl.init
					}
				]

				//compute
				console.log(i + decl.init.type)

				decl.id.properties.forEach((prop) => {

						switch (prop.type) {
							case "Property":
								prop = (prop as AssignmentProperty)


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
					}
				)
				arr.splice(i, 1, ... toadd);
				arr.splice(arr.indexOf(decl), 1);


			}

		})
		// }

	}

	function getRequireID(decl): Identifier {

		let __init: Identifier
		let $rs = asRequire(decl.init)
		let rs = $rs.getRS()

		if (data.mappingToID[rs]) {
			__init = id(data.mappingToID[rs])
			return __init
		} else {
			if (rs[0] !== '_') {
				rs = '_' + rs
			}
			__init = js.getNamespace().generateBestName($rs.getCleaned())
			data.addSpecifier(rs, __init.name)
			return __init
		}
	}
}

export function flattenDirectAssignOfObjectLiteralToModuleDotExports(node: Node, parent: Node): void {
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

			if (node.expression.right.type === "ObjectExpression") {
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

export function gatherExportInfo(node: Node, parent: Node, export_info: EXPORT_INFO) {
	let {exportNames} = export_info
	if (
		parent.type === "AssignmentExpression"
		&& node.type === "MemberExpression"
		&& node.property.type === "Identifier"
	) {
		if (isModule_Dot_Exports(node)
			&& parent.right.type !== "ObjectExpression") {
			export_info.hasDefault = true;
		} else if (isModule_Dot_Exports(node.object)
			|| (node.object.type === "Identifier"
				&& node.object.name === "exports")
		) {
			export_info.hasNamed = true;
			exportNames[node.property.name] = ''
		}
	}
}


function testIsExport(node: MemberExpression): Boolean {
	return (node.object.type === "MemberExpression"
		&& isModule_Dot_Exports(node.object))
		|| (node.object.type === "Identifier" && node.object.name === "exports");
}

function bestExportName(node: MemberExpression, exportNames: { [p: string]: string }, js: JSFile): Identifier {

	let name = (node.property as Identifier).name
	if (exportNames[name]) {
		return id(name)
	} else {
		let _name = js.getNamespace().generateBestName(name)
		exportNames[name] = _name.name
		return _name
	}
}




export function getPass2(export_info: EXPORT_INFO, js: JSFile): void {
	let statements: Statement[] = []
	let {exportNames, hasNamed, hasDefault} = export_info
if (!( hasNamed ||  hasDefault)){
	return
}
let leave = (node:Node,parent:Node)=>{
	if (
		parent.type ==="AssignmentExpression"
		&& parent.left === node
	){
		if (node.type === "MemberExpression"
			&& isModule_Dot_Exports(node)
		) {
			return js.getDefaultExport();
		}
		if (node.type === "MemberExpression"
			&& node.property.type === "Identifier") {
			if (testIsExport(node)) {
				return bestExportName(node, exportNames, js);
			}
		}
	}
}
replace(js.getAST(),{leave})

	let names:ExportAssignmentStatement[] =[]
	if (hasDefault) {

		let mde = module_dot_exports()
		let defaultExport = makeAnExportStatement(mde.object,mde.property,js.getDefaultExport())
		names.push(defaultExport)
	}
	  if (hasNamed) {
		names.push(...Object.keys(exportNames)
			.map(e=> [e, exportNames[e]])
			.map(es=> es
				.map(e=>id(e)))
			.map(e=> makeAnExportStatement(module_dot_exports(),e[0],e[1])))
	}



	//
	// let assignments: ExpressionStatement[] = Object.keys(exportNames)
	// 	.map((exportName: string) => [exportName, exportNames[exportName]])
	// 	.map(e => [id(e[0]), id(e[1])])
	// 	.map(e => assign(memberEx(js.getDefaultExport(), e[0]), e[1]))
	// 	.map(expression => {
	// 		return {type: "ExpressionStatement", expression}
	// 	})


	js.getAST().body.push(... names)


	// let leave = generateLeave()
	// return {
	// 	leave: (node: Node, parent: Node) => {
	//
	//
	// 		function generateNamed(ident: Identifier): MemberExpression | Identifier {
	// 			if ('default' in exportNames) {
	// 				return {
	// 					computed: false,
	// 					object: js.getNamespace().getDefaultExport(),
	// 					property: ident,
	// 					type: "MemberExpression"
	// 				}
	//
	// 			} else {
	// 				let _id: Identifier
	// 				if (!exportNames[ident.name]) {
	// 					let _id = js.getNamespace().generateBestName(ident.name)
	// 					_id = js.getNamespace().generateBestName('_' + ident.name)
	// 					exportNames[ident.name] = _id.name
	// 					return _id;
	// 				} else {
	// 					return id(exportNames[ident.name])
	// 				}
	//
	// 			}
	// 		}
	//
	// 		if (node.type === "MemberExpression"
	// 			&& node.property.type === "Identifier"
	// 		) {
	// 			switch (node.object.type) {
	// 				case "Identifier":
	// 					if (node.object.name === "exports") {
	// 						return generateNamed(node.property);
	// 					} else if (
	// 						node.object.name === "module"
	// 						&& node.property.name === "exports"
	// 					) {
	// 						if (parent.type !== "MemberExpression") {
	// 							return js.getNamespace().getDefaultExport()
	// 						}
	// 					}
	// 					break;
	// 				case "MemberExpression":
	//
	// 					if (isModule_Dot_Exports(node.object)) {
	// 						return generateNamed(node.property);
	// 					}
	// 					break;
	// 			}
	// 		}
	// 	}
	// };
}
