import {generate} from "escodegen";
import {replace, traverse, Visitor, VisitorOption} from "estraverse";
import * as ESTree from "estree";
import {
	Identifier,
	ImportDeclaration,
	ImportSpecifier,
	Literal,
	RegExpLiteral,
	SimpleLiteral,
	VariableDeclarator
} from "estree";
import {built_ins, builtins_funcs} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {getListOfVars, getOneOffForcedDefaults} from "../../../InfoGatherer";
import {Imports, InfoTracker, WithPropNames} from "../../../InfoTracker";
import {API, API_TYPE} from "../../export_transformations/API";

export function cleanMIS(moduleSpecifier: string): string {
	return moduleSpecifier.replace(/^\.{0,2}\//, '')
}


export function insertImports(js: JSFile) {
	// console.log(`calling insertImports on jsfile : ${js.getRelative()} `)

	let infoTracker = js.getInfoTracker();
	let listOfVars = getListOfVars(infoTracker)
	let MAM = js.getAPIMap()
	js.getAPIMap()
	let _imports: Imports = new Imports(js.getInfoTracker().getDeMap(), ((mspec: string) => MAM.resolveSpecifier(js, mspec)), MAM, js.getInfoTracker())
	js.setImports(_imports)
	let demap = infoTracker.getDeMap()
	let one_offs = getOneOffForcedDefaults(js.getAST(), listOfVars)
	let propNameReplaceMap: { [base: string]: { [property: string]: string } } = {}//replaceName
	let mod_map = js.getAPIMap()

	function computeType(js: JSFile, init: Identifier, moduleSpecifier: string) {

		let rpi = js.getInfoTracker().getRPI(init.name)
		try {
			let api = js.getAPIMap().resolveSpecifier(js, moduleSpecifier)

			if (api.getType() !== API_TYPE.named_only) {
				return false;
			}
		} catch (e) {
			console.log('failed on ' + js.getRelative() + "      " + moduleSpecifier)
		}
		return true;
	}


	//for readability in debugging
	traverse(js.getAST(), {
		enter: (node) => {
			delete node.loc
		}
	})
	let visitor: Visitor = {

		enter: (node, parent): VisitorOption | ESTree.Node | void => {


			if (parent && parent.type === "Program") {
				if (node.type === "VariableDeclaration") {
					if (
						node.declarations
						&& node.declarations
						&& node.declarations[0].id.type === "Identifier"
						&& node.declarations[0].init
						&& node.declarations[0].init.type === "CallExpression"
						&& node.declarations[0].init.callee.type === "Identifier"
						&& node.declarations[0].init.callee.name === "require"
						&& node.declarations[0].init.arguments
						&& node.declarations[0].init.arguments[0].type === "Literal"
					) {
						let isNamespace = computeType(js,  node.declarations[0].id, (node.declarations[0].init.arguments[0] as SimpleLiteral).value.toString())
						let _id = node.declarations[0].id.name
						let q = node.declarations[0].init
						let lit: Literal
						let args = q.arguments[0]
						try {
							// let clean = cleanModuleSpecifier(module_specifier)
							// if(api && api.getType() ===API_TYPE.named_only){
							// }


							if (args.type === "Literal" && (!((args as RegExpLiteral ).regex ) ) ) {
								lit = args
							}else{
								throw new Error(generate(args))
							}

						}catch
							(e)
							{
								console.log(js.getRelative())
								throw exports
							}


						let module_specifier = lit.value.toString()
						let wpn: WithPropNames = _imports.getWPN()
						let api = wpn.api[module_specifier];
						let info = js.getInfoTracker();
						let map = js.getAPIMap()
						let isBuiltin = (built_ins.includes(module_specifier)
							&& (!builtins_funcs.includes(module_specifier)))
						let isNamedAPI = false;
						if (api) {
							isNamedAPI = (api.getType() === API_TYPE.named_only)
						}

// 						if (js.getRelative().includes("import_stuff.js")) {
// 							// console.log("MODULESPECIFIER")
// 							// console.log(module_specifier)
// 							// console.log(api)
// 							// console.log(api.getType())
// 							console.log(node.declarations[0].id.name)
// 							console.log(`Full value named:${js.usesNamed()
// 							&& isNamespace
// 							&& (isBuiltin
// 								|| isNamedAPI)}`)
// 							console.log(
// 								`Full value named:${js.usesNamed()}
// isNamespace:${isNamespace}
// api type: ${api ? (api.getType() === API_TYPE.named_only) : "api not good"}`);
//
// 							// console.log(module_specifier)
// 							// console.log(node.declarations[0].id.name)
// 						}
						one_offs = null;
						// console.log(`${js.getRelative()}: >>>>  usesNames:${js.usesNamed()} && isNamesPace${isNamespace} && builtin  or namedApi  (${isBuiltin} OR ${isNamedAPI}) `)
						// let isOneOff = one_offs[_id]
						if (js.usesNamed() && isNamespace && (isBuiltin || isNamedAPI) && (!one_offs)) {
							// console.log('named imports ' + api.getType() + " "+isNamespace)
							namedImports(info, _id, module_specifier, api, wpn)
						} else {
							let idecl:ImportDeclaration
							if (isNamespace) {
								idecl = {
									type: "ImportDeclaration",
									source: (node.declarations[0].init.arguments[0] as SimpleLiteral),
									specifiers: [{
										type: "ImportNamespaceSpecifier",
										local: ((node.declarations as VariableDeclarator[])[0] as VariableDeclarator).id as Identifier
									}]

								}
							}else{
								idecl = {
								type: "ImportDeclaration",
								source: (node.declarations[0].init.arguments[0] as SimpleLiteral),
								specifiers: [{
									type: "ImportDefaultSpecifier",
									local: ((node.declarations as VariableDeclarator[])[0] as VariableDeclarator).id as Identifier
								}]

							}
							}
							_imports.add(idecl);
						}
						//always
						return VisitorOption.Remove;
					}
				} else if (node.type === "ExpressionStatement") {
					if (
						node.expression.type === "CallExpression"
						&& node.expression.callee.type === "Identifier"
						&& node.expression.callee.name === "require"
						&& node.expression.arguments.length
						&& node.expression.arguments[0].type === "Literal"
					) {

						_imports.add({
							type: "ImportDeclaration",
							source: (node.expression.arguments[0] as Literal),
							specifiers: []
						})
						return VisitorOption.Remove;
					}
				}

			}
		}
	}

	replace(js.getAST(), visitor)
	_imports.getDeclarations().reverse().forEach(e => {
		js.getAST().body.splice(0, 0, e)
	})
	replace(js.getAST(), {
		leave: (node, parent) => {

			if (
				node.type === "MemberExpression"
				&& node.object.type === "Identifier"
				&& node.property.type === "Identifier"
				&& propNameReplaceMap
				&& propNameReplaceMap[node.object.name]
				&& propNameReplaceMap[node.object.name][node.property.name]
			) {

				return {type: "Identifier", name: propNameReplaceMap[node.object.name][node.property.name]}
			} else if (false) {
				// if ()
			}

			// else if (node.type ==="Identifier"
			// && infoTracker.
			// )
		}
	});


	function namedImports(info: InfoTracker, id: string, module_specifier: string, api: API, wpn: WithPropNames) {


		// let api= 	map.resolveSpecifier(module_specifier, js)
		// let removed = module_specifier
		// while(removed[0]==='.'||removed[0]==='/'){
		// 	removed = removed.substr(1, removed.length )
		// }
		// let id = node.declarations[0].id.name
		let rpi = info.getRPI(id);

		let specifiers: ImportSpecifier[] = []

		// let apiexports = api.getExports()

		let accessables: string[] = rpi.allAccessedProps// .filter(e => apiexports.includes(e))
		accessables.forEach((e, index, arr) => {
			if (wpn.aliases[module_specifier] && wpn.aliases[module_specifier][e] === e) {
				arr[index] = wpn.aliases[module_specifier][e]
			}
		});
		// rpi.allAccessedProps
		accessables.forEach((e: string) => {
			let accessed: Identifier
			if (wpn.aliases[module_specifier] && wpn.aliases[module_specifier][e] === e) {
				accessed = {type: "Identifier", name: wpn.aliases[module_specifier][e]}
			} else {
				let _id = wpn.fromSpec[module_specifier]
				if (_id) {
					accessed = {type: "Identifier", name: e}
				} else {
					throw new Error('accessed could not find id from spec: ' + module_specifier)
					//js.getNamespace().generateBestName(e)
				}
			}
			// demap.fromId[id]
			if (!propNameReplaceMap[id]) {
				propNameReplaceMap[id] = {}
			}
			propNameReplaceMap[id][e] = accessed.name
			let is: ImportSpecifier = {
				type: "ImportSpecifier",
				local: accessed,
				imported: {type: "Identifier", name: e}
			}

			specifiers.push(is)
		});

		// js.addAnImport
		(_imports.add({
			type: "ImportDeclaration",
			source: {type: "Literal", value: module_specifier},
			specifiers: specifiers
		}))
	}
}

//
//
// let ast: Program
//
//
// ast = parseScript(`
// var x = require('y');
// `)
// traverse(ast, {
// 	leave: (node, parent) => {
// 		if (node.type === "VariableDeclaration") {
// 			console.log(`${node.type} -> ${parent.type}`)
// 		}
// 	}, enter: (node, parent) => {
// 		if (node.type === "VariableDeclaration") {
// 			console.log(`${node.type} -> ${parent.type}`)
// 		}
// 	}
// })
//
//
//




