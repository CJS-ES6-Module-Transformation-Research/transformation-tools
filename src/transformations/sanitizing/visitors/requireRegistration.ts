import {replace, Visitor, VisitorOption} from "estraverse";
import {CallExpression, VariableDeclaration, VariableDeclarator} from "estree";
import {RequireCall, RequireDeclaration, RequireExpression} from '../../../abstract_fs_v2/interfaces'
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {InfoTracker} from "../../../InfoTracker";

export const requireRegistration = (js: JSFile) => {
	let ast = js.getAST()
	let list = []
	let requireMgr: InfoTracker = js.getInfoTracker()

	let visitor: Visitor = {
		leave: (node, parent) => {
 			let init: VariableDeclarator | CallExpression
			if (!(parent && parent.type === "Program")) {
				return
			} else {
				if (node.type === "VariableDeclaration"
					&& node.declarations
					&& node.declarations.length === 1
					&& node.declarations[0]
					&& node.declarations[0].init
					&& node.declarations[0].id.type === "Identifier"
				) {
					init = node.declarations[0];
				} else if (node.type === "ExpressionStatement"
					&& node.expression.type === "CallExpression") {
					init = node.expression;
				}
			}
			if (!init){return }
			let reqCall: RequireCall = getRequireCall(init)
			if (!reqCall){
				return ;
			}
			let declaration: RequireDeclaration

			if (
				init
				&& init.type === "VariableDeclarator"
				&& init.id.type === "Identifier"
			) {

				declaration = {
					declarations: [{
						type: "VariableDeclarator",
						id: init.id,
						init: reqCall
					}],
					kind: (node as VariableDeclaration).kind,
					type:
						"VariableDeclaration"
				};


			}

			if (declaration && reqCall) {
				requireMgr.insertRequireImport(declaration)
			} else if (reqCall) {
				requireMgr.insertRequireImport({
					type: "ExpressionStatement",
					expression: reqCall
				});
			}  else {
				//should be redundant
			}
			return VisitorOption.Remove

			//
			// if (parent
			// 	&& node.type === "VariableDeclaration" && parent.type === "Program") {
			// 	if (node.declarations
			// 		&& node.declarations[0]
			// 		&& node.declarations[0].type === "VariableDeclarator"
			// 		&& node.declarations[0]) {
			// 		let declarator: VariableDeclarator = node.declarations[0]
			// 		let init = declarator.init
			// 		if (declarator.id.type === "Identifier"
			// 			&& init
			// 			&& init.type === "CallExpression"
			// 			&& init.callee.type === "Identifier"
			// 			&& init.callee.name === "require"
			// 			&& init.arguments
			// 			&& init.arguments[0]
			// 			&& init.arguments[0].type === "Literal"
			//
			// 		) {
			// 			let require_string = init.arguments[0].value.toString()
			// 			list.push(require_string)
			// 			requireMgr.insertImportPair(declarator.id.name, require_string)
			//
			//
			// 			// return VisitorOption.Remove
			// 		}
			// 	}
			// } else if (
	 		// 	parent
			// 	&& parent.type === "Program"
			// 	&& node.type === "ExpressionStatement"
			// 	&& node.expression.type === "CallExpression"
			// 	&& node.expression.callee.type === "Identifier"
			// 	&& node.expression.callee.name === "require"
			// 	&& node.expression.arguments
			// 	&& node.expression.arguments[0]
			// 	&& node.expression.arguments[0].type === "Literal"
			// ) {
			// 	let require_string = init.arguments[0].value.toString()
			// 	list.push(require_string)
			// 	requireMgr.insertImportPair(null, require_string)
			//
			// }
		}
	}

	replace(ast, visitor)

	function getRequireCall(data: VariableDeclarator | CallExpression): RequireCall {
		let callex
		if (data.type === "VariableDeclarator"
			&& data.init.type === "CallExpression"
		) {
			callex = data.init
		} else {
			callex = data as CallExpression;
		}
		if (callex
			&& callex.callee
			&& callex.callee.type === "Identifier"
			&& callex.callee.name === "require"
			&& callex.arguments
			&& callex.arguments[0]
			&& callex.arguments[0].type === "Literal") {
			return callex
		}
	}


}
