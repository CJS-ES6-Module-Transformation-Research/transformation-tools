import assert from "assert";
import {generate} from "escodegen";
import {traverse} from "estraverse";
import {Expression, Identifier, Node, Program, SimpleLiteral, VariableDeclarator} from "estree";
import {JSFile} from "./abstract_fs_v2/JSv2.js";
import {Reporter} from "./abstract_fs_v2/Reporter";
import {InfoTracker} from "./InfoTracker.js";
 import {API_TYPE} from "./transformations/export_transformations/API";
// import list = Mocha.reporters.Base.list;
// import {__dirnameHandlerPlusPlus, hasLocationVar__} from './transformations/sanitizing/visitors/__dirname';

// function containsNode(nodelist: Node[], n: Node): boolean {
// 	let retVal = false;
// 	nodelist.forEach(v => {
// 		if (v.type == n.type && generate(v) == generate(n)) {
// 			retVal = true;
// 		}
// 	});
// 	return retVal;
// }
export const reqPropertyInfoGather = (js: JSFile) => {

	let ast = js.getAST()
	let requireMgr: InfoTracker = js.getInfoTracker();
	let demap = requireMgr.getDeMap()
	let listOfVars: string[] = getListOfVars(requireMgr);
	let def_aults: ForcedDefaultMap = {}
	//init assume false;
	listOfVars.forEach(e => def_aults[e] = false)

 	// console.log(`list of vars:  ${listOfVars}`)
	let rpis: { [id: string]: ReqPropInfo } = {};
	let shadows: ShadowVariableMap = getShadowVars(js.getAST(), listOfVars)

	getReqPropertiesAccessed(ast, listOfVars, def_aults, rpis, shadows);
	getPropsCalledOrAccd(ast, rpis, shadows);

	let forcedDefault = getReassignedPropsOrIDs(ast, listOfVars, def_aults, rpis)
	// if (forcedDefault){
	// 	js.getApi().setType(API_TYPE.default_only, true)
	// }
	// requireMgr.setForcedDecl(forcedDefault)

	listOfVars.forEach((id: string) => {
		if (!rpis[id]) {
			//if must be default import and no calls or accesses made
			// console.log("NOD IDS FOR ID: " + id)
			rpis[id] = {
				allAccessedProps: [],
				forceDefault: false,
				potentialPrimProps: [],
				refTypeProps: []
			}
			// def_aults[id] = true;
			js.report().addForcedDefault(js, demap.fromId[id],"condition")

		} else {

			// console.log(`rpis of id: ${id}`)
			let rpi = rpis[id];
			rpi.allAccessedProps.forEach((prop: string) => {
				if (!rpi.refTypeProps.includes(prop)) {
					rpi.potentialPrimProps.includes(prop);
				}
			});
			if (rpi[id] !== undefined
				&& (((!rpi[id].allAccessedProps)) || rpi[id].allAccessedProps.length === 0)
				&& ((!(rpi[id].refTypeProps)) || rpi[id].refTypeProps.length === 0)
				&& ((!(rpi[id].potentialPrimProps)) || rpi[id].potentialPrimProps.length === 0)
			) {
				console.log('all props null ')
				def_aults[id] = true;
				js.report().addForcedDefault(js, demap.fromId[id], "condition")

			}
		}

	});


	for (let id in rpis) {
		let rpi = rpis[id];
		rpi.allAccessedProps.forEach((prop: string) => {
			if (!(rpi.refTypeProps.includes(prop))) {
				rpi.potentialPrimProps.push(prop)
				// console.log(prop)
			}
		});

	}

	function isShadowVariable(varName: string, stack: string[], shadows: ShadowVariableMap) {
		let retval: boolean = false;
		if (shadows[varName]) {
			// console.log(`${varName}: ${shadows[varName]}`)
			stack.forEach(e => {
				if (shadows[varName].includes(e)) {
					retval = true;
				}
			});
		}
		// return retval;
		return false;
	}


	function getReqPropertiesAccessed(ast: Program, listOfVars: string[], _forcedDefault: ForcedDefaultMap, mapOfRPIs: { [id: string]: ReqPropInfo }, shadows: ShadowVariableMap): void {
		// let listOfProps = [];
		let fctStack: string[] = [];

		traverse(ast, {
			enter: (node, parent) => {
				switch (node.type) {
					case "FunctionDeclaration": // we're entering a function
						fctStack.push(createFuncID(node));
						break;
					case "FunctionExpression": // we're entering a function
						fctStack.push(createFuncID(node));
						break;
					case "ArrowFunctionExpression": // we're entering a function
						fctStack.push(createFuncID(node));
						break;

					case "LogicalExpression":
						if (node.left.type === "Identifier"
							&& listOfVars.includes(node.left.name)) {
							_forcedDefault[node.left.name] = true;
							js.report().addForcedDefault(js, demap.fromId[node.left.name],"condition")
						}
						if (node.right.type === "Identifier"
							&& listOfVars.includes(node.right.name)) {
							js.report().addForcedDefault(js,demap.fromId[node.right.name], "condition")
							_forcedDefault[node.right.name] = true;
						}
						break;
					case "ConditionalExpression":
						if (node.consequent.type === "Identifier"
							&& listOfVars.includes(node.consequent.name)) {
							_forcedDefault[node.consequent.name] = true;
							js.report().addForcedDefault(js,node.consequent.name, "condition")
						}
						if (node.alternate.type === "Identifier"
							&& listOfVars.includes(node.alternate.name)) {

							_forcedDefault[node.alternate.name] = true;
							js.report().addForcedDefault(js, demap.fromId[node.alternate.name],"condition")
						}
						break;
					case "VariableDeclaration":
						let decl = node.declarations[0]
						if (decl.init
							&& decl.init.type === "Identifier"
							&& listOfVars.includes(decl.init.name)
							&& decl.id.type === "ObjectPattern"
						) {
							throw new Error('todo?')
						}
						break;
					case "MemberExpression":
						// console.log(node.object);
						if (node.object.type === "Identifier"
							&& node.property.type === "Identifier"
							&& listOfVars.includes(node.object.name)
							&& (!isShadowVariable(node.object.name, fctStack, shadows)//FIXME this has toe end up in it somewhere
							)

							/*containsNode( )*/) {
							// console.log(node.object.type)
							// listOfProps.push( node);
							let name = node.object.name

							if (!mapOfRPIs[name]) {
								mapOfRPIs[name] = {
									allAccessedProps: [],//new Set(),
									potentialPrimProps: [],//new Set(),
									refTypeProps: [],//new Set(),
									forceDefault: false
								};
							}
							if (parent
								&& parent.type === "AssignmentExpression"
								&& parent.left === node
							) {
								// console.log(`FORCED_DEFAULT:  ${name} in _ `)
								js.report().addForcedDefault(js, demap.fromId[name],'property_assignment')

								_forcedDefault[name] = true
							}
							if (!mapOfRPIs[name].allAccessedProps.includes(node.property.name)) {
								mapOfRPIs[name].allAccessedProps.push(node.property.name)
							}

						}
						break;
					// case "VariableDeclaration": {
					// 	if (
					// 		node.declarations[0]
					// 		&& node.declarations[0].id.type === "ObjectPattern"
					// 		&& node.declarations[0].init
					// 		&& node.declarations[0].init.type === "Identifier"
					// 	) {
					// 		let name:string =  node.declarations[0].init.name;
					// 		if (listOfVars.includes(name)) {
					// 			if (!mapOfRPIs[name]) {
					// 				mapOfRPIs[name] = {
					// 					allAccessedProps: [],//new Set(),
					// 					potentialPrimProps: [],//new Set(),
					// 					refTypeProps: [],//new Set(),
					// 					forceDefault: false,
					// 					aliasedProps:Specifier[]
					// 				};
					// 			}
					// 			node.declarations[0].id.properties.forEach((prop: Property | RestElement) => {
					//
					// 				if (prop.type === "Property" && prop.value.type === "Identifier") {
					// 					let key, val
					// 					let spec:Specifier
					// 					if (prop.shorthand) {
					// 						val = prop.value;
					// 						spec = {local:val, imported:val}
					// 					} else if (prop.key.type === "Identifier") {
					// 						val = prop.value
					// 						key = prop.key
					// 						spec = {local:val, imported:key}
					// 					}
					// 				}
					// 			});
					// 		}
					//
					// 	}
					// }
					// 	break;
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
		// return listOfProps;
	}

	interface Specifier {
		local: Identifier
		imported: Identifier
	}

	function getPropsCalledOrAccd(ast: Program, mapOfRPIs: { [id: string]: ReqPropInfo }, shadows: ShadowVariableMap): void {
		// let notPrimProps = []
		let fctStack: string[] = [];
		let nameS: string;
		traverse(ast, {
			enter: (node, parent) => {
				switch (node.type) {
					case "FunctionDeclaration": // we're entering a function
						fctStack.push(createFuncID(node));
						break;
					case "FunctionExpression": // we're entering a function
						fctStack.push(createFuncID(node));
						break;
					case "ArrowFunctionExpression": // we're entering a function
						fctStack.push(createFuncID(node));
						break;
					case "MemberExpression":
						if (node.object.type == "MemberExpression"
							&& node.object.object.type == "Identifier"
							&& node.property.type == "Identifier"
							&& node.object.property.type === "Identifier"
							&& !isShadowVariable(node.object.object.name, fctStack, shadows)) {

							nameS = node.object.object.name;
							let key = node.object.property.name
							let value = node.property.name

							if (mapOfRPIs[nameS] && mapOfRPIs[nameS].allAccessedProps.includes(key)) {
								// containsNode(mapOfRPIs[nameS].listOfAllPropsAccessed, node.object)) {
								// notPrimProps.push( node.object);
								if (!mapOfRPIs[nameS].refTypeProps.includes(key)) {
									mapOfRPIs[nameS].refTypeProps.push(key);
								}
							}
						}
						break;
					case "NewExpression": {
						if (node.callee.type == "MemberExpression"
							&& node.callee.object.type == "Identifier"
							&& node.callee.property.type == "Identifier"
							&& !isShadowVariable(node.callee.object.name, fctStack, shadows)
						) {

							nameS = node.callee.object.name;
							if (mapOfRPIs[nameS] && mapOfRPIs[nameS].allAccessedProps.includes(node.callee.property.name)) {
								// notPrimProps.push( node.callee);
								if (!mapOfRPIs[nameS].refTypeProps.includes(node.callee.property.name)) {
									mapOfRPIs[nameS].refTypeProps.push(
										node.callee.property.name);
								}
							}
						}
						break;
					}
					case "CallExpression": {
						if (node.callee.type == "MemberExpression"
							&& node.callee.object.type == "Identifier"
							&& node.callee.property.type == "Identifier"
							&& !isShadowVariable(node.callee.object.name, fctStack, shadows)
						) {

							nameS = node.callee.object.name;
							if (mapOfRPIs[nameS] && mapOfRPIs[nameS].allAccessedProps.includes(node.callee.property.name)) {
								// notPrimProps.push( node.callee);
								if (!mapOfRPIs[nameS].refTypeProps.includes(node.callee.property.name)) {
									mapOfRPIs[nameS].refTypeProps.push(
										node.callee.property.name);
								}
							}
						}
						break;
					}
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
		// return notPrimProps;
	}


	function getReassignedPropsOrIDs(ast: Program, listofVarse, _forcedDefault: ForcedDefaultMap, mapOfRPIs: { [id: string]: ReqPropInfo }) {
		let forcedDefault: boolean = false;

		traverse(ast, {
			enter: (node: Node, parent: Node | null) => {
				if (node.type === "AssignmentExpression") {
					// if (node.right.type === "")
					let right: Expression = node.right
					let seen = false// todo maybe use to implement expresion children with logical grandparents
					// traverse(left,)

					traverse(right, {
						enter: (e: Node, p: Node | null) => {
							if ((e.type === "Identifier" && p) && (p.type === "LogicalExpression" || p.type === "ConditionalExpression")) {
								let name = e.name

							}
						}, leave: () => {
						}
					})
					if (node.right.type === "LogicalExpression") {

						let val = node.right.left
						let val2 = node.right.right
						if (node.right.left.type === "Identifier"
							&& listofVarse.includes((val as Identifier).name)) {
							_forcedDefault[(val as Identifier).name] = true;
							addFromID((val as Identifier).name, 'part of a boolean expression')
						}
						if (node.right.right.type === "Identifier"
							&& listofVarse.includes(val2 as Identifier)) {
							_forcedDefault[(val2 as Identifier).name] = true;
							addFromID((val2 as Identifier).name, 'part of a boolean expression')
						}
					} else if (node.right.type === "ConditionalExpression") {
						let val = node.right.consequent
						let val2 = node.right.alternate
						if (node.right.consequent.type === "Identifier"
							&& listofVarse.includes((val as Identifier).name)) {
							_forcedDefault[(val as Identifier).name] = true;

							addFromID((val as Identifier).name, 'part of a ternary operator')
						}
						if (node.right.alternate.type === "Identifier"
							&& listofVarse.includes(val2 as Identifier)) {
							_forcedDefault[(val2 as Identifier).name] = true;

							addFromID((val2 as Identifier).name, 'part of a ternary operator')
						}
					}
					if (node.left.type === "MemberExpression"
						&& node.left.object.type === "Identifier"
						&& node.left.property.type === "Identifier") {
						let name = node.left.object.name;
						let prop = node.left.property.name;
						if (mapOfRPIs[name]
						) {
							forcedDefault = true;

						}
					}
				}
				if (node.type === "AssignmentExpression"
					&& node.left.type === "MemberExpression"
					&& node.left.object.type === "Identifier"
					&& node.left.property.type === "Identifier") {
					let name = node.left.object.name;
					let prop = node.left.property.name;
					if (mapOfRPIs[name]
					) {
						_forcedDefault[name] = true;
						addFromID(name, `property of ${name} reassigned`)
						forcedDefault = true;
						// console.log (`---reassigned prop ${name} ${mapOfRPIs[name]}`)
						// console.log (`----- ${name} ${generate(node)}`)

					}

				}
				if (node.type === "AssignmentExpression"
					&& node.right.type === "Identifier"
					&& node.right.name
					&& listOfVars.includes(node.right.name)
				) {
					js.getReporter().reportOn().addForcedDefault(js,demap.fromId[node.right.name], "property_assignment")
					//copy module reference
					assert(node.right.name, "assigned to " + node.right.name)
					_forcedDefault[node.right.name] = true;
				}
				if (node.type === "VariableDeclarator"
					&& node.id.type === "Identifier"
					&& node.init
					&& node.init.type === "Identifier"
					&& node.init.name
					&& listOfVars.includes(node.init.name)
				) {

					js.getReporter().reportOn().addForcedDefault(js,demap.fromId[node.init.name], "property_assignment")
					_forcedDefault[node.init.name] = true;
				}

				if ((node.type === "CallExpression" || node.type === "NewExpression")
					&& node.arguments
					&& node.arguments.length > 0
				) {
					node.arguments.forEach(e => {
						if (e.type === "Identifier" && e.name && listOfVars.includes(e.name)) {


							js.getReporter().reportOn().addForcedDefault(js, demap.fromId[e.name],"property_assignment")
							_forcedDefault[e.name] = true;
						}
					})
				}
			},
		});
		return forcedDefault;
	}

	function addFromID(id: string, reason: string = js.getRelative()) {
		js.getReporter()
			.addSingleLine(Reporter.forcedDefault)
			.data[js.getAPIMap().resolve(requireMgr.getDeMap().fromId[id], js)] = reason

	}


	let reporter: Reporter = js.getReporter()

	traverse(ast, {
		enter: (node, parent) => {
			if (node.type === "AssignmentExpression"
				&& node.right.type === "Identifier"
				&& listOfVars.includes(node.right.name)

			) {
				reporter.reportOn().addForcedDefault(js, demap.fromId[node.right.name],"property_assignment")
				def_aults[node.right.name] = true;
			} else if (node.type === "Property"
				&& node.value.type === "Identifier"
				&& listOfVars.includes(node.value.name)
			) {
				reporter.reportOn().addForcedDefault(js, demap.fromId[node.value.name],"property_assignment")
				def_aults[node.value.name] = true;
			}
		}
	});


	requireMgr.setReqPropsAccessedMap(rpis);
	let mmp = js.getAPIMap()

	for (let forced in def_aults) {
		if (def_aults[forced]) {

			let specD = demap.fromId[forced]


			// mmp.createOrSet(js, specD, (a) => {
			// }, API_TYPE.default_only, true)
			if (js.getRelative().includes('formatter.test')) {
				console.log(`setting forced def of ${specD}`)
			}
			mmp.resolveSpecifier(js, specD)
				.setType(API_TYPE.default_only, true)
			assert(mmp.resolveSpecifier(js, specD).getType() === API_TYPE.default_only, `expected set to default`)

			// let resolved = mmp.resolve(specD,js)
			// js.getReporter().addSingleLine(Reporter.forcedDefault).data[resolved] = js.getRelative()
			// console.log(specD)
			// js.forceDefault(mmp.resolveSpecifier(specD.))//TODO
		}
		// throw new Error("see above todo ")
	}
}

interface ShadowVariableMap {
	[id: string]: string[]
}

function createFuncID(node: Node) {
	if (node){
		if (node.loc){
		}else{
			return generate(node)
			// throw new Error('node exists and not node.loc for node: '+generate(node))

		}
	}
	return node.loc.start.line + "_" + node.loc.start.column
}

function getShadowVars(ast: Program, listOfVars: string[]): ShadowVariableMap {
	let shadowVarMap: ShadowVariableMap = {};
	let fctStack: string[] = [];
	traverse(ast, {
		enter: (node, parent) => {
			switch (node.type) {
				case "VariableDeclarator":
					if (node.id.type == "Identifier" && listOfVars.includes(node.id.name) && fctStack.length > 0) { // then, it's a shadow var declaration
						if (!shadowVarMap[node.id.name]) {
							shadowVarMap[node.id.name] = []
						}
						shadowVarMap[node.id.name].push(fctStack[fctStack.length - 1]);
					}
					break;
				case "FunctionDeclaration": // we're entering a function
					fctStack.push(createFuncID(node));
					break;
				case "FunctionExpression": // we're entering a function
					fctStack.push(createFuncID(node));
					break;
				case "ArrowFunctionExpression": // we're entering a function
					fctStack.push(createFuncID(node));
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
	return shadowVarMap;
}

export interface ReqPropInfo {
	forceDefault: boolean;
	allAccessedProps: string[];
	refTypeProps: string[];
	potentialPrimProps: string[];
}

interface ForcedDefaultMap {
	[id: string]: boolean
}

export function getDeclaredModuleImports(js: JSFile) {
	traverse(js.getAST(),
		{
			enter: (node: Node, parent: Node | null) => {
				if (node.type === "VariableDeclaration"
					&& node.declarations
					&& node.declarations[0]

				) {
					let decl: VariableDeclarator = node.declarations[0];
					if (
						decl.init
						&& decl.id.type === "Identifier"
						&& decl.init.type === "CallExpression"
						&& decl.init.callee.type === "Identifier"
						&& decl.init.callee.name === "require"
						&& decl.init.arguments
						&& decl.init.arguments[0]
						&& decl.init.arguments[0].type === "Literal"

					) {
						// console.log(generate(decl))
						js.getInfoTracker().insertDeclPair(decl.id.name, (decl.init.arguments[0] as SimpleLiteral).value.toString())
						// console.log(`${decl.id.name}    ${decl.init.arguments[0].value.toString()} `)
					}
				}
			}
		})
}


//protect data
export function getListOfVars(infoTracker: InfoTracker) {
	// console.log("LIST OF VARS: ")
	let idVars: string[] = []
	let ids = infoTracker.getDeMap().fromId
	for (let id in ids) {
		idVars.push(id)
		// console.log(id)
	}
	return idVars
}


