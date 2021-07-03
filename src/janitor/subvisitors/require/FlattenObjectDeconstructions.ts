/*import {traverse, Visitor} from "estraverse";
import {AssignmentProperty, Identifier, Node, VariableDeclarator} from "estree";
import {id} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {JanitorRequireData} from "../../data_management/RequireStringData";
import {declare, isARequire} from "../../utilities/helpers";
import {asRequire} from "../../utilities/Require";


export function flattenRequireObjectDeconstructions(node: Node, js: JSFile, data: JanitorRequireData) {

	if (node.type === "VariableDeclaration" && node.declarations) {
		node.declarations.forEach((decl, i, arr) => {
			if (decl.id.type === "ObjectPattern" && isARequire(decl.init)) {
				let __init: Identifier = getRequireID(decl);
				let toadd: VariableDeclarator[] = [
					{
						type: "VariableDeclarator",
						id: __init,
						init: decl.init
					}
				]

				//compute
				console.log(i + decl.init.type)

				decl.id.properties.forEach((prop) => {

						switch (prop.type) {
							case "Property":
								prop = (prop as AssignmentProperty)


								toadd.push({
									type: "VariableDeclarator",
									id: prop.value,
									init: {
										object: __init,
										property: prop.key,
										computed: false,
										type: "MemberExpression"
									}
								})


								i++

								break;
							case "RestElement":

								throw new Error("unsupported operation")
						}
					}
				)
				arr.splice(i, 1, ... toadd);
				arr.splice(arr.indexOf(decl), 1);


			}

		})
		// }

	}

	function getRequireID(decl): Identifier {

		let __init: Identifier
		let $rs = asRequire(decl.init)
		let rs = $rs.getRS()

		if (data.mappingToID[rs]) {
			__init = id(data.mappingToID[rs])
			return __init
		} else {
			if (rs[0] !== '_') {
				rs = '_' + rs
			}
			__init = js.getNamespace().generateBestName($rs.getCleaned())
			data.addSpecifier(rs, __init.name)
			return __init
		}
	}
}*/
// export function flattenRequireObjectDeconstructions2(  js: JSFile):Visitor {
// 	return( ()=>{
// let seenIds :{[key:string]:()=>Identifier} = {}
//   let visitor :Visitor = {
// 	enter:(node:Node,parent:Node)=>{
// 	if (node.type === "VariableDeclaration" && node.declarations) {
// 		node.declarations.forEach((decl, i, arr) => {
// 			if (decl.id.type === "ObjectPattern" && isARequire(decl.init)) {
//  				let rc = asRequire(decl.init)
// 				let rs = rc.getRS()
// 				if(!seenIds[rs]){
// 					seenIds[rs] =  () => js.getNamespace().generateBestName(rc.getCleaned())
// 				}
// 				let __init: Identifier= seenIds[rs]()
//
// 				let toadd: VariableDeclarator[] = [
// 					declare(__init.name,decl.init)
// 				]
//
// 				decl.id.properties.forEach((prop) => {
//
// 						switch (prop.type) {
// 							case "Property":
// 								toadd.push({
// 									type: "VariableDeclarator",
// 									id: prop.value,
// 									init: {
// 										object: __init,
// 										property: prop.key,
// 										computed: false,
// 										type: "MemberExpression"
// 									}
// 								})
//
//
// 								i++
//
// 								break;
// 							case "RestElement":
//
// 								throw new Error("unsupported operation")
// 						}
// 					})
// 				arr.splice(i, 1, ... toadd);
// 				arr.splice(arr.indexOf(decl), 1);
//
//
// 			}
//
// 		})
//
// 	}}}
// return visitor
// 	})()
// }
