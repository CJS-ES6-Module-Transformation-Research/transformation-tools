import {traverse} from "estraverse";
import {ExpressionStatement, Identifier, Node, VariableDeclaration} from "estree";
import {id} from "../../abstract_fs_v2/interfaces";
import {JSFileImpl} from "../../abstract_fs_v2/JSv2";
import {isModule_Dot_Exports, module_dot_exports,asModuleDotExports, declare} from "../utilities/helpers";

export function exportAndCopyPhase(js: JSFileImpl): void {


	function cleanExports(js: JSFileImpl) {
		js.rebuildNamespace(js.getDefaultExport())
		let exportData: { [id: string]: string } = {}
		let hasDefautl = false
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
						// let list: Statement[] = []
						let identifier: Identifier
						switch (data.type) {
							case "name":
								if (!exportData[data.Export]) {

									let copy = js.getNamespace().generateBestName(data.Export)
									identifier = copy
									exportData[data.Export] = copy.name
								} else {
									identifier = id(exportData[data.Export])
								}
								break;
							case "default":
								hasDefautl = true;
								identifier = js.getDefaultExport()

								break;

						}
						node.expression.left = identifier

						if (!toDefineList.includes(identifier.name)) {
							toDefineList.push(identifier.name)
						}

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
		if (dcls.length > 0) {
			js.getAST().body.splice(0, 0, dcl)
		}
		if (hasDefautl) {
			js.getAST().body.push(assignExport(js.getDefaultExport().name))
		}
		js.getAST().body.push(... Object.keys(exportData)
			.map(
				e => assignExport(e, exportData[e]))
		)
		function assignExport(e1: string, e2: string = ''): ExpressionStatement {
			return {
				type: "ExpressionStatement",
				expression: {
					type: "AssignmentExpression", operator: '=',
					left: e2 === '' ? module_dot_exports() : {
						type: "MemberExpression",
						object: module_dot_exports(),
						property: id(e1),
						computed: false
					},
					right: id(e2 === '' ? e1 : e2)
				}
			}
		}

	}


}
