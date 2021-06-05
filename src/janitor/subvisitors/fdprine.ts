import {generate} from "escodegen";
import {parseScript} from "esprima";
import {
	ArrayPattern, AssignmentPattern, AssignmentProperty,
	BlockStatement, CallExpression,
	Directive, Identifier, MemberExpression,
	ModuleDeclaration,
	Node, ObjectPattern,
	Program, RestElement,
	Statement,
	VariableDeclaration,
	VariableDeclarator
} from "estree";
import {traverse, Visitor} from "estraverse";
import {TransformFunction} from "../../abstract_fs_v2/interfaces";
import {JSFile} from "../../abstract_fs_v2/JSv2";
import {RequireStringTransformer} from "../../transformations/sanitizing/requireStringTransformer";


function cleanRequires(node:Node, parent:Node, ids: { [p: string]: string }, js: JSFile, rst: RequireStringTransformer): void {
	if (node.type === "CallExpression" && isARequire(node)) {

		if (parent && parent.type === "VariableDeclarator"
			&& parent.id.type === "Identifier") {
			ids[cleanRequire(node, js, rst)] = parent.id.name
		} else if (parent && parent.type !== "VariableDeclarator") {
			ids[cleanRequire(node, js, rst)] = ''; // so it is a key
		} else {
			//case where parent is variabledeclarator and not identifier
			// (handled in pattern flatten)
		}

	}
}

function flattenObjectPattern(node:Node , js: JSFile, rst: RequireStringTransformer, ids: { [p: string]: string }): void {
	if (node.type === "VariableDeclaration" && node.declarations) {
		node.declarations.forEach((decl, i, arr) => {
			let toadd:VariableDeclarator[] = []
			if (decl.id.type === "ObjectPattern") {
				let __init: Identifier = js.getNamespace().generateBestName('__init')
				let vdc:VariableDeclarator= {
					type: "VariableDeclarator",
					id: __init,
					init: decl.init
				}
				let toremove = decl
 				console.log(generate(vdc))

				// arr.splice(arr.indexOf(decl), 0, vdc)
				toadd.push(vdc)
				console.log(i + decl.init.type)
				if (isARequire(decl.init)) {
					let requireString: string = cleanRequire(decl.init as CallExpression, js, rst)
					ids[requireString] = __init.name
				}
				decl.id.properties .forEach((prop) => {

					// console.log(generate(node ))
						switch (prop.type) {
							case "Property":
								prop = (prop as AssignmentProperty)
								let mx: MemberExpression = {
									object: __init,
									property: prop.key,
									computed: false,
									type: "MemberExpression"
								}

								let vdx: VariableDeclarator = {
									type: "VariableDeclarator",
									id: prop.value,
									init: mx
								}
								// console.log(generate(vdx))
								toadd.push(vdx)

								// arr.splice(i>=arr.length? arr.length:i, 0, vdx)

								i++
								// console.log(prop.key)
								// console.log(prop.value)

								break;
							case "RestElement":
								throw new Error("unsupported operation")
						}
					}

			)
				arr.splice(i, 1,...toadd);
				arr.splice(arr.indexOf(toremove), 1);


			}
		})

	}
}

function getToFlatten(vdcln: VariableDeclaration):  (Statement | VariableDeclaration)[]  {
	let flattened: (Statement | VariableDeclaration)[] = []

	vdcln.declarations.forEach((decl: VariableDeclarator) => {
		//add declarator to be flattened.
		let ls: VariableDeclarator[] = []
		ls.push(decl)
		if (decl.init && decl.init.type === "CallExpression"
			&& decl.init.callee.type === "Identifier"
			&& decl.init.callee.name === "require"

		) {
		}
		let flat: VariableDeclaration = {
			kind: vdcln.kind,
			type: vdcln.type,
			declarations: ls
		}

		//add to flatten decl list.
		flattened.push(flat)
	});
	return flattened
}

function flattenDeclarations(node:VariableDeclaration, parent:Node): void {
let  flattened: (Statement | VariableDeclaration)[] = getToFlatten(node)
	if ("Program" === parent.type || parent.type === "BlockStatement") {
		// insert back into body array
		let indexof = parent.body.indexOf((node as Statement | Directive));
		flattened.reverse().forEach((e) => {
				parent.body.splice(indexof, 0, e)
			}
		)
		indexof = parent.body.indexOf((node as Statement | Directive));
		parent.body.splice(indexof, 1)
	} else if ("ForStatement") {
		return;
	} else {
		throw new Error("don't know why it got here ")
	}
}
export interface DataInterface{
	reqStrToIDMap: {[key:string]:string}
	exportNameToNodeList: { [key:string]:Node[] }
}
/**.
 * TransformFunction that does Variable Declaration Declarator flattening.
 * @param js the JSFile to transform.
 */
export default  function (js: JSFile){

	let   reqStrToIDMap: {[key:string]:string} = {}
	let inits = 0;
	let rst : RequireStringTransformer = new RequireStringTransformer( js)
	// {
	// 	reqStrToIDMap
	// }
	let exportNameToNodeList: { [key:string]:Node[] } = {}
	const di:DataInterface = {reqStrToIDMap,exportNameToNodeList}
	js.setSDI(di)
		let _i = 0;
	function enter   (node: Node, parent: Node| null){

		cleanRequires(node, parent, reqStrToIDMap, js, rst);



		flattenObjectPattern(node, js, rst, reqStrToIDMap);
		if (node.type==="MemberExpression"
			&& parent
			&& parent.type === "AssignmentExpression"
			&& parent.left ===node
		){
			let name:string = ''
			if (node.object.type==="Identifier" && node.property.type === "Identifier"){
				if (node.object.name ==="module"){
					name = 'default'
				}else if(	node.object.name ==="exports"){
					name = node.property.name
				}
			}else if(
				node.object.type==="MemberExpression"
				&& node.object.object.type ==="Identifier"
				&& 	node.object.object.name ==="module"
				&& node.object.property.type === "Identifier"
				&& node.object.property.name ==="exports"
				&& node.property.type === "Identifier"){

			}
			if (name){
				if (!exportNameToNodeList[name]){
					exportNameToNodeList[name] = [];
				}
				if (!exportNameToNodeList[name].includes(parent.right)){
					exportNameToNodeList[name].push(parent.right)
				}
			}
		}
	}


		const leave = (node: Node, parent: Node): void => {

			if (parent !== null && parent.type === "ForStatement") {
				return; //handled elsewhere
			}
			if (node.type === 'VariableDeclaration' ) {

				if (node.type === 'VariableDeclaration'
					&& node.declarations.length > 1
					&& parent) {
					flattenDeclarations(node, parent);

				}
		}
	};
	traverse(js.getAST(), {enter,leave});

return di;

}


	export const JSON_REGEX: RegExp = new RegExp('.+\.json$');


	function cleanRequire(node:CallExpression, js:JSFile, rst:RequireStringTransformer){
		if ( node.callee.type === "Identifier"
			&& node.callee.name === "require"
			&& node.arguments[0].type === "Literal") {
			let literal = node.arguments[0].value.toString()
			let requireString: string = rst.getTransformed(literal)
			if (requireString !== literal) {
				//had to be cleaned
			}


			if (JSON_REGEX.test(requireString)) {
				//was json
				requireString = js.createCJSFromIdentifier(requireString)
			}

			node.arguments[0] = {type: "Literal", value: requireString}
			return requireString
		}}

function isARequire(node) {
	return node.type === "CallExpression"
		&& node.callee.type === "Identifier"
		&& node.callee.name === "require";
}
// let  x= parseScript(`var z = '';var {a:b, c, d:e} = mod, c2 = 3 `)
// // x = parseScript(` var {b} = mod.x`)
// let pre = generate(x)
// console.log(generate(x))
// traverse(x,{enter })
//
// console.log('-----------------------')
// console.log(generate(x))

// console.log(require('jsdiff').diffChars)
