import {replace, Visitor} from 'estraverse'
import {Identifier} from 'estree'
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import { generate } from 'escodegen';

export function propReadReplace(js: JSFile) {
	let exportBuilder = js.getExportBuilder()
	let visitor1: Visitor = {
		leave: (node, parentNode) => {

			if (node.type === "MemberExpression"
				&& node.property.type === "Identifier"
				&& node.object.type === "MemberExpression"
				&& node.object.object.type === "Identifier"
				&& node.object.property.type === "Identifier"
				&& node.object.object.name === "module"
				&& node.object.property.name === "exports"
			) {
				// console.log(node)
				// console.log("GOTOIT")
				// 	if (!exportBuilder.getByName(node.property.name) )
				// 	{
				// 		console.log("exportBuilder.getByName "+node.property.name + "null ")
				// 	}else if(exportBuilder.getByName(node.property.name) .local) {
				//
				// 		console.log("exportBuilder.getByName "+node.property.name +" of "+ exportBuilder.getByName(node.property.name).local.name+" local> < imported"+exportBuilder.getByName(node.property.name).exported.name  )
// 				// 	}
// 				let j =exportBuilder.getByName(node.property.name)
// 					console.log(`reading from property: ${node.property.name} where ${exportBuilder.getByName(node.property.name)? exportBuilder.getByName(node.property.name).exported.name:"nothing"} is  exported
// 					 and  ${exportBuilder.getByName(node.property.name)?
// 						( exportBuilder.getByName(node.property.name).local.type==="Identifier" ?exportBuilder.getByName(node.property.name).local.name:"c") :"nothing" } is the local type  `)
// 					console.log(exportBuilder.getByName(node.property.name) .local.type)
try {
	return exportBuilder.getByName(node.property.name).local;
}catch (e) {

	console.log( " __ "+	generate(node))
	console.log( "err:  " + e  )
					return null
}
			}
		}
	}
	let visitor2: Visitor = {
		leave: (node, parent) => {

			let value: Identifier
			// if (node.type === "MemberExpression"
			// 	&& node.property.type === "Identifier") {
			// 	if ( node.object.type === "MemberExpression"
			// 		&& node.object.object.type === "Identifier"
			// 		&& node.object.property.type === "Identifier"
			// 		&& node.object.object.name === "module"
			// 		&& node.object.property.name === "exports"
			// 	) {
			// 		console.log(node)
			// 		console.log("GOTOIT")
			// 		return;
			// 		// return  exportBuilder.getByName(node.property.name);
			// 	}else
			if (
				node.type === "MemberExpression"
				&& node.object.type === "Identifier"
				&& node.property.type === "Identifier"
				&& ((node.object.name === "module" && node.property.name === "exports") || node.object.name === "exports")
			) {
				if (parent.type === "MemberExpression" && parent.property.type === "Identifier") {
					// console.log(parent.property.name)
					return exportBuilder.getByName(node.property.name)
				}
				// console.log("OTHER")

				if (node.object.name === "module") {


					// else{
					// 	return {type: "Identifier", name: "defaultExport"}
					//
					// }
					return {type: "Identifier", name: "defaultExport"}

					// console.log(parent)
					//defaultExport
				} else {
					//exports.x
					return  exportBuilder.getByName(node.property.name).local
				}
			}
		}

	}
	replace(js.getAST(), visitor1);
	replace(js.getAST(), visitor2);


}

// let js = new JSFile('./index.js',JSFile.mockedMeta, null,false,`
// module.exports = x
// module.exports
// module.exports()
// module.exports.func()
// module.exports.func(module.exports.func())
// if(module.exports){
// }
// if(module.exports.x){
// }
// if(module.exports.func()){
// }
// `)
// function run(data:string, visitor:Visitor, useReplace:boolean = true):string {
// 	let ast:Program = parseScript(data);
// 	// (useReplace? replace: traverse)
// 	replace(ast, visitor);
// 	return generate(ast)
// }
//
// reqPropertyInfoGather(js)
// transformBaseExports(js)
// console.log(js.makeSerializable().fileData)
// propReadReplace  console.log( )
// console.log( )
// console.log( )
// console.log( )
// console.log(js.makeSerializable().fileData)
//
// // let ran = run(  )
// console.log(ran)


