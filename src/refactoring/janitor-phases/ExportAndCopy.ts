import {traverse} from "estraverse";
import {
	AssignmentExpression, Expression,
	ExpressionStatement,
	Identifier,
	MemberExpression,
	Node, Pattern,
	VariableDeclaration
} from "estree";
import {JSFile} from "../../filesystem/JSFile";
import {id, module_dot_exports, asModuleDotExports, declare} from "../../utility/factories";
import {isModule_Dot_Exports} from "../../utility/predicates";


export function exportAndCopyPhase(js: JSFile): void {
	cleanExports(js)

	function cleanExports(js: JSFile) {
		let assignedIdentifiers: string[] = []
		js.rebuildNamespace(js.getDefaultExport())
		let exportData: { [id: string]: string } = {}
		let hasDefautl = false
		let toDefineList: string[] = []
		let body = js.getBody();
		let hasData = false;
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
						let expr: ExpressionStatement
						switch (data.type) {
							case "name":
								hasData = true;
								if (!exportData[data.Export]) {
									let copy = js.getNamespace().generateBestName(data.Export);
									identifier = copy
									exportData[data.Export] = copy.name
								} else {
									identifier = id(exportData[data.Export])
								}
								expr = assignExport(data.Export, identifier.name)
								assignedIdentifiers.push(data.Export)

								break;
							case "default":
								if (hasData) {
									//TODO Determine if/where/how for overwrite
									let  overWrite=  ()=> {
										function reassign(rest: MemberExpression[]) {
											let assigned:AssignmentExpression
											switch (rest.length) {
												case 0:
													//;perform check to see if function needs to be called before calling it
													throw new Error('no properties need to be unset: preform check before calling this');
												case 1:
													return assign(rest[0], undefined)
												case 2:
													return assign(rest[0],assign(rest[1],undefined))

											}
										}

										let initialValue: AssignmentExpression = {
											type: "AssignmentExpression",
											left: id('deleteme'),
											right: id(''),
											operator: '='
										}
										assignedIdentifiers.map(e => {
											return {
												type: "MemberExpression",
												object: module_dot_exports(),
												property: id(e),
												computed: false
											} as MemberExpression
										})
									}

									overWrite()//TODO
								}
								hasDefautl = true;
								identifier = js.getDefaultExport()
								expr = assignExport(identifier.name)
								break;

						}
						if (!parent) {
							throw new Error(' Null Parent Error (cannot refactor if parent is null!)');
						}
						parent.body.splice(parent.body.indexOf(node) + 1, 0, expr)


						let pbody = parent.body
						let indexOf = parent.body.indexOf(node)
						if (pbody.length - 1 == indexOf) {
							//use push TODO
						} else {
//FixME
						}
						node.expression.left = identifier

						if (!toDefineList.includes(identifier.name)) {
							toDefineList.push(identifier.name)
						}

					}
				}
			}
		})

		let dcls = <VariableDeclaration[]>toDefineList.map(e => {
			return {
				kind: "var",
				type: "VariableDeclaration",
				declarations: [declare(e, null)]
			}
		});

		body.splice(0, 0, ...dcls);

		function assign(left:Pattern, right:Expression):AssignmentExpression{
			return {
				type:"AssignmentExpression",
				operator:'=',
				left,
				right
			}

		}
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
