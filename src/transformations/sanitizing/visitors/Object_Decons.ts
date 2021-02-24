import {generate} from "escodegen";
import {parseScript} from 'esprima'
import {traverse} from "estraverse";
import {Identifier, Node, VariableDeclaration, VariableDeclarator} from 'estree'
import {writeFileSync} from "fs";

let script: string = `
var {a , x:y} = require('module')
var ident = require('module').prop
`;


let program = parseScript(script)

//
traverse(program, {
	enter: (node: Node, parent: Node | null) => {
		if (node.type === "VariableDeclaration" && node.declarations[0] && node.declarations[0].type === "VariableDeclarator"
			&& node.declarations[0].id
			&& node.declarations[0].id.type === "ObjectPattern"
			&& node.declarations[0].id.properties//.forEach()
&& node.declarations[0].init
&& node.declarations[0].init.type==="CallExpression"
&& node.declarations[0].init.callee
&& node.declarations[0].init.callee.type==="Identifier"
&& node.declarations[0].init.callee.name==="require"
			&& node.declarations[0].init.arguments
&& node.declarations[0].init.arguments.length===1
&& node.declarations[0].init.arguments[0].type==="Literal"

 		) {
			let decls :VariableDeclarator[] = [];
let Mod_Spec:string=node.declarations[0].init.arguments[0]. value.toString()
			node.declarations[0].id.properties.forEach(
				(prop) => {
					if (prop.type === "Property") {
						let key: string = '';
						let value: string = '';
						if (prop.key && prop.key.type === "Identifier") {
							key = prop.key.name
						}
						if (prop.value && prop.value.type === "Identifier") {
							value = prop.value.name
						}
						if (!value) {
							value = key
						}
						// let vd
						console.log(`key:${key} -> value: ${value}`)
						decls.push(supplier(value,key, Mod_Spec))
					}
				})
			if (parent.type==="Program"){
				let indexof = parent.body.indexOf(node)
				decls.forEach((e)=>{
					let vdn:VariableDeclaration={type:"VariableDeclaration",declarations:[e],kind:node.kind }
					parent.body.splice(indexof,0, vdn  )
				} )
				parent.body.splice(parent.body.indexOf(node),1)
			}
			// console.log(`key:${parent.type} -> value:  X`)
		}
	}
});
writeFileSync('./deleteme.js', JSON.stringify(program.body, null, 4))
let AS_THIS, MODULE_SPECIFIER, NAME_FROM_EXPORT

function supplier(AS_THIS, NAME_FROM_EXPORT,MODULE_SPECIFIER): VariableDeclarator {
	let id0:Identifier = {type:"Identifier", name: NAME_FROM_EXPORT }
	return {type: "VariableDeclarator", id: {type:"Identifier",name:AS_THIS}, init:{type:"MemberExpression",computed:false,
			object:{type:"CallExpression",arguments:[{type:"Literal",value:MODULE_SPECIFIER}],callee:{type:"Identifier", name:"require"}}
	, property:id0
		}};
	// return
	// {
	// 	type:"VariableDeclarator",
	// 		id:
	// 	{
	// 		type
	// 			:
	// 			"Identifier",
	// 				name : AS_THIS
	// 	} ,
	// 	init : {
	// 		type : "MemberExpression",
	// 				computed : 	false,
	// 			object :
	// 		{
	// 			type 	: 	"CallExpression",
	// 					callee :
	// 			{
	// 				type : "Identifier",
	// 						name :
	// 				"require"
	// 			}
	// 		,
	// 			arguments:
	// 				[
	// 					{
	// 						type: "Literal",
	// 						value: `${MODULE_SPECIFIER}`
	// 					}
	// 				]
	// 		} 	,
	// 		property :
	// 		{
	// 			type
	// 				:
	// 				"Identifier",
	// 					name:
	// 			NAME_FROM_EXPORT
	// 		}
	// 	}
	// };
}
console.log(generate( program))