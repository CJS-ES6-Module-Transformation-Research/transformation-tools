import {generate} from "escodegen";
import {Program} from "esprima";
import {replace, Visitor} from "estraverse";
import {
	AssignmentExpression,
	AssignmentProperty,
	BlockStatement,
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
import {id} from "../abstract_fs_v2/interfaces";
import {JSFile} from "../abstract_fs_v2/JSv2";
import {JanitorData} from "./data_management/DataController";
import {JanitorRequireData} from "./data_management/RequireStringData";
import {
	cleanMS,
	cleanRequires,
	declare,
	EXPORT_INFO,
	exportsDot,
	isARequire,
	isModule_Dot_Exports, requireCleanAndHoist
} from "./utilities/helpers";
import {
	gatherExportInfo,
	flattenRequireObjectDeconstructions,
	flattenVariableDeclarations,
	flattenDirectAssignOfObjectLiteralToModuleDotExports,
	getPass2
} from './functions'
import {asRequire} from "./utilities/Require";
// import {flattenObjectPattern} from "./subvisitors/ObjDeconstFlatten";

// import { flattenObjectPattern, getToFlatten} from "./subvisitors/flattening";

export interface requireData {raw:string, clean:string, id:string}
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



/**.
 * TransformFunction that does Variable Declaration Declarator flattening.
 * @param js the JSFile to transform.
 */
export default function main(js: JSFile) {
	let dc: JanitorData = new JanitorData(js)
let rd : {[raw:string]: requireData } = {};
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
			flattenDirectAssignOfObjectLiteralToModuleDotExports(node, parent);
		}
	}
	replace(js.getAST(), pass0);
	requireCleanAndHoist(js,rd )
	replace(js.getAST(), {enter: flattenVariableDeclarations})


	js.rebuildNamespace(js.getNamespace().getDefaultExport())
	let declarators = Object.keys(exportNames)
		.filter((str: string) => str !== 'default')
		.map(e => declare(exportNames[e]))

	let exportCopies: VariableDeclaration = {
		kind: "var",
		declarations: declarators,
		type: "VariableDeclaration"
	}

	//FIXME this is where the var a,b,c is added for exports... move it! `
	if (exportCopies.declarations.length > 0) {
		js.getAST().body.splice(0, 0, exportCopies)
	}

	// replace(js.getAST(), {
	// 	leave: (node: Node, parent: Node) => {
	//
	// 		if (node) {
	// 			return node
	// 		}//fixme remove this
	// 		let _export = '';
	// 		if (node.type === "MemberExpression"
	// 			&& node.property.type === "Identifier") {
	//
	// 			if (isModule_Dot_Exports(node)) {
	// 				if (parent.type === "AssignmentExpression") {
	// 					if (node == parent.left) {
	// 						//default
	// 					} else if (node == parent.right && parent.left.type === "Identifier") {
	// 						potential_aliases.push(parent.left.name)
	// 					}
	// 				} else if (parent.type === "VariableDeclarator"
	// 					&& parent.init === node
	// 					&& parent.id.type === "Identifier"
	// 				) {
	// 					//is a read
	// 					potential_aliases.push(parent.id.name)
	// 				}
	// 				defaultCount++
	// 				hasDefault = true
	// 				return js.getDefaultExport()
	// 			} else if (isModule_Dot_Exports((node.object))
	// 				|| (node.object.type === "Identifier"
	// 					&& node.object.name === "exports")
	// 			) {
	// 				if (!exportNames[node.property.name]) {
	// 					hasNamed = true
	// 					let identifier = js
	// 						.getNamespace()
	// 						.generateBestName(`_${node.property.name}`)
	// 					exportNames[node.property.name] = identifier.name
	//
	// 					return identifier
	// 				} else {
	// 					return id(exportNames[node.property.name])
	// 				}
	//
	//
	// 				//  node.property.name
	// 			} else {
	// 				///NIL
	// 			}
	//
	//
	// 			if (_export) {
	// 				switch (_export) {
	// 					case "default":
	//
	// 						break;
	// 					default:
	// 						break;
	// 				}
	// 			}
	// 		}
	// 	}
	//
	// })
	// let listofexports: Statement[]
		// =
		// Object.keys(exportNames).map(e => [e, exportNames[e]]).map(e => {
		// 	return {
		// 		type: "ExpressionStatement",
		// 		expression: {
		// 			type: "AssignmentExpression",
		// 			left: {
		// 				type: "MemberExpression",
		// 				computed: false,
		// 				object: js.getNamespace().getDefaultExport(),
		// 				property: id(e[0])
		// 			},
		// 			right: id(e[1]),
		// 			operator: '='
		// 		}
		// 	}
		// })
	// js.getAST().body.push(... listofexports)

}




