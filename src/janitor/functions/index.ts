import {Node} from "estree";
import {isModule_Dot_Exports} from "../../utility/predicates";
import {EXPORT_INFO} from "../../utility/types";

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





