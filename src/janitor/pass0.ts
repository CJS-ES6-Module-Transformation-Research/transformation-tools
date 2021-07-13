import {Directive, Identifier, MemberExpression, ModuleDeclaration, Node, Statement} from "estree";
// import {flattenDirectAssignOfObjectLiteralToModuleDotExports} from "./subvisitors/exports/FlattenExportObjectAssignment";
// import {flattenVariableDeclarations} from "./subvisitors/general/FlattenVariableDeclarators";
// import {
// 	flattenRequireObjectDeconstructions,
// 	flattenRequireObjectDeconstructions2
// } from "./subvisitors/require/FlattenObjectDeconstructions";
// import {flattenObjectPattern} from "./subvisitors/ObjDeconstFlatten";

// import { flattenObjectPattern, getToFlatten} from "./subvisitors/flattening";

export interface requireData {
	raw: string,
	clean: string,
	id: string
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
/*
 function janitor(js: JSFile) {
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
	traverse(js.getAST(), {leave: flattenVariableDeclarations});
	js.rebuildNamespace(js.getDefaultExport())
	cleanExports()


	hoistRequires()

	function cleanExports() {
		let exportData: { [id: string]: string } = {}

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
						let list: Statement[] = []
						let identifier: Identifier
						switch (data.type) {
							case "name":
								let copy = js.getNamespace().generateBestName(data.Export)
								identifier = copy

								break;
							case "default":
								identifier = js.getDefaultExport()

								break;

						}
						list.push({
							declarations: [declare(identifier.name, node.expression.right)],
							type: "VariableDeclaration",
							kind: "var"
						})
						if (!toDefineList.includes(identifier.name)) {
							toDefineList.push(identifier.name)
						}
						node.expression.right = identifier
						list.push(node)
						let indexOf = parent.body.indexOf(node)
						parent.body.splice(indexOf, 1, ... list)
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
		if(dcls.length>0){
			js.getAST().body.splice(0, 0, dcl)
		}
	}

	function hoistRequires() {
		let ids: { [key: string]: string } = {}
		let toAdd: Statement[] = []
		replace(js.getAST(), {
			leave: (node: Node, parent: Node) => {
				if (node.type === "VariableDeclaration"
					&& node.declarations.length === 1
					&& node.declarations[0].init
					&& node.declarations[0].id.type === "Identifier"
					&& isARequire(node.declarations[0].init)
				) {
					console.log('INIT : ' + node.declarations[0].init)

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
							id2 =js.getNamespace().generateBestName(  ids[rs])
 							ids[rs] =id2.name
						} else{
							id2 = id(id[rs])
						}
						toAdd.push(declaration(id2, $))
						node.declarations[0].init = id2
					}


				} else if (node.type === "CallExpression" && isARequire(node)) {
					let $ = asRequire(node)
					let id2: Identifier
					console.log(`CALLEX: ${(node.arguments[0] as Literal).value.toString()}`)
					let clean = $.getCleaned()

					let rs = $.getRS()
					if (!ids[$.getRS()]) {
						ids[$.getRS()] =clean
					}
					id2 =js.getNamespace().generateBestName(  ids[rs])
					toAdd.push(declaration(id2, $))
					return id2
				}

			}
		})
	}
}
function declaration($id:string | Identifier, requireCallString:string| RequireCall){
	let _id = typeof $id =="string" ? $id: $id.name
	let declaration:VariableDeclaration={kind:"var",type:"VariableDeclaration",declarations:[]}
	 if( typeof requireCallString =="string"){
	 	let callex :CallExpression={type:"CallExpression",arguments:[{type:"Literal",value:requireCallString}],callee:id('require')}
	 	declaration.declarations.push(declare(_id, callex ))

	 }else{
		 declaration.declarations.push(declare(_id, requireCallString ))

	 }
	 return declaration
}*/
// export function asModuleDotExports(mx: MemberExpression): { Export: string, type: 'name' | 'default' } {
// 	if (mx.property.type === "Identifier") {
// 		if (mx.object.type === "Identifier"
// 			&& mx.object.name === "module"
// 			&& mx.property.name === "exports"
// 		) {
// 			return {Export: '', type: 'default'}
// 		} else if (isModule_Dot_Exports(mx.object)) {
// 			return {Export: mx.property.name, type: 'name'}
// 		}
// 	}
// 	return null
// }

interface _Module extends Identifier {
	name: 'module'
}

interface _Exports extends Identifier {
	name: 'exports'
}

interface ExportOnExports extends MemberExpression {
	object: ModuleDotExports,
	property: Identifier,
	computed: false,
	type: "MemberExpression"
}

interface ModuleDotExports extends MemberExpression {
	object: _Module,
	property: _Exports,
	computed: false,
	type: "MemberExpression"
}

interface UtilityExport {

}

/**.
 * TransformFunction that does Variable Declaration Declarator flattening.
 * @param js the JSFile to transform.
 */
/*
export default function main(js: JSFile) {
	let dc: JanitorData = new JanitorData(js)
	let rd: { [raw: string]: requireData } = {};
	let defaultCount = 0;

	let declareDefaultID = false;

	let modspecToID: { [key: string]: string } = {} //reqStrToIDMap
	let msList: { rs: string, ident: string }[] = []

	// function enter2(node: Node, parent: Node | null) {
	// 	// if (node.type === "ExpressionStatement" && (parent.type === "Program" || parent.type === "BlockStatement")) {
	// 	// 	exportspt1(node, parent, js, kvc ,modspecToID);
	// 	// }
	// }


	let hasDefault: boolean = false;
	let hasNamed: boolean = false;


	const exportNames: { [p: string]: string } = {}
	let potential_aliases: string[] = [];
	let export_info: EXPORT_INFO = {hasDefault: false, hasNamed: false, exportNames: exportNames}

	let pass0: Visitor = {
		enter: (node: Node, parent: Node) => {
			cleanRequires(node, parent, rd, dc.Requires, js)
			flattenRequireObjectDeconstructions(node, js, dc.Requires)

			gatherExportInfo(node, parent, export_info);
		},
		leave: (node: Node, parent: Node) => {
			// flattenDirectAssignOfObjectLiteralToModuleDotExports(node, parent);fixme maybe not
		}
	}
	replace(js.getAST(), pass0);
	replace(js.getAST(), {enter: flattenVariableDeclarations})
	let hoisted = requireCleanAndHoist(js, rd)//must be after flatten

	js.rebuildNamespace(js.getNamespace().getDefaultExport())
	exportCopyAndDeclare(export_info, js)
	let copyList: VariableDeclarator[] = Object.keys(exportNames)
		.filter((str: string) => str !== 'default')
		.map(e => declare(exportNames[e]))
	let declaredExports: VariableDeclaration = {
		kind: "var",
		declarations: copyList,
		type: "VariableDeclaration"
	}
	// copyList.forEach(d=>{
	// 	console.log (generate({
	// 		type:"VariableDeclaration",
	// 		kind:"var",
	// 		declarations: [d]
	// 	}))
	//
	// })
	console.log(generate(declaredExports))
	console.log("copylist dcelarators", JSON.stringify(copyList, null, 3))

	console.log(JSON.stringify(declaredExports, null, 3))
	// console.log(JSON.stringify(exportNames,null,3))
	// declaredExports.forEach(e=> console.log(generate(e)))
	if (declaredExports) {
		js.getAST().body.splice(0, 0, declaredExports)
	}
	if (hoisted) {
		js.getAST().body.splice(0, 0, ... hoisted)

	}
}*/




