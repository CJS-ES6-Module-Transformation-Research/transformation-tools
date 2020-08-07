import {replace} from "estraverse";
import {Identifier, MemberExpression, VariableDeclaration, VariableDeclarator} from "estree";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
// test_resources.import {IdAndMemex} from "../../../InfoTracker.js";


export let hacker_defaults = (js: JSFile) => {

	let ns = js.getNamespace()
	let replace_identifiers: Identifier[] = []

	let idSet: { [base: string]: { [prop: string]: Identifier } } = {}
	let infoTracker = js.getInfoTracker()
	infoTracker
		.getMaybePrims()
		.map(e => {
			let best = ns.generateBestName(e.propName)
			if (!idSet[e.modId]) {
				idSet[e.modId] = {}
			}
			if (!idSet[e.modId][e.propName]) {
				idSet[e.modId][e.propName] = best
			}
			ns.addToNamespace(best.name)
			replace_identifiers.push(best)
			let declaration = createDeclFromBest(e, best);
			return declaration
		}).forEach((value: VariableDeclaration) => {
		js.insertCopyByValue(value);
	});


	let ast = js.getAST();
	replace(ast, {
		leave: ((node, parent) => {

			if (parent
				// && parent.type === "AssignmentExpression"
				&& node.type === "MemberExpression"
				&& node.object.type === "Identifier"
				&& node.property.type === "Identifier") {

				if (idSet[node.object.name]
					&& idSet[node.object.name][node.property.name]) {
					return idSet[node.object.name][node.property.name]
				}
			}
		})
	});
	// js.setPotentialPrims(hacker.create())
}


function createDeclFromBest(e: { modId: string; propName: string }, best: Identifier) {
	let base: Identifier = {type: "Identifier", name: e.modId}
	let prop: Identifier = {type: "Identifier", name: e.propName}
	let memex: MemberExpression = {type: "MemberExpression", computed: false, object: base, property: prop}
	let declarator: VariableDeclarator = {
		type: "VariableDeclarator",
		id: best,
		init: memex
	}
	let declaration: VariableDeclaration = {
		type: "VariableDeclaration",
		kind: 'var',
		declarations: [declarator]
	}
	return declaration;
}

// interface hackPair {
// 	id: Identifier
// 	hack_value: Identifier | MemberExpression
// }
//
// class Hacker {
// 	private hacks: hackPair[] = []
//
// 	addIdentifierValuePair(id: Identifier, hackedValue: Identifier | MemberExpression) {
// 		console.log(`${id.name} -> ${generate(hackedValue)}  `)
// 		this.hacks.push({id: id, hack_value: hackedValue})
// 	}
//
// 	create(): VariableDeclaration[] {
// 		let arr: VariableDeclaration[] = []
// 		this.hacks.forEach(e => {
// 				let dcl: VariableDeclarator = {
// 					type: "VariableDeclarator",
// 					id: e.id,
// 					init: e.hack_value
// 				}
// 				let declaration: VariableDeclaration = {
// 					type: "VariableDeclaration",
// 					kind: "var",
// 					declarations: [dcl]
// 				}
// 				arr.push(declaration);
// 			}
// 		);
// 		return arr;
// 	};
// }


