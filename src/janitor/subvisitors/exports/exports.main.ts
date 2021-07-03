import {replace} from "estraverse";
import {Identifier, MemberExpression, Node} from "estree";
import {id} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {EXPORT_INFO, isModule_Dot_Exports, makeAnExportStatement, module_dot_exports} from "../../utilities/helpers";
import {ExportAssignmentStatement} from "../../utilities/JanitorTypes";

export function exportCopyAndDeclare (export_info: EXPORT_INFO, js: JSFile): void {
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

	let exportAssignments:ExportAssignmentStatement[] =[]
	if (hasDefault) {

		let mde = module_dot_exports()
		let defaultExport = makeAnExportStatement(mde.object,mde.property,js.getDefaultExport())
		exportAssignments.push(defaultExport)
	}
	if (hasNamed) {
		exportAssignments.push(...Object.keys(exportNames)
			.map(e=> [e, exportNames[e]])
			.map(es=> es
				.map(e=>id(e)))
			.map(e=> makeAnExportStatement(module_dot_exports(),e[0],e[1])))
	}


	js.getAST().body.push(... exportAssignments)


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
