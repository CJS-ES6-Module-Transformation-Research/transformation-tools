import {traverse, Visitor} from "estraverse";
import {JSFile} from "../../filesystem/JSFile";
import {isShadowVariable} from "./shadow_variables";
import {Node} from 'estree'

function forceDefaults(node, _forcedDefault: { [p: string]: boolean }): void {
	let listOfVars = Object.keys(_forcedDefault)
	switch (node.type) {

		case "LogicalExpression":
			if (node.left.type === "Identifier"
				&& listOfVars.includes(node.left.name)) {
				_forcedDefault[node.left.name] = true;
				// TODO FIXME js.report().addForcedDefault(js, demap.fromId[node.left.name], "condition")
			}
			if (node.right.type === "Identifier"
				&& listOfVars.includes(node.right.name)) {
				// TODO FIXME js.report().addForcedDefault(js, demap.fromId[node.right.name], "condition")
				_forcedDefault[node.right.name] = true;
			}
			break;
		case "UpdateExpression":

			let arg = node.argument
			if (arg.type === "Identifier"
				//TODO ADD TEST FOR THIS
				&& listOfVars.includes(arg.name)) {
				_forcedDefault[arg.name] = true;
				// TODO FIXME js.report().addForcedDefault(js, arg.name, "update")
			}
			break;
		case "ConditionalExpression":
			if (node.consequent.type === "Identifier"
				&& listOfVars.includes(node.consequent.name)) {
				_forcedDefault[node.consequent.name] = true;
				// TODO FIXME 	js.report().addForcedDefault(js, node.consequent.name, "condition")
			}
			if (node.alternate.type === "Identifier"
				&& listOfVars.includes(node.alternate.name)) {

				_forcedDefault[node.alternate.name] = true;
				// TODO FIXME 	js.report().addForcedDefault(js, demap.fromId[node.alternate.name], "condition")
			}


			break;


	}
}


export function getAccessedProperties(js: JSFile): void {
	// let listOfProps = [];
	let intermediate = js.getIntermediate()

	let listOfVars = intermediate.getListOfIDs()
	let ast = js.getAST()
	let shadows = intermediate.getShadowVars()
	let accessed = intermediate.getPropReads()
	let idTagger:(node:Node,parent:Node)=> string = js.getIdTagger()
	let fctStack: string[] = [];
	let _forcedDefault: { [key: string]: boolean } = intermediate.getForcedDefaults()
	let fctStackVisits = (operation: 'enter' | 'leave') => {
		let stackOperator: 'push' | 'pop' = operation === "enter" ? 'push' : 'pop'
		return (node: Node, parent: Node) => {
			let tag
			switch (node.type) {
				case "FunctionDeclaration": // we're entering a function
					 tag = idTagger(node, parent)
					if(stackOperator==='push') {
						fctStack.push(tag);
					}else{
						fctStack.pop();

					}
					break;
				case "FunctionExpression": // we're entering a function
					  tag = idTagger(node, parent)
					if(stackOperator==='push') {
						fctStack.push(tag);
					}else{
						fctStack.pop();
					}				break;
				case "ArrowFunctionExpression": // we're entering a function
					  tag = idTagger(node, parent)
					if(stackOperator==='push') {
						fctStack.push(tag);
					}else{
						fctStack.pop();

					}
					break;

			}
		}
	}
let z:{[s:string]:string[]}={}
	let _stack:Visitor = {
		enter: fctStackVisits('enter'),
		leave: fctStackVisits('leave')
	}
	const propAccessVisitor: Visitor = {
		enter: (node, parent) => {
		_stack.enter(node,parent)
			if (node.type === "MemberExpression"  ) {

			if( node.object.type==="Identifier"&& node.property.type==="Identifier")	{
				let lov=listOfVars.includes(node.object.name)

				let shad=isShadowVariable(node.object.name, fctStack, shadows)
					// console.log(`lov: ${node.object.name} is in lov?  	${listOfVars.includes(node.object.name)}`)
					// console.log(`lov: ${node.property.name} is on ${node.object.name} 	${listOfVars.includes(node.object.name)}`)
					// console.log(`lov: ${node.property.name} is a shadow ${node.object.name} 	${isShadowVariable(node.object.name, fctStack, shadows)}`)
				if(lov && !shad){
					if (!z[node.object.name]){
					z[node.object.name]= []
				}
					z[node.object.name].push(node.property.name )
				}
			}
			if (node.object.type === "Identifier"
					&& node.property.type === "Identifier"
					&& listOfVars.includes(node.object.name)
					&& (!isShadowVariable(node.object.name, fctStack, shadows)//FIXME this has toe end up in it somewhere
					)

					/*containsNode( )*/) {
					let name = node.object.name

					// if (!mapOfRPIs[name]) {
					// 	mapOfRPIs[name] = {
					// 		allAccessedProps: [],//new Set(),
					// 		potentialPrimProps: [],//new Set(),
					// 		refTypeProps: [],//new Set(),
					// 		forceDefault: false
					// 	};
					// }
					if (parent
						&& parent.type === "AssignmentExpression"
						&& parent.left === node
					) {
						// TODO FIXME 	js.report().addForcedDefault(js, demap.fromId[name], 'property_assignment')

						_forcedDefault[name] = true
					}
					// if (!mapOfRPIs[name].allAccessedProps.includes(node.property.name)) {
					// 	mapOfRPIs[name].allAccessedProps.push(node.property.name)
					// }



						// console.log("listOfVars")
						// console.log(listOfVars)
						// let z = listOfVars.includes( name )
						// console.log(node.property.name)
						// let acc =accessed[node.property.name]
						// console.log(node.property.name, 'acc',acc )
						// let yx = !(acc.includes(node.property.name))
						// console.log(name, '  in  ', listOfVars.includes(name))
						// console.log(name, '  in  ', accessed [name])
				if (!accessed[node.object.name]){
					 accessed[node.object.name] = []
				}
				if(!(accessed[node.object.name].includes(node.property.name))){
					accessed[node.object.name].push(node.property.name)
				}

						// if ( !(accessed[name].includes(node.property.name))) {
						// 	accessed[name].push(node.property.name)
						// }


				}

			}
			forceDefaults(node, _forcedDefault);
		}, leave:_stack.leave
	};
	traverse(ast, propAccessVisitor);
	// console.log(JSON.stringify(z,null,3) )






}