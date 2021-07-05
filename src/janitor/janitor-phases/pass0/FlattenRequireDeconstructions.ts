import {Identifier, Node, VariableDeclarator} from "estree";
import {JSFileImpl} from "../../../abstract_fs_v2/JSv2";
import {isARequire} from "../../utilities/helpers";
import {asRequire} from "../../utilities/Require";

export type Seen_Used_IDs = { [key: string]: () => { id:Identifier ,used:boolean} }

export function flattenRequireObjectDeconstructions2(js: JSFileImpl, seenIds:Seen_Used_IDs) {



	// return  getAlpha(seenIds, js)


}/*
function getAlpha(seenIds: Seen_Used_IDs , js: JSFileImpl): (node: Node, parent: Node) => void {
	return function (node: Node, parent: Node) {
		if (node.type === "VariableDeclaration" && node.declarations) {
			node.declarations.forEach((decl, i, arr) => {
				if (decl.id.type === "ObjectPattern" && isARequire(decl.init)) {
					let rc = asRequire(decl.init)
					let rs = rc.getRS()
					if (!seenIds[rs]) {
						seenIds[rs] = () => js.getNamespace().generateBestName(rc.getCleaned())
					}
					let __init: Identifier = seenIds[rs]()

					let toadd: VariableDeclarator[] = [
						declare(__init.name, decl.init)
					]

					decl.id.properties.forEach((prop) => {

						switch (prop.type) {
							case "Property":
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
					})
					arr.splice(i, 1, ... toadd);
					arr.splice(arr.indexOf(decl), 1);
				}
			})
		}
	};
}
*/