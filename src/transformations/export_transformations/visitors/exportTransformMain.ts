// test_resources.import {JSFile} from "../../../abstract_representation/project_representation";
import {generate} from "escodegen";
import {parseScript} from "esprima";
import {Visitor, VisitorOption} from "estraverse";
import {
	AssignmentExpression,
	Directive,
	Expression,
	ExpressionStatement,
	Identifier,
	MemberExpression,
	ModuleDeclaration,
	Node,
	ObjectExpression,
	Statement,
	VariableDeclaration, VariableDeclarator
} from "estree";
import {TransformFunction} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";

const module_dot_exports: ObjectExpression = {
	type: "ObjectExpression",
	properties: []
};
// 	MemberExpression = {
// 	type: "MemberExpression",
// 	object: {type: "Identifier", name: "module"},
// 	property: {type: "Identifier", name: "exports"},
// 	computed: false
// }


export function createVarDeclFromNameVal(best: string, rhs: Expression): VariableDeclaration {
	return {
		type: "VariableDeclaration",
		kind: 'var',
		declarations: [{
			type: "VariableDeclarator",
			id: {type: "Identifier", name: `${best}`},
			init: rhs
		}]
	};
}

export const transformBaseExports = (js: JSFile) => {

	const namespace = js.getNamespace();
	let __default:Identifier = null;
	// let _hasCreatedDefault: Identifier = namespace.generateBestName('defaultExport');
	// let hasCreatedDefault: Identifier = _hasCreatedDefault
	function getDefault(){
		if (!__default){

			console.log('getdefault called ')
			__default = namespace.generateBestName('defaultExport');
			console.log(__default.name)

		}
	}

	const info = js.getInfoTracker()
	let exType = info.getExportType()
	const exportBuilder = js.getExportBuilder(exType);

	// function processClassOrFunction(assignmentNode:AssignmentExpression) {
	//
	// 	if (assignmentNode.right.id) {
	// 		console.log(assignmentNode.right.id.name)
	// 		let declaration: FunctionDeclaration | ClassDeclaration
	// 		declaration = assignmentNode.right.type === "FunctionExpression" ? {
	// 			async: assignmentNode.right.async,
	// 			type: "FunctionDeclaration",
	// 			body: assignmentNode.right.body,
	// 			id: assignmentNode.right.id,
	// 			params: assignmentNode.right.params,
	// 			generator: assignmentNode.right.generator
	// 		} : {
	// 			id: assignmentNode.right.id,
	// 			body: assignmentNode.right.body,
	// 			type: "ClassDeclaration",
	// 			superClass: assignmentNode.right.superClass
	// 		};
	// 		hasCreatedDefault = declaration.id
	// 		return {node: declaration}
	// 	} else {
	// 		hasCreatedDefault = _hasCreatedDefault
	// 		assignmentNode.left = hasCreatedDefault;
	// 	}
	//
	// 	exportBuilder.registerDefault(hasCreatedDefault)
	// 	return;
	// }


	let leave = (node: (Directive | Statement | ModuleDeclaration)): TypeSafeReturn => {

		let assignmentNode: AssignmentExpression;

		if (node.type === "ExpressionStatement" &&
			node.expression.type === "AssignmentExpression") {

			assignmentNode = node.expression;

			if (node.expression.left.type === "MemberExpression"
				&& node.expression.left.object.type === "Identifier"
				&& node.expression.left.property.type === "Identifier"
				&& node.expression.left.object.name === 'module'
				&& node.expression.left.property.name === 'exports') {
				console.log('direct assign')
				exportBuilder.clear();

				if(assignmentNode.right.type ==="ObjectExpression"){
					exportBuilder.registerObjectLiteral(assignmentNode.right)
					return {option: VisitorOption.Remove}
				}else{
					getDefault()
					exportBuilder.registerDefault(__default)
					assignmentNode.left = __default
				}
				// switch (assignmentNode.right.type) {
				//
				// 	// case   "FunctionExpression":
				// 	// 	return processClassOrFunction(assignmentNode);
				// 	//
				// 	// case "ClassExpression":
				// 	// 	return processClassOrFunction(assignmentNode);
				//
				//
				// 	case "ObjectExpression": {
				// 		console.log('_flag')
				// 		console.log(generate(assignmentNode.right))
				//
				// 		exportBuilder.clear();
				// 		exportBuilder.registerObjectLiteral(assignmentNode.right)
				// 		return {option: VisitorOption.Remove}
				// 		//return;
				// 	}
				//
				// 	default: {
				// 		assignmentNode.left = __default
				// 		// console.log('2x')
				// 		// hasUsedDefault = true;
				// 		//
				// 		// return {
				// 		// 	node: {
				// 		// 		type: "ExpressionStatement",
				// 		// 		expression: {
				// 		// 			type: "AssignmentExpression",
				// 		// 			left: hasCreatedDefault,
				// 		// 			right: assignmentNode.right,
				// 		// 			operator: "="
				// 		//
				// 		// 		}
				// 		// 	}
				// 		//
				// 		//
				// 		// }
				// 		// // return unNamedDefaultExport(assignmentNode);
				//
				// 	}
				// }
				// return;
				//
				// 	if (assignmentNode.right.id
				// 		&& assignmentNode.right.id) {
				// 		let short: FunctionExpression|FunctionDeclaration = assignmentNode.right;
				//
				//
				//
				// 		let FD: FunctionDeclaration = ;
				// 		name = assignmentNode.right.id.name
				// 		hasCreatedDefault = assignmentNode.right.id
				// 		// exportBuilder.registerName({exported_name: name, local_alias: name})
				// 		exportBuilder.registerDefault({name: name, type: "Identifier"})
				// 		return {node: FD}
				// 	}else{
				// 		assignmentNode.left = hasCreatedDefault;
				// 		exportBuilder.registerDefault(hasCreatedDefault)
				// 	}
				// 	break;
				// case   "ClassExpression":
				// 	if (assignmentNode.right.id) {
				// 		let decl: ClassDeclaration = {
				// 			id: assignmentNode.right.id,
				// 			body: assignmentNode.right.body,
				// 			type: "ClassDeclaration",
				// 			superClass: assignmentNode.right.superClass
				// 		};
				//
				// 		name = assignmentNode.right.id.name
				// 		hasCreatedDefault = assignmentNode.right.id
				// 		exportBuilder.registerDefault(hasCreatedDefault)
				// 		return {node: decl}// {type:"ExpressionStatement", expression:assignmentNode.right} ;
				// 	}else{
				// 		assignmentNode.left = hasCreatedDefault;
				// 		exportBuilder.registerDefault(hasCreatedDefault)
				// 		return
				// 	}
				// 	break;


			} else if (assignmentNode.left.type === "MemberExpression") {

				let memex: MemberExpression = assignmentNode.left;
				assignmentNode = assignmentNode = node.expression;


				//module
				if ((memex.object.type === "MemberExpression"
						&& memex.object.object.type === "Identifier"
						&& memex.object.property.type === "Identifier"
						&& memex.object.object.name === "module"
						&& memex.object.property.name === "exports"
						&& memex.property.type === "Identifier"

					) ||
					(memex.object.type === "Identifier"
						&& memex.property.type === "Identifier"
						&& memex.object.name === "exports")) {
					if (__default) {
						assignmentNode.left = {
							type: "MemberExpression",
							object: __default,
							property: memex.property,
							computed: false
						};
					} else {
						return extractFromNamespace(memex.property.name, assignmentNode.right)
					}
				}
				// else if (memex.object.type === "Identifier"
				// 	&& memex.property.type === "Identifier"
				// 	&& memex.object.name === "exports") {
				//
				// 	return extractFromNamespace(memex.property.name, assignmentNode.right)
				//
				// }
			}


		}

	}


	function extractFromNamespace(name: string, rhs: Expression): TypeSafeReturn {
		if (rhs.type === "Identifier") {
			exportBuilder.registerName({
					type: "ExportSpecifier",
					exported: {type: "Identifier", name: name},
					local: rhs
				}
			)
			return {option: VisitorOption.Remove};
		} else {
			let previousName = exportBuilder.getByName(name);
			if (previousName) {
				let reassignment: ExpressionStatement = {
					type: "ExpressionStatement",
					expression: {
						type: "AssignmentExpression",
						left: previousName.local,
						right: rhs,
						operator: '='
					}
				}
				return {node: reassignment}//reassignment;
			} else {
				const _best = namespace.generateBestName(name)
				const best = _best.name
				namespace.addToNamespace(best);
				exportBuilder.registerName({
						type: "ExportSpecifier",
						exported: {type: "Identifier", name: name},
						local: _best
					}
				)
				return {node: createVarDeclFromNameVal(best, rhs)};
			}

		}
	}

	// function processClassOrFunction(assignmentNode: AssignmentExpression) {
	//
	// 	let retVal: TypeSafeReturn;
	// 	const funcOrClassExpr = assignmentNode.right;
	// 	if ((funcOrClassExpr.type === "ClassExpression"
	// 			|| funcOrClassExpr.type === "FunctionExpression"
	// 		)
	// 		&&
	// 		funcOrClassExpr.id) {
	// 		console.log(funcOrClassExpr.id.name)
	//
	// 		if (namespace.containsName(funcOrClassExpr.id.name)) {
	// 			let _name = namespace.generateBestName(funcOrClassExpr.id.name)
	// 			let exSpec = {type: "ExportSpecifier", local: _name, exported: funcOrClassExpr.id.name}
	// 			assignmentNode.left = _name;
	// 			hasCreatedDefault = _name;
	// 		} else {
	// 			hasCreatedDefault = funcOrClassExpr.id
	// 			retVal = {
	// 				node:
	// 					(funcOrClassExpr.type === "FunctionExpression" ? {
	// 						async: funcOrClassExpr.async,
	// 						type: "FunctionDeclaration",
	// 						body: funcOrClassExpr.body,
	// 						id: funcOrClassExpr.id,
	// 						params: funcOrClassExpr.params,
	// 						generator: funcOrClassExpr.generator
	// 					} : {
	// 						id: funcOrClassExpr.id,
	// 						body: funcOrClassExpr.body,
	// 						type: "ClassDeclaration",
	// 						superClass: funcOrClassExpr.superClass
	// 					})
	// 			};
	// 		}
	//
	//
	// 	} else {
	// 		hasUsedDefault = true;
	// 		hasCreatedDefault = _hasCreatedDefault
	// 		assignmentNode.left = hasCreatedDefault;
	// 	}
	//
	// 	exportBuilder.registerDefault(hasCreatedDefault)
	// 	return retVal;
	// }


	// function getDefaultName() {
	// 	if (!namespace.containsName(hasCreatedDefault.name)) {
	// 		namespace.addToNamespace(hasCreatedDefault.name)
	// 	}
	// 	//FIXME deprecated
	// 	// namespace.addToNamespace(defExpt.name)
	//
	// 	//ok
	// 	exportBuilder.registerDefault(hasCreatedDefault);
	// 	return hasCreatedDefault;
	// }


	let toDelete = []
	let body = js.getAST().body
	body.forEach((node, index, array) => {
		// console.log(JSON.stringify(array,null,3))
		let val
			= leave(node);
		// console.log(val)
		if (val !== undefined) {
			// console.log(' undefined '+index)
			if (val && val.option && val.option === VisitorOption.Remove) {
				// console.log(' delete '+index)
				toDelete.push(node);
			} else if (val.node) {
				// console.log(' node ')
				array[index] = val.node
			}
		}
	})

	toDelete.forEach(e => {
		body.splice(body.indexOf(e), 1)
	});
	let shouldAddObjLit:boolean = false;

	const declarator:VariableDeclarator ={
		type:"VariableDeclarator",
			id:__default,
	}
	if (shouldAddObjLit){
		declarator.init= {
			type:"ObjectExpression",
			properties:[]
		}
	}
	const toAdd:VariableDeclaration = {
		type:"VariableDeclaration",
		kind:"var",
		declarations:[declarator]
	}
	if (__default) {
		console.log (`adding ${toAdd} to top`)
		js.addToTop(toAdd);
	}
	js.registerAPI()
}

interface TypeSafeReturn {
	node?: (Directive | Statement | ModuleDeclaration)
	option?: VisitorOption
}


const moduleExportsAccess: TransformFunction = (js: JSFile) => {
	const exportBuilder = null // = js.getExportBuilder(info.getExportType());
	const namespace = js.getNamespace();
	let visitor: Visitor = {
		leave: (node: Node, parent: Node | null) => {
			if (node.type === "MemberExpression") {
				if (parent && parent.type === "MemberExpression") {
					if (

						parent.object === node

						//TODO WORK ON AND VERIFY
						&& node.object.type === "Identifier" // module
						&& node.property.type === "Identifier" //exports
						&& node.object.name === 'module'
						&& node.property.name === 'exports') {
						let parentProperty: Expression = parent.property
						let id: Identifier;
						switch (parentProperty.type) {
							case "MemberExpression":
								id = parentProperty.property.type === "Identifier"
									? parentProperty.property : null
								break;
							case "Identifier":
								id = parentProperty;
								break;

							case "NewExpression":
							case "CallExpression":
								id = parentProperty.callee.type === "Identifier" ?
									parentProperty.callee : null

								break;
						}
						if (id) {
							return exportBuilder.getByName(id.name)
						} else {
							throw new Error('unhandled edge case: parent type is: ' + parentProperty.type)
						}

						//todo determine how to differentiate default exports
					} else {
						let name: string;
						if (node.object.type === "MemberExpression" //nesting--node.object is module.exports
							&& node.object.object.type === "Identifier" //module
							&& node.object.property.type === "Identifier" //exports
							&& node.object.object.name === "module"
							&& node.object.property.name === "exports"
							&& node.property.type === "Identifier" //name

						) {
							//TODO check the name against namespace and exports
							name = node.property.name;
						} else if (node.object.type === "Identifier"
							&& node.property.type === "Identifier"
							&& node.object.name === "exports"
							&& ((parent && parent.type !== "MemberExpression") || !parent)) {
							name = node.property.name;
						}
						let byName: Identifier = exportBuilder.getByName(name)
						if (name && byName) {

							return byName;
						}

					}
				} else {
					return exportBuilder.getDefaultIdentifier()
				}
			}


		}
	};


}


//module access test vals (+)

let str = JSON.stringify(parseScript(`
if (module.exports){}
module.exports
let v = module.exports
module.exports()
new module.exports()

if(module.exports.x){}
module.exports.x
new module.exports.x() 
module.exports.x()
module.exports.x(c)
module.exports.x.y
`).body, null, 4)
// console.log(str)


