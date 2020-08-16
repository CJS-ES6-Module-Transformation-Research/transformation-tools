import {replace, traverse, Visitor, VisitorOption} from "estraverse";
import * as ESTree from "estree";
import {Identifier, ImportSpecifier} from "estree";
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
	let _imports: Imports = new Imports(js.getInfoTracker().getDeMap(), ((mspec: string) => MAM.resolveSpecifier( js,mspec)), MAM, js.getInfoTracker())
	js.setImports(_imports)
	let demap = infoTracker.getDeMap()
	let one_offs = getOneOffForcedDefaults(js.getAST(), listOfVars)
	let propNameReplaceMap: { [base: string]: { [property: string]: string } } = {}//replaceName
	let mod_map = js.getAPIMap()
	let fetchAPI: (string) => API = (e: string) => {
		return mod_map.resolveSpecifier(js,e)
	}
	function computeType(js: JSFile, init: Identifier, moduleSpecifier: string) {

		let rpi = js.getInfoTracker().getRPI(init.name)
		if (rpi && rpi.forceDefault) {
			// console.log(`\\\\\\\\${js.getRelative() } _________ forceDefault: ${rpi.forceDefault}`)
			return false;
		}

		let isNamespace: boolean;
		if (built_ins.includes(moduleSpecifier)) {
			isNamespace = !builtins_funcs.includes(moduleSpecifier);
	1		// FIXME?>>? apiMap.apiKey["apiKey"] = new API(API_TYPE.named_only,[],true)
		} else if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {
			if (moduleSpecifier ==='../lib/main.js'){
				// console.log(`${'modspec'}\\\\\\\\\\\\\\\\${js.getRelative()}`)
			}
			isNamespace = true;
			let req = moduleSpecifier.replace(/^\.{0,2}\//, '')
			let api //= fetchAPI()
			// console.log(req )
			try {

				api = fetchAPI(req)
				//  console.log(api.getType() )
				// console.log(req   )
				// if (moduleSpecifier ==='../lib/main.js'){
				// 	// console.log(`<><> ib/main ${api.getType() }${js.getRelative()}${fetchAPI(cleanMIS('../lib/main.js')).getType() }_()_()_${fetchAPI('../lib/main.js').getType() }`)
				// }
				if (api && api.getType() === API_TYPE.default_only) {
					isNamespace = false;
				} else {
					isNamespace = true;
				}
			} catch (e) {
				console.log(`api exception: ${js.getParent().getRelative()} ${req}  ${moduleSpecifier.replace(/^\.{0,2}\//, '')} `)
				throw e
			}
		} else {
			isNamespace = false;
		}
		return isNamespace;
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
						let isNamespace = computeType(js, node.declarations[0].id, node.declarations[0].init.arguments[0].value.toString())

						// let clean = cleanModuleSpecifier(module_specifier)
						// if(api && api.getType() ===API_TYPE.named_only){
						// }
						let _id = node.declarations[0].id.name
						let module_specifier = node.declarations[0].init.arguments[0].value.toString()
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
						console.log(`${js.getRelative()}: >>>>  usesNames:${js.usesNamed()} && isNamesPace${isNamespace} && builtin  or namedApi  (${isBuiltin} OR ${isNamedAPI}) `)
						// let isOneOff = one_offs[_id]
						if (js.usesNamed() && isNamespace && (isBuiltin || isNamedAPI) && (!one_offs)) {
							// console.log('named imports ' + api.getType() + " "+isNamespace)
							namedImports(info, _id, module_specifier, api, wpn)
						} else {

							_imports.add({
								type: "ImportDeclaration",
								source: node.declarations[0].init.arguments[0],
								specifiers: [{
									type: isNamespace ? "ImportNamespaceSpecifier" : "ImportDefaultSpecifier",
									local: node.declarations[0].id
								}]

							});
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
							source: node.expression.arguments[0],
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
		// info.getRPI_()
		// console.log(`${js.getRelative()}ID:${id}||`)
		// console.loog(`api type of variable ${id} importing ${module_specifier} is ${isNamespace?  "named":"default"}`)

		let specifiers: ImportSpecifier[] = []
		if ((!rpi)) {
			console.log()
			console.log(`in file: ${js.getRelative()} identifier   ${id}+ had no rpi ${module_specifier}`)
			throw new Error(`in file: ${js.getRelative()} identifier   ${id}+ had no rpi ${module_specifier}`)

		}
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




