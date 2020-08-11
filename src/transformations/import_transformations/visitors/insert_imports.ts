import {generate} from "escodegen";
import {replace, Visitor, VisitorOption} from "estraverse";
import * as ESTree from "estree";
import {Identifier, ImportSpecifier} from "estree";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {Imports, WithPropNames} from "../../../InfoTracker";
import {API} from "../../export_transformations/API";
import {API_TYPE} from "../../export_transformations/ExportsBuilder";
import {built_ins, builtins_funcs} from "../ImportManager";

function cleanModuleSpecifier(moduleSpecifier:string):string{
	return moduleSpecifier.replace(/^\.{0,2}\//,'' )
}

export function insertImports(js: JSFile) {
	// console.log(`calling insertImports on jsfile : ${js.getRelative()} `)

	let infoTracker = js.getInfoTracker();

	function computeType(js: JSFile, init: Identifier, moduleSpecifier: string) {

		let rpi = js.getInfoTracker().getRPI(init.name)
		if (rpi && rpi.forceDefault) {
			return false;
		}
		let mod_map = js.getAPIMap()
		let fetchAPI: (string) => API = (e: string) => {
			return mod_map.resolveSpecifier(e, js)
		}
		let isNamespace: boolean;
		if (built_ins.includes(moduleSpecifier)) {
			isNamespace = !builtins_funcs.includes(moduleSpecifier);
			// FIXME?>>? apiMap.apiKey["apiKey"] = new API(API_TYPE.named_only,[],true)
		} else if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) {
			isNamespace = true;
			let api = fetchAPI(moduleSpecifier)
			if (api.getType() === API_TYPE.default_only) {
				isNamespace = false;
			} else {
				isNamespace = true;
			}
		} else {
			isNamespace = false;
		}
		return isNamespace;
	}

	let propNameReplaceMap: { [base: string]: { [property: string]: string } }//replaceName
	propNameReplaceMap = {};
	let MAM = js.getAPIMap()
 	let _imports:Imports  =new Imports(js.getInfoTracker().getDeMap(),((mspec: string)=> MAM.resolveSpecifier(mspec, js)) ,MAM,js.getInfoTracker())

 	js.setImports(_imports)



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

						let module_specifier = node.declarations[0].init.arguments[0].value.toString()
						let wpn:WithPropNames = _imports.getWPN()
						let api=  wpn.api[module_specifier];
						if (js.usesNamed() && isNamespace &&api && api.getType()  === API_TYPE.named_only) {

							let module_specifier = node.declarations[0].init.arguments[0].value.toString()
							let info = js.getInfoTracker();
							let map = js.getAPIMap()

							// let api= 	map.resolveSpecifier(module_specifier, js)
							// let removed = module_specifier
							// while(removed[0]==='.'||removed[0]==='/'){
							// 	removed = removed.substr(1, removed.length )
							// }
							let id = node.declarations[0].id.name
							let rpi = info.getRPI(id);info.getRPI_( )
console.log(`${js.getRelative()}ID:${ id }||`)
							// console.log(`api type of variable ${id} importing ${module_specifier} is ${isNamespace?  "named":"default"}`)

							let specifiers: ImportSpecifier[] = []
							if ((!rpi)) {
								console.log(`in file: ${js.getRelative()} identifier   ${id }+ had no rpi ${module_specifier}`)
								throw new Error(`in file: ${js.getRelative()} identifier   ${id }+ had no rpi ${module_specifier}`)
								// console.log(`!RPI:   START`)
								// let z = info.getRPI_()
								// for (let p in z) {
								//
								// 	console.log(`tryking keyvalue=${p}  in rpilist   `)
								// 	console.log(`p:${p}=> ${JSON.stringify(z[p])}`)
								// }
								// console.log(`!RPI:   printed`)
								//
								// console.log(`in file: ${js.getRelative()} notRPI OF in file${node.declarations[0].id.name}`)
								// console.log(generate(node))

							}
							let apiexports=api.getExports()

							let accessables:string[] = rpi.allAccessedProps.filter(e=>apiexports.includes(e))
							accessables.forEach((e,index,arr)=>{
								if( wpn.aliases[module_specifier][e]===e){
									arr[index] = wpn.aliases[module_specifier][e]
								}
							});
							rpi.allAccessedProps.forEach((e: string) => {
								let accessed = js.getNamespace().generateBestName(e)
			demap.fromId['               ']
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
								source: node.declarations[0].init.arguments[0],

								specifiers: specifiers
							}))
						} else {
							let cc = node.declarations[0].id.name
							// console.log(`_______ `)
							// console.log()
							// console.log(cc)
							// console.log(`${JSON.stringify(js.getInfoTracker().getRPI(cc))}`)
							// console.log(`${node.declarations[0].init.arguments[0].value.toString()}`)
							// console.log(generate(node))

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

						// return
						// js.addAnImport
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
	let demap = infoTracker.getDeMap()

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
			}else	if (false){
				// if ()
			}

			// else if (node.type ==="Identifier"
			// && infoTracker.
			// )
		}
	});



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




