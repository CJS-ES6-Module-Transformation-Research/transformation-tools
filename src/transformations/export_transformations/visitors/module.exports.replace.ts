// import {replace, Visitor} from 'estraverse'
// import {Identifier} from 'estree'
// import {JSFile} from "../../../abstract_fs_v2/JSv2";
// import { generate } from 'escodegen';
//
// export function propReadReplace(js: JSFile) {
// 	let exportBuilder = js.getExportBuilder()
// 	let visitor1: Visitor = {
// 		leave: (node, parentNode) => {
//
// 			if (node.type === "MemberExpression"
// 				&& node.property.type === "Identifier"
// 				&& node.object.type === "MemberExpression"
// 				&& node.object.object.type === "Identifier"
// 				&& node.object.property.type === "Identifier"
// 				&& node.object.object.name === "module"
// 				&& node.object.property.name === "exports"
// 			) {
//
//  	return exportBuilder.getByName(node.property.name).local;
//
// 			}
// 		}
// 	}
// 	let visitor2: Visitor = {
// 		leave: (node, parent) => {
//
// 			if (
// 				node.type === "MemberExpression"
// 				&& node.object.type === "Identifier"
// 				&& node.property.type === "Identifier"
// 				&& ((node.object.name === "module" && node.property.name === "exports") || node.object.name === "exports")
// 			) {
// 				if (parent.type === "MemberExpression" && parent.property.type === "Identifier") {
// 					// console.log(parent.property.name)
// 					return exportBuilder.getByName(node.property.name)
// 				}
//
// 				if (node.object.name === "module") {
//
// 					return {type: "Identifier", name: "defaultExport"}
//
// 					// console.log(parent)
// 					//defaultExport
// 				} else {
// 					//exports.x
// 					return  exportBuilder.getByName(node.property.name).local
// 				}
// 			}
// 		}
//
// 	}
// 	replace(js.getAST(), visitor1);
// 	replace(js.getAST(), visitor2);
//
//
// }
//
// // let js = new JSFile('./index.js',JSFile.mockedMeta, null,false,`
// // module.exports = x
// // module.exports
// // module.exports()
// // module.exports.func()
// // module.exports.func(module.exports.func())
// // if(module.exports){
// // }
// // if(module.exports.x){
// // }
// // if(module.exports.func()){
// // }
// // `)
// // function run(data:string, visitor:Visitor, useReplace:boolean = true):string {
// // 	let ast:Program = parseScript(data);
// // 	// (useReplace? replace: traverse)
// // 	replace(ast, visitor);
// // 	return generate(ast)
// // }
// //
// // reqPropertyInfoGather(js)
// // transformBaseExports(js)
// // console.log(js.makeSerializable().fileData)
// // propReadReplace  console.log( )
// // console.log( )
// // console.log( )
// // console.log( )
// // console.log(js.makeSerializable().fileData)
// //
// // // let ran = run(  )
// // console.log(ran)
//
//
