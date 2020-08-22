import {replace} from "estraverse";
import {
	Identifier,
	ImportDeclaration,
	ImportDefaultSpecifier, ImportSpecifier,
	MemberExpression, SimpleLiteral,
	VariableDeclaration,
	VariableDeclarator
} from "estree";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {Imports} from "../../../InfoTracker";


export let hacker_defaults = (js: JSFile) => {
	if (js.usesNamed()){
		return ;
	}
	let ns = js.getNamespace()
	let replace_identifiers: Identifier[] = []
	let getRPI = (x: string) => js.getInfoTracker().getRPI(x)

	let idSet: { [base: string]: { [prop: string]: Identifier } } = {}
	let infoTracker = js.getInfoTracker()
	infoTracker
		.getMaybePrims()
		.map(e => {
			if (getRPI(e.modId).forceDefault) {
				return null;
			}
			let best = ns.generateBestName(e.propName)
			if (!idSet[e.modId]) {
				idSet[e.modId] = {}
			}
			if (!idSet[e.modId][e.propName]) {
				idSet[e.modId][e.propName] = best
			}
			ns.addToNamespace(best.name)
			replace_identifiers.push(best)
			let declaration = createAccessedDeclFromBest(e, best);
			return declaration
		})
		.filter(e => e !== null)
		.forEach((value: VariableDeclaration) => {
			js.insertCopyByValue(value);
		});



	replace(js.getAST(), {
		leave: ((node, parent) => {

			if (node.type === "MemberExpression"
				&& node.object.type === "Identifier"
				&& node.property.type === "Identifier"
			) {
				if (parent
					&& idSet[node.object.name]
					&& idSet[node.object.name][node.property.name]
					&& parent.type === "AssignmentExpression"
					&& (parent.left === node)) {
					return node
				}
				if (idSet[node.object.name]
					&& idSet[node.object.name][node.property.name]) {
					return idSet[node.object.name][node.property.name]
				}
			}
		})
	});
 }
export function named_copyByValue(js:JSFile) {

 	// let idfl : ImportDefaultSpecifier={}
	// let idfl : ImportSpecifier={}
	// let idfl : ImportDeclaration={}

	// let nameds = (js
	// 	.getDImports()
	// 	.getDeclarations()
	// 	.filter(
	// 		(e)=> {
	// 			return e.specifiers.length > 0 && e.specifiers[0].type === "ImportSpecifier"
	// 		}))
	// let infoTracker = js.getInfoTracker()
	// let demap = infoTracker.getDeMap()
		// .fromSpec[]getRPI.potentialPrimProps.includes(imported)
	// let _test= (spec:string )=>{
	// 	let id = demap.fromSpec[spec]
	// 	return  (prop:string)=>{
	// 		return infoTracker.getRPI(id).potentialPrimProps.includes(prop)
	//
	// 	}
 	// }
	// nameds.forEach((dcl,index,arr)=>{
	// 	let test = _test((dcl.source as SimpleLiteral).value.toString())
	// 	let spec = (dcl.source as SimpleLiteral).value.toString()
	// 	let _e
	// 	try {
	// 		dcl.specifiers.forEach(e => {
	// 			_e = e
	// 			if (e.type === "ImportSpecifier") {
	// 				let imported = e.imported.name
	// 				let old_local = e.local
	// 				let _tst = infoTracker
	// 					.getRPI(demap.fromSpec[spec])
	// 					.potentialPrimProps
	// 					.includes(imported)
	// 				if (_tst) {
	// 					let rhsOfCopy = js.getNamespace().generateBestName(old_local.name)
	// 					js.insertCopyByValue(createAliasedDeclarator(rhsOfCopy, old_local))
	// 					e.local = rhsOfCopy
	// 				}
	// 			}
	// 		}
	// 	 );}catch (e) {
	// 		console.log(spec)
	// 		console.log(_e)
	// 	}
	// });
}

function createAccessedDeclFromBest(e: { modId: string; propName: string }, best: Identifier) {
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

function createAliasedDeclarator(copy:Identifier, original:Identifier):VariableDeclaration{
	let declarator: VariableDeclarator = {
		type: "VariableDeclarator",
		id: original,
		init: copy
	}
	let declaration: VariableDeclaration = {
		type: "VariableDeclaration",
		kind: 'var',
		declarations: [declarator]
	}
	return declaration
}

