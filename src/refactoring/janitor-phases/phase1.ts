import {traverse} from "estraverse";
import {Identifier, ExpressionStatement, Node, Property, SpreadElement, Expression, VariableDeclarator} from "estree";
import {JSFile} from "../../filesystem/JSFile";
import {Body_Type} from "../../transformations/sanitizing/visitors/Object_Decons";
import {declare, exportsDot, module_dot_exports} from "../../utility/factories";
import {isARequire} from "../../utility/predicates";
import {asRequire, RequireCall} from "../../utility/Require";

export function phase1(js: JSFile): void {
	let seenIds: { [key: string]: () => Identifier } = {}

	traverse(js.getAST(), {
		leave
	})

	function leave(node: Node, parent: Node) {

		if (isARequire(node)) {
			let rs = (node as RequireCall).arguments[0].value.toString();
			(node as RequireCall).arguments[0].value = js.getRST().getTransformed(rs);
		}

		flattenDirectAssignOfObjectLiteralToModuleDotExports(node, parent)
		flattenRequireObjectDeconstructions2(node, parent)
		if (node.type === "MemberExpression" && node.object.type === "Identifier" && node.object.name === "exports") {
			node.object = module_dot_exports()
		}

		function flattenDirectAssignOfObjectLiteralToModuleDotExports(node: Node, parent: Node) {

			if (
				node.type === "ExpressionStatement"
				&& node.expression.type === "AssignmentExpression"
				&& node.expression.left.type === "MemberExpression"
				&& (parent.type === "Program" || parent.type === "BlockStatement")
			) {
				let exps: Body_Type[] = []
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
						exps.splice(0, 0, {
							type: "ExpressionStatement",
							expression: {
								type: "AssignmentExpression",
								operator: "=",
								left: module_dot_exports(),
								right: {type: 'ObjectExpression', properties: []}
							}
						})
						parent.body.splice(parent.body.indexOf(node), 1, ... exps)
					}
				}
			}


		}

		function flattenRequireObjectDeconstructions2(node: Node, parent: Node) {


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

}