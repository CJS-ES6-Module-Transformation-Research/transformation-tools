// export  function flattenDirectAssignOfObjectLiteralToModuleDotExports() {
// 	return {
// 		leave: function (node: Node, parent: Node):
// 			void {
// 			if (
// 				node.type === "ExpressionStatement"
// 				&& node.expression.type === "AssignmentExpression"
// 				&& node.expression.left.type === "MemberExpression"
// 				&& (parent.type === "Program" || parent.type === "BlockStatement")
// 			) {
// 				let exps: (Statement | ModuleDeclaration | Directive)[] = []
// 				if (node.expression.left.object.type === "Identifier"
// 					&& node.expression.left.property.type === "Identifier"
// 					&& node.expression.left.object.name === "module"
// 					&& node.expression.left.property.name === "exports"
// 					&& parent.type === "Program" || parent.type === "BlockStatement") {
//
// 					if (node.expression.right.type === "ObjectExpression"
// 					&& node.expression.right.properties.length > 0
// 					) {
// 						node.expression.right.properties.forEach((e: Property | SpreadElement) => {
// 							if (e.type !== "Property") {
// 								throw new Error()
// 							}
//
//
// 							exps.push({
// 								type: "ExpressionStatement",
// 								expression: {
// 									type: "AssignmentExpression",
// 									operator: "=",
// 									left: exportsDot((e.key as Identifier).name),
// 									right: e.value as Expression
// 								}
// 							})
//
// 						})
// 						parent.body.splice(parent.body.indexOf(node), 1, ... exps)
// 					}
// 				}
// 			}
// 		}
// 	}
// }
