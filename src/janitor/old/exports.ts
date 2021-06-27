import {generate} from "escodegen";
import {parseScript} from "esprima";
import {traverse, VisitorOption} from "estraverse";
import {Expression, Identifier, MemberExpression, Node} from "estree";
type walk = (node: Node, parent:  Node | null) => VisitorOption | Node | void

	export const  moduleDotExports : Identifier = {name:"module.exports", type:"Identifier"}
let analyzeExports = (node:Node, parent:null|Node,names:string[]  )=>{
	let name:string
	if(node.type==="MemberExpression"
		&& node.object.type ==="Identifier"
		&& node.property.type ==="Identifier" && parent) {

		if (node.object.name === "module"
			&& node.property.name === "exports") {

			switch (parent.type){
				case "AssignmentExpression":
					if (parent.left === node){
					name = 'default'
					if (!names.includes(name)) {
						names.push(name)
					}
					parent.left =  moduleDotExports
				}
					break;
				case "MemberExpression":
					if (parent.property.type === "Identifier") {
						name = parent.property.name
					}
					parent.object =  moduleDotExports
 					break;
			}

		}else if(node.object.name === "exports"){
			name = node.property.name
			node.object = moduleDotExports
		}
		if (!names.includes(name)){
			names.push(name)
		}

	}

}

