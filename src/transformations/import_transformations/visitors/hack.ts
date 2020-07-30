import {generate} from "escodegen";
import {replace, VisitorOption} from "estraverse";
import {Identifier, MemberExpression, VariableDeclaration, VariableDeclarator} from "estree";
import {JSFile} from "../../../abstract_fs_v2/JSv2.js";
import {IdAndMemex} from "../../../RequireTracker.js";


export let hacker_defaults = (js: JSFile) => {

	let hacker: Hacker = new Hacker();
	let requireTracker = js.getRequireTracker()
	let prims = requireTracker.getMaybePrims()
	let import_manager = js.getImportManager()
	let value: IdAndMemex
	let importPropSets: { [key: string]: Set<String> } = {}
	console.log(js.getRelative())
	// console.log(prims)

	let idToMemex: { [key: string]: MemberExpression } = {}

	for (let prim in prims) {
		let pairs: IdAndMemex[] = prims[prim]
		pairs.forEach((pair: IdAndMemex) => {
			let obj: string = (pair.memex.object as Identifier).name
			let prop: string = (pair.memex.property as Identifier).name

			console.log(obj)
			console.log(prop)

			if (!importPropSets[obj]) {
				importPropSets[obj] = new Set<String>()
			}
			importPropSets[obj].add(prop);
		});
	}


	//
	// for (let p in prims) {
	// 	importPropSets[p] = new Set<String>();
	// 	console.log('p: ' + p)
	//
	//
	// 		prims[p].forEach(i_memex => {
	// 			importPropSets[i_memex.id.name] =  new Set()
	// 			importPropSets[i_memex.id.name] .add((i_memex.memex.property as Identifier).name)
	// 		})
	let flipped: { [key: string]: string } = {}
	for (let mod in importPropSets) {
		importPropSets[mod].forEach((prop: string) => {
			// console.log("fech")
			// console.log(id+"\t"+memex)
			let requireString = requireTracker.getFromVar(mod)

			hacker.addIdentifierValuePair({type: "Identifier", name: prop}, {
				type: "MemberExpression" ,
				object: {type: "Identifier", name: mod},
				property: {type: "Identifier", name: prop},
				computed: false
			})

		})

	}

	// }
	let ast = js.getAST();
	replace(ast, {
		leave: ((node, parent) => {
			if (node.type === "MemberExpression"
				&& node.object.type === "Identifier"
				&& node.property.type === "Identifier") {
				// let pm :IdAndMemex[]= prims[node.object.name]
				if (importPropSets[node.object.name] && importPropSets[node.object.name].has(node.property.name)) {
					if (parent){
						switch (parent.type) {
							case "AssignmentExpression":
								if(parent.left === node){
									break;
								}

								break;
							default:{
								return node.property
							}
						}


					}
				} else {
					//all good??
				}
			}
		})
	});
	js.setPotentialPrims(hacker.create())
}


interface hackPair {
	id: Identifier
	hack_value: Identifier | MemberExpression
}

class Hacker {
	private hacks: hackPair[] = []

	addIdentifierValuePair(id: Identifier, hackedValue: Identifier | MemberExpression) {
		console.log(`${id.name} -> ${generate(hackedValue)}  `)
		this.hacks.push({id: id, hack_value: hackedValue})
	}

	create(): VariableDeclaration[] {
		let arr: VariableDeclaration[] = []
		this.hacks.forEach(e => {
				let dcl: VariableDeclarator = {
					type: "VariableDeclarator",
					id: e.id,
					init: e.hack_value
				}
				let declaration: VariableDeclaration = {
					type: "VariableDeclaration",
					kind: "var",
					declarations: [dcl]
				}
				arr.push(declaration);
			}
		);
		return arr;
	};
}



