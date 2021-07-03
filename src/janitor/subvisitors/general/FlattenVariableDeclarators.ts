// export function flattenVariableDeclarations(node: Node, parent: Node,): void {
// 	if (node.type === 'VariableDeclaration'
// 		&& node.declarations.length > 1) {
// 		// flattenDeclarations(node, parent);
// 		let {kind: _kind, type: _type} = node;
// 		let flattened: (Statement | VariableDeclaration)[] = node.declarations.map(
// 			(dclr: VariableDeclarator) => {
// 				return {
// 					kind: _kind,
// 					type: _type,
// 					declarations: [dclr]
// 				}
// 			})
// 		if ("Program" === parent.type || parent.type === "BlockStatement") {
// 			// insert back into body array
// 			let indexOf = parent.body.indexOf(node);
//
// 			// flattened.reverse().forEach((e) => {
// 			// 		parent.body.splice(indexOf, 0, e)
// 			// 	}
// 			// )
// 			indexOf = parent.body.indexOf(node);
// 			parent.body.splice(indexOf, 1, ... (flattened.reverse()))
// 		} else if ("ForStatement") {
// 			return;
// 		} else {
// 			throw new Error("don't know why it got here ")
// 		}
// 	}
//
// 	function getToFlatten(vdcln: VariableDeclaration): (Statement | VariableDeclaration)[] {
// 		let flattened: (Statement | VariableDeclaration)[] = []
//
// 		vdcln.declarations.forEach((decl: VariableDeclarator) => {
// 			//add declarator to be flattened.
// 			let ls: VariableDeclarator[] = []
// 			ls.push(decl)
// 			// if (decl.init && isARequire(decl.init)
// 			// ) {
// 			// }
// 			let flat: VariableDeclaration = {
// 				kind: vdcln.kind,
// 				type: vdcln.type,
// 				declarations: ls
// 			}
//
// 			//add to flatten decl list.
// 			flattened.push(flat)
// 		});
// 		return flattened
// 	}
// }
