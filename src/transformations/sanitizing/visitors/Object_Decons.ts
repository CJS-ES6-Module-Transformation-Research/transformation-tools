import {parseScript} from 'esprima'
import {traverse} from "estraverse";
import {
	CallExpression,
	Directive,
	Identifier,
	ModuleDeclaration,
	Node,
	ObjectPattern,
	Statement,
	VariableDeclaration
} from 'estree'
import {JSFile} from "../../../filesystem/JSFile";

let script: string = `
var {a:bc} = require('abc')
for (let x = 0 ; x < 1; x++){
forLoop()
}
for (let x in obj){
forIn()
}
while(true){
whileStmt()
var {a1,a2} = require('f')

}
var {d:l,k } = require('zyx')

if(true){
IF()
}else{
ELSE()
var {b1:b2, cc1} = require('asdadf')

}
var {tt,r:q } = require('t')

`;
export type Body_Type = (Directive | Statement | ModuleDeclaration)
export type Program_Body = Body_Type[]


let program = parseScript(script)

//
function json(_: any) {
	return JSON.stringify(_, null, 3)
}

export function obj_decons(js: JSFile) {
	traverse(program, {
		enter: (node: Node, parent: Node | null) => {
			let body: Program_Body

			function newDeclaration(key: Identifier, value: Identifier, module_specifier: CallExpression): VariableDeclaration {
				return {
					type: "VariableDeclaration",
					declarations: [
						{
							type: "VariableDeclarator",
							init: {
								type: "MemberExpression",
								object: module_specifier,
								property: value,
								computed: false
							},
							id: key
						}],
					kind: "let"
				};
			}

			if (parent) {
				if (parent.type === "Program") {
					body = parent.body
				} else if (parent.type === "BlockStatement") {
					body = parent.body
				}

				if (
					node.type === "VariableDeclaration"
					&& node.declarations[0]
					&& node.declarations[0].type === "VariableDeclarator"
					&& node.declarations[0].id
					&& node.declarations[0].id.type === "ObjectPattern"
					&& node.declarations[0].id.properties//.forEach()
					&& node.declarations[0].init
					&& node.declarations[0].init.type === "CallExpression"
					&& node.declarations[0].init.callee
					&& node.declarations[0].init.callee.type === "Identifier"
					&& node.declarations[0].init.callee.name === "require"
					&& node.declarations[0].init.arguments
					&& node.declarations[0].init.arguments.length === 1
					&& node.declarations[0].init.arguments[0].type === "Literal"

				) {

					let module_specifier: CallExpression = node.declarations[0].init
					let obj: ObjectPattern = node.declarations[0].id
					let decls: VariableDeclaration[] = []
					obj.properties.forEach(v => {
						let key: Identifier, value: Identifier
						if (v.type === "Property"
							&& v.key.type === "Identifier"

						) {
							key = v.key
							value = v.key
							if (!v.shorthand) {
								value = v.value as Identifier;
							}
							decls.push(newDeclaration(key, value, module_specifier))
						}
					})
					let rev = decls.reverse()

					let indexOf = body.indexOf(node)
					rev.forEach(e => {
						body.splice(indexOf, 0, e)
					})
					body.splice(body.indexOf(node), 1)
					// body.forEach(((value:Body_Type , index:number, array:Program_Body) => {
					//
					// }));
				}

			}
			//
			// if (node.type === "VariableDeclaration" && node.declarations[0] && node.declarations[0].type === "VariableDeclarator"
			// 	&& node.declarations[0].id
			// 	&& node.declarations[0].id.type === "ObjectPattern"
			// 	&& node.declarations[0].id.properties//.forEach()
			// 	&& node.declarations[0].init
			// 	&& node.declarations[0].init.type === "CallExpression"
			// 	&& node.declarations[0].init.callee
			// 	&& node.declarations[0].init.callee.type === "Identifier"
			// 	&& node.declarations[0].init.callee.name === "require"
			// 	&& node.declarations[0].init.arguments
			// 	&& node.declarations[0].init.arguments.length === 1
			// 	&& node.declarations[0].init.arguments[0].type === "Literal"
			//
			// ) {
			// 	let _require: CallExpression = node.declarations[0].init
			// 	let obj: ObjectPattern = node.declarations[0].id
			// }
		}
	});

}

// console.log(generate(program))
// console.log( (program))