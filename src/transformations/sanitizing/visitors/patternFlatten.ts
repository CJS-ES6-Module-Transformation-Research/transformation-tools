import {generate} from "escodegen";
import {replace, Visitor, VisitorOption} from "estraverse";
import {
	CallExpression,
	Identifier,
	MemberExpression,
	Node,
	Property,
	RestElement,
	VariableDeclaration,
	VariableDeclarator
} from "estree";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {alphaNumericString} from "./accessReplacer";


export function deconsFlatten(js: JSFile) {
	let toReturn: VariableDeclaration
	let visitor: Visitor = {
		leave: (node: Node, parent: Node | null) => {
			// if(node.type ==="ObjectPattern"){
			// 	console.log(generate(node))
			// 	console.log(generate(parent))
			// 	console.log(parent.type)
			// }
		if(node.type === "VariableDeclaration"

			&& node.declarations
			&& node.declarations[0]
			&& node.declarations[0].id
			&& node.declarations[0].id.type !=="Identifier"

			){

				if (

					  node.declarations[0].init
			&& node.declarations[0].id.type === "ObjectPattern"
					&& node.declarations[0].init.type === "CallExpression"
					&& node.declarations[0].init.callee.type === "Identifier"
					&& node.declarations[0].init.callee.name === "require"
					&& node.declarations[0].init.arguments
					&& node.declarations[0].init.arguments[0]
					&& node.declarations[0].init.arguments[0].type === "Literal"
				) {


					console.log(JSON.stringify(node.declarations[0].id, null, 3))
					console.log(generate(node.declarations[0].id))

					if (!node.declarations[0].id) {
						console.log("NOT ID")
						console.log(generate(node))
					} else if (!node.declarations[0].id.properties) {
						console.log("NOT properties")
						console.log(generate(node))
					}

					// let requireTracker = js.getInfoTracker()
					let declarator = node.declarations[0];
					// let ns = js.getNamespace()
					// let objPat: ObjectPattern = declarator.id as ObjectPattern
					let requireCall: CallExpression = declarator.init as CallExpression
					// let requireString: string = node.declarations[0].init.arguments[0].value.toString()
					//
					// let moduleSpecifiers: string[] = requireTracker.getImportedModuleSpecifiers()
					// let identifier: Identifier
					// if (moduleSpecifiers.includes(requireString)) {
					// 	identifier = requireTracker.importingModule(requireString)
					// 	console.log("DIDIDIFIIER")
					// 	console.log(identifier.name)
					//
					// 	assert(identifier)
					// } else {
					// 	identifier = ns.generateBestName(`_moduleAccess_${cleanValue(requireString)}`);
					// 	console.log("DIDIDIFIIER___2")
					// 	console.log(identifier.name)
					// 	ns.addToNamespace(identifier.name)
					// 	let reqDecl = createRequireDec(identifier.name, requireString)
					// 	requireTracker.insertRequireImport(reqDecl)
					// 	// console.log(requireString)
					// 	assert(requireTracker.importingModule(requireString).name === identifier.name)
					// }

					// toReturn = {
					// 	type:"VariableDeclaration",
					// 	kind:"var",
					// 	declarations:[{
					// 		type:"VariableDeclarator",
					// 		id:identifier,
					// 		init:requireCall
					// 	}]
					// }


					if (parent && parent.type === "Program") {
						let body = parent.body
						// let idz :Identifier =
						let declArray: VariableDeclaration[] = []
						node.declarations[0].id.properties.forEach((prop: Property | RestElement) => {
							switch (prop.type) {
								case "Property":
									if (prop.value.type === "Identifier") {
										let x;
										if (prop.shorthand) {
											declArray.push(declaratorFactory(//identifier,
												prop.value, requireCall))
											x = declaratorFactory(//identifier,
												prop.value, requireCall)

											parent.body.splice(body.indexOf(node), 0, x)

										} else if (prop.key.type === "Identifier") {
											declArray.push(declaratorFactory(//identifier,
												prop.key, requireCall, prop.value))
											x = declaratorFactory(// identifier,
												prop.key, requireCall, prop.value)
											parent.body.splice(body.indexOf(node), 0, x)
										}
										console.log("__x ")
										console.log(generate(x))
									}
									break;
								case "RestElement":
									break;
							}
						});
					}
					// declArray.forEach(elem=>js.addToTop(elem))
				}
				// return VisitorOption.Remove;
			}

		}
	}

	function declaratorFactory(/*base: Identifier, */ id: Identifier, callex: CallExpression, alias: Identifier = null): VariableDeclaration {
		let mmx: MemberExpression = {
			type: "MemberExpression",
			computed: false,
			object: callex,
			property: id
		}
		let declarator: VariableDeclarator = {
			type: "VariableDeclarator",
			id: alias ? alias : id,
			// init: {
			// 	type: "MemberExpression",
			// 	computed: false,
			// 	object: base,
			// 	property: id
			// }
			init: mmx
		};


		let vDCLN: VariableDeclaration = {
			kind: "var",
			type: "VariableDeclaration",
			declarations: [declarator]
		};
		return vDCLN
	}

	replace(js.getAST(), visitor)
}


function cleanValue(requireStr: string): string {
	let replaceDotJS: RegExp = new RegExp(`(\.json)|(\.js)`, 'g')// /[\.js|]/gi
	let illegal: RegExp = new RegExp(`([^${alphaNumericString}_])`, "g"); ///[alphaNumericString|_]/g
	let cleaned = requireStr.replace(replaceDotJS, '');
	cleaned = cleaned.replace(illegal, "_");

	return cleaned;
}


