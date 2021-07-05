import {Directive, Expression, Identifier, ModuleDeclaration, Node, Property, SpreadElement, Statement} from "estree";
import {JSFileImpl} from "../../../abstract_fs_v2/JSv2";
import {exportsDot, module_dot_exports} from "../../utilities/helpers";

export default (js:JSFileImpl)=> function flattenObjectAssignmentExport (node: Node, parent: Node) {

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
				exps.splice(0,0,{
					type: "ExpressionStatement",
					expression: {
						type: "AssignmentExpression",
						operator: "=",
						left: module_dot_exports(),
						right: {type:'ObjectExpression',properties:[]}
					}
				})
				parent.body.splice(parent.body.indexOf(node), 1, ... exps)
			}
		}
	}


}
