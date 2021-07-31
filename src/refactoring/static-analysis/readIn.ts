import assert from 'assert'
import {generate} from "escodegen";
import {traverse} from "estraverse";
import {
	AssignmentExpression,
	AssignmentProperty,
	CallExpression,
	ExpressionStatement,
	Identifier,
	Literal,
	MemberExpression,
	Node,
	VariableDeclaration
} from "estree";
import {JSFile} from "../../filesystem/JSFile";
// import {DataBuilder} from "../../refactoring/bridge/PreProcessData.json";

import Require = NodeJS.Require;
import {declare, id, isModule_Dot_Exports} from "../../utility";
import {Intermediate} from "../../utility/Intermediate";


export function readIn(js: JSFile )  {
	// let builder = DataBuilder()
	let declCounts: { [key: string]: number } = {}
	let load_order: string[] = []
	let ms_to_id: { [str: string]: string } = {}
	let id_to_ms: { [str: string]: string } = {}
	let id_aliases: { [str: string]: string[] } = {}
	let exportMap: { [str: string]: string } = {}
	let import_decls: (ExpressionStatement | VariableDeclaration)[] = []

	let indices: number[] = []


	js.getAST().body.forEach((stmt, index, arr) => {
 		switch (stmt.type) {

			case "VariableDeclaration":
				if (
					stmt.declarations.length === 1
					&& stmt.declarations[0].init
					&& stmt.declarations[0].init.type === "CallExpression"
					&& stmt.declarations[0].init.callee.type === "Identifier"
					&& stmt.declarations[0].init.callee.name === "require"
				) {
					let _id = (stmt.declarations[0].id as Identifier).name
					let rst = ((stmt.declarations[0].init.arguments[0] as Literal)).value.toString()
					ms_to_id[rst] = _id
					id_to_ms[_id] = rst
					load_order.push(rst)
					// builder.addRequire(rst, _id)
					import_decls.push(stmt)
					indices.push(index)

				} else {
 				}

				break;
			case "ExpressionStatement":
				let exp = stmt.expression


				if (exp.type === "AssignmentExpression") {
					handleExports(exp);
				} else if (exp.type === "CallExpression") {

					if (exp.callee.type === "Identifier"
						&& exp.callee.name === "require"
						&& exp.arguments[0]
						&& exp.arguments[0].type === "Literal"
					) {
						let rs = exp.arguments[0].value.toString()
						ms_to_id[rs] = null
						load_order.push(rs)
						// builder.addRequire(rs)
						indices.push(index)

					}
				}
				break;

		}
	})
	// let built = builder.build()
	let _body = js.getAST().body
	indices.reverse().forEach(i => _body.splice(i, 1))


	/*TODO determine what to do about id_aliases and shadow variables
	Object.keys(id_to_ms).forEach(_id=> id_aliases[_id] = [] )
let _enter = (node: Node, parent: Node)=>{
	if (node.type ==="VariableDecla ration"
		&& node.declarations[0].init.type ==="Identifier"
		&& id_to_ms[node.declarations[0].init.name]
		&& node.declarations.length===1
		// &&
		&& node.declarations[0].id.type ==="Identifier"
	){
		let _init = node.declarations[0].init.name
		let _name= node.declarations[0].id.name
		if (_init in id_aliases){
			id_aliases[_init].push(_name)
		}

	}
}*/


	let __default = () => id(exportMap['default'])

	function grabDeclarations(node: Node,parent:Node,js:JSFile): void {
		let scopeTagger = js.getScopeTagger()
		switch (node.type) {
			case "BlockStatement":
				scopeTagger(parent)
				break;
			case "Program":

				break;
			case "VariableDeclaration":
				if (node.declarations.length === 1
					&& node.declarations[0].id.type === "Identifier"
					&& node.declarations[0].init
					&& node.declarations[0].init.type === "Identifier"
					&& id_to_ms[node.declarations[0].init.name]) {
					let alias = node.declarations[0].id.name
					let _mid = node.declarations[0].init.name
					if (!id_aliases[_mid]) {
						id_aliases[_mid] = [alias]
					} else {

						id_aliases[_mid].push(alias)
					}

				}
				node.declarations.forEach(e => {
					switch (e.id.type) {
						case "ObjectPattern":
							(e.id.properties as AssignmentProperty[]).forEach(r => {
								// _name = (r.key as Identifier).name
								if (!declCounts[(r.key as Identifier).name]) {
									declCounts[(r.key as Identifier).name] = 1;
								} else {
									declCounts[(r.key as Identifier).name]++

								}

							})
							break;
						case "Identifier":
							// _name = e.id.name
							if (!declCounts[e.id.name]) {
								declCounts[e.id.name] = 1;
							} else {
								declCounts[e.id.name]++

							}
							// declCounts[_name]++
							// console.log(_name)

							break;
						default: {
							console.log((`weired thing with type ${e.id.type}`))
						}
					}

				})
				break;
			case "FunctionExpression":

				if (node.id) {
					// _name = node.id.name
					if (!declCounts[node.id.name]) {
						declCounts[node.id.name] = 1
					} else {
						declCounts[node.id.name]++

					}
				}

				break;

			case "ClassDeclaration":
				if (!declCounts[node.id.name]) {
					declCounts[node.id.name] = 1
				} else {
					declCounts[node.id.name]++

				}
				// _name = node.id.name
				break;
			case "FunctionDeclaration":

				// _name = node.id.name
				if (!declCounts[node.id.name]) {
					declCounts[node.id.name] = 1
				} else {
					declCounts[node.id.name]++

				}
				break;

			//TODO ARROEXPOR
		}
	}

	traverse(js.getAST(), {
		enter: (node: Node, parent: Node) => {
			// let _name: string = '';
			grabDeclarations(node,parent,js);
			// if (_name && !declCounts[_name]) {
			// 	declCounts[_name] = 1
			// }else{
			// 	declCounts[_name]++
			//
			// }
		},

		// enter:_enter,
		leave: getLeave(exportMap, __default)
	})
 	let vd: VariableDeclaration = {
		type: "VariableDeclaration", kind: "var",
		declarations: Object.keys(exportMap)
			.map(id)
			.map(ident => declare(ident))
	}
	let body = js.getAST().body
	/*
	   if(body[0].type ==="VariableDeclaration"&&
		   body[0].declarations[0].id.type ==="Identifier"
		   && Object.values(exportMap)
			   .includes(body[0].declarations[0].id.name)){

				   body[0].declarations.push(... vd.declarations)

	   }else{
	   }*/ //TODO
	let interm: Intermediate = new Intermediate(js , id_to_ms, ms_to_id, import_decls, exportMap, load_order, declCounts, id_aliases);

	// let actual:any[]
	//
	// actual = Object.keys(declCounts)
	// require('chai').assert(actual.length > 0,`declCountSize: ${actual.length}`)

	// actual = Object.keys(load_order)
	// require('chai').assert(actual.length > 0,`was ${actual.length}`)


	// require('chai').assert(Object.keys(load_order).length === Object.keys(ms_to_id).length ,`same-size`)

// try {
// 	require('chai').assert(Object.keys(ms_to_id).length >=  Object.keys(interm.id_aliases).length, `${'err'}`)
// }catch (e) {
// 	process.exit( )
// }
// require('chai').assert(Object.keys(id_to_ms).length <= Object.keys(ms_to_id).length,`` )
	let obk = Object.keys(exportMap)
	if (body[0].type === "VariableDeclaration" && (obk.length > 1 || ((!obk['default']) && obk.length > 0))) {
		body[0].declarations.push(... vd.declarations)
	} else {
		body.splice(0, 0, vd)

	}

	(js as JSFile).setIntermediate(interm)





		/********** * Helper Functions * **********/





	function handleExports(exp: AssignmentExpression): void {
		if (exp.left.type === "MemberExpression") {
			if (isModule_Dot_Exports(exp.left)) {
				exportMap['default'] = (exp.right as Identifier).name
				// builder.addExport('default')
			} else if (isModule_Dot_Exports(exp.left.object)) {
				exp.left.object = exp.left.object as MemberExpression
				let name = (exp.left.property as Identifier).name

				let best = js.getNamespace().generateBestName(name)

				exp.left = best;

				exportMap[name] = exp.left.name//(exp.right as Identifier).name
				// builder.addExport(name)

			}
		}
	}

}

function getLeave(exportMap: { [p: string]: string }, __default: () => Identifier): (node: Node) => (Identifier) {
	return  (node: Node) => {
		if (node.type === "MemberExpression") {
			if (exportMap['default']) {
				if (isModule_Dot_Exports(node.object)) {
					node.object = __default()
				} else if (isModule_Dot_Exports(node)) {
					return __default()
				}
			} else /* (!exportMap['default'])*/{
				if (isModule_Dot_Exports(node.object)) {
					let name = (node.property as Identifier).name
					return id(exportMap[name])
				}
			}
		}
	};
}