import {replace, VisitorOption} from "estraverse";
import {CallExpression, Identifier, Node, Statement, VariableDeclaration} from "estree";
import {JSFile} from "../../filesystem/JSFile";
import {declare, id} from "../../utility/factories";
import {isARequire} from "../../utility/predicates";
import {asRequire, RequireCall} from "../../utility/Require";
import { NodeComparators } from "../../utility/static-analysis/tagger";

export function hoistRequires(js: JSFile) {
	let ids: { [key: string]: string } = {}
	let toAdd: Statement[] = [];
	let variableRenameMapping: Array<{ old: string, new: string, scope: string }> = [];
	replace(js.getAST(), {
		enter: (node: Node, parent: Node) => {

			if (node.type === "VariableDeclaration"
				&& node.declarations.length === 1
				&& node.declarations[0].init
				&& node.declarations[0].id.type === "Identifier"
				&& isARequire(node.declarations[0].init)
			) {
				if (parent.type === "Program") {
					if(toAdd.filter((el) => JSON.stringify(el) === JSON.stringify(node)).length === 0) {
						toAdd.push(node);
					}

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
						let id2_ = clean
						id2 = js.getNamespace().generateBestName(id2_)
						ids[rs] = id2.name
					} else {
						let id2_ = ids[rs]
						id2 = id(id2_)
					}
					variableRenameMapping.push({old: node.declarations[0].id.name, new: id2.name, scope: node[NodeComparators.Scope_ID]});
					const declarationNode = declaration(id2, $);
					if(toAdd.filter((el) => JSON.stringify(el) === JSON.stringify(declarationNode)).length === 0) {
						toAdd.push(declarationNode);
					}
					
					return VisitorOption.Remove; 
				}


			} else {
				// @ts-ignore
				if (node.type === "CallExpression" && isARequire(node) && !node.topLevel) {
					let $ = asRequire(node)
					let id2: Identifier
					let clean = $.getCleaned()

					let rs = $.getRS()
					if (!ids[$.getRS()]) {
						ids[$.getRS()] = clean
					}
					id2 = js.getNamespace().generateBestName(ids[rs])
					variableRenameMapping.push({old: ids[rs], new: id2.name, scope: node[NodeComparators.Scope_ID]});
					toAdd.push(declaration(id2, $))
					if (parent.type === "ExpressionStatement"
						&& node == parent.expression) {
						// return VisitorOption.Remove
						parent.expression = null;
					} else {
						return id2
					}
				}
			}

		}, leave: (node: Node, parent: Node) => {
			if (node && node.type === "ExpressionStatement" && node.expression === null) {
				return VisitorOption.Remove
			}
			if(node.type === "Identifier") {
				const match = variableRenameMapping.find((el) => el.old === node.name && node[NodeComparators.Scope_ID] >= el.scope);
				if(match) {
					node.name = match.new;
					return node;
				}
			}
		}

	})

	return toAdd
	function declaration($id: string | Identifier, requireCallString: string | RequireCall) {
		let _id = typeof $id == "string" ? $id : $id.name

		let declaration: VariableDeclaration = {
			kind: "var",
			type: "VariableDeclaration", declarations: []
		}
		if (typeof requireCallString == "string") {
			let callex: CallExpression = {
				type: "CallExpression",
				arguments: [{type: "Literal", value: requireCallString}],
				callee: id('require')
			}
			declaration.declarations.push(declare(_id, callex))

		} else {
			declaration.declarations.push(declare(_id, requireCallString))

		}
		return declaration
	}

}



