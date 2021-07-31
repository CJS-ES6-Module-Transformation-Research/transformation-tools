import {traverse} from "estraverse";
import {Program,Node} from "estree";
import {JSFile} from "../../filesystem/JSFile";
import {ShadowVariableMap} from "../../utility";

// import {} from "../";
 export function getShadowVars(js:JSFile): void {
	let ast: Program =js.getAST()
	let intermediate = js.getIntermediate();
	let listOfVars = Object.keys(intermediate.id_to_ms)
	let idTagger = js.getIdTagger()
	let shadowVarMap: ShadowVariableMap = intermediate.getShadowVars(	 );
	let fctStack: string[] = [];

	traverse(ast, {
		enter: (node, parent) => {
			switch (node.type) {
				case "VariableDeclarator":
					if (node.id.type === "Identifier" && listOfVars.includes(node.id.name) && fctStack.length > 0) { // then, it's a shadow var declaration
						if (!shadowVarMap[node.id.name]) {
							shadowVarMap[node.id.name] = []
						}
						shadowVarMap[node.id.name].push(fctStack[fctStack.length - 1]);
					}
					break;
				case "FunctionDeclaration": // we're entering a function
					fctStack.push(idTagger(node,parent));
					break;
				case "FunctionExpression": // we're entering a function
					fctStack.push(idTagger(node,parent));
					break;
				case "ArrowFunctionExpression": // we're entering a function
					fctStack.push(idTagger(node,parent));
					break;
			}
		}, leave: (node, parent) => {
			switch (node.type) {
				case "FunctionDeclaration": // leaving a function, pop it from the stack
					fctStack.pop();
					break;
				case "FunctionExpression": // leaving a function, pop it from the stack
					fctStack.pop();
					break;
				case "ArrowFunctionExpression": // leaving a function, pop it from the stack
					fctStack.pop();
					break;
			}
		}
	});
}


export function isShadowVariable(varName: string, stack: string[], shadows: ShadowVariableMap,listOfShadowIds: { [id: string]:number[] }) {
	// let retval: boolean = false;
	if (shadows[varName]) {
		stack.forEach(e => {

			if (shadows[varName].includes(e)) {

				if (!listOfShadowIds[varName]){
					listOfShadowIds[varName] = []
				}
				listOfShadowIds[varName].push(parseInt(e))
				return  true;
				// retval = true;
			}
		});
	}
	return false;
}