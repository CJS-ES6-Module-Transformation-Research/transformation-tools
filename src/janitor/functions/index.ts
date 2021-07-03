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





