import {replace, VisitorOption} from "estraverse";
import {CallExpression, Identifier, Node, Statement, VariableDeclaration} from "estree";
import {id} from "../../abstract_fs_v2/interfaces";
import {JSFileImpl} from "../../abstract_fs_v2/JSv2";

import {declare, isARequire} from "../utilities/helpers";
import {asRequire, RequireCall} from "../utilities/Require";


export function hoistRequires(js: JSFileImpl) {
	let ids: { [key: string]: string } = {}
	let toAdd: Statement[] = []
	replace(js.getAST(), {
		enter: (node: Node, parent: Node) => {


			if (node.type === "VariableDeclaration"
				&& node.declarations.length === 1
				&& node.declarations[0].init
				&& node.declarations[0].id.type === "Identifier"
				&& isARequire(node.declarations[0].init)
			) {
				if (parent.type === "Program") {
					toAdd.push(node)

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
					toAdd.push(declaration(id2, $))
					node.declarations[0].init = id(id2.name)
					return (<VariableDeclaration>{
						type: "VariableDeclaration",
						kind: node.kind,
						declarations: [
							{type: "VariableDeclarator", id: node.declarations[0].id, init: id2}
						]
					})
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



