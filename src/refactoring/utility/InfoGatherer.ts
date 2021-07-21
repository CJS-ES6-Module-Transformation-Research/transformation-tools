// function init(js: JSFile) {
// 	let ast = js.getAST()
// 	let requireMgr: InfoTracker = js.getInfoTracker();
// 	let demap = requireMgr.getDeMap()
// 	let listOfVars: string[] = getListOfVars(requireMgr);
// 	return {ast, requireMgr, demap, listOfVars}
// }


/*export const reqPropertyInfoGather = (js: JSFile) => {
	// let {ast, requireMgr,demap, listOfVars} = init(js)
	// let ast = js.getAST()
	// let requireMgr: InfoTracker = js.getInfoTracker();
	// let demap = requireMgr.getDeMap()
	// let listOfVars: string[] = getListOfVars(requireMgr);
	// let def_aults: ForcedDefaultMap = {}
	//init assume false;
	// listOfVars.forEach(e => def_aults[e] = false)
	// 	// let idTagger = getIdTagger(js.getSequenceNumber())
	// let rpis: { [id: string]: ReqPropInfo } = {};
	// let shadows: ShadowVariableMap = js.getShadows(js.getAST(), listOfVars,idTagger)

	// getReqPropertiesAccessed(ast, listOfVars, def_aults, rpis, \r);
	// getPropsCalledOrAccd(rpis, shadows);

	let forcedDefault =
		getReassignedPropsOrIDs(listOfVars, def_aults, rpis)
	listOfVars.forEach((id: string) => {
		if (!rpis[id]) {
			//if must be default import and no calls or accesses made
			rpis[id] = {
				allAccessedProps: [],
				forceDefault: false,
				potentialPrimProps: [],
				refTypeProps: []
			}
			js.report().addForcedDefault(js, demap.fromId[id], "condition")

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
				def_aults[id] = true;
				js.report().addForcedDefault(js, demap.fromId[id], "condition")

			}
		}

	});
	// let i = 0
	// i++
	for (let id in rpis) {
		let rpi = rpis[id];
		rpi.allAccessedProps.forEach((prop: string) => {
			if (!(rpi.refTypeProps.includes(prop))) {

				rpi.potentialPrimProps.push(prop)

			}
		});

	}




	function gatherShadowedIDs() {
		let fctStack: string[] = [];
	}

	function getPropsCalledOrAccd(): void {
		let ast: Program = js.getAST()
		// let notPrimProps = []
		let fctStack: string[] = [];
		let nameS: string;
		traverse(ast, {
			enter: (node, parent) => {
				switch (node.type) {
					case "FunctionDeclaration": // we're entering a function
						fctStack.push(idTagger(node,parent));
						break;
					case "FunctionExpression": // we're entering a function
						fctStack.push(idTagger(node,parent));
						break;
					case "ArrowFunctionExpression": // we're entering a function
						fctStack.push(idTagger(node,parent));
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



//IS THIS 	PRE - FORCED-DEFAULT PREP??
	let reporter: AbstractReporter = js.getReporter()


	//LOOKS LIKE it loops thru and sets all forced DEFAUTLS
	requireMgr.setReqPropsAccessedMap(rpis);//TODO RECONFIGURE
	let mmp = js.getAPIMap()

	for (let forced in def_aults) {
		if (def_aults[forced]) {

			let specD = demap.fromId[forced]

			mmp.resolveSpecifier(js, specD)
				.setType(API_TYPE.default_only, true)
			assert(mmp.resolveSpecifier(js, specD).getType() === API_TYPE.default_only, `expected set to default`)

		}
		// throw new Error("see above todo ")
	}



}*/



// function createFuncID(node: Node,parent:Node) {
// 	if (node) {
// 		if (node.loc) {
// 		} else {
// 			return generate(node)
// 			// throw new Error('node exists and not node.loc for node: '+generate(node))
//
// 		}
// 	}
// 	return node.loc.start.line + "_" + node.loc.start.column
// }


// export function forcedDefaults(js:JSFile){
// 	let intermediate = js.getIntermediate()
// 		let listOfVars = intermediate.getListOfIDs()
// 	let reporter = js .getReporter()
// 	let forced_defaults = intermediate.getForcedDefaults()
//
// 	let fromId = intermediate.id_to_ms
// 	traverse(js.getAST(), {
// 		enter: (node, parent) => {
// 			if (node.type === "AssignmentExpression"
// 				&& node.right.type === "Identifier"
// 				&& listOfVars.includes(node.right.name)
//
// 			) {
// 				reporter.reportOn().addForcedDefault(js,  fromId[node.right.name], "property_assignment")
// 				forced_defaults[node.right.name] = true;
// 			} else if (node.type === "Property"
// 				&& node.value.type === "Identifier"
// 				&& listOfVars.includes(node.value.name)
// 			) {
// 				reporter.reportOn().addForcedDefault(js,  fromId[node.value.name], "property_assignment")
// 				forced_defaults[node.value.name] = true;
// 			}
// 		}
// 	});
// }
// export function getDeclaredModuleImports(js: JSFile) {
// 	js.getAST().body.forEach(node => {
// 		if (node.type === "VariableDeclaration" && node.declarations
// 			&& node.declarations[0]) {
// 			let decl: VariableDeclarator = node.declarations[0];
// 			if (
// 				decl.init
// 				&& decl.id.type === "Identifier"
// 				&& decl.init.type === "CallExpression"
// 				&& decl.init.callee.type === "Identifier"
// 				&& decl.init.callee.name === "require"
// 				&& decl.init.arguments
// 				&& decl.init.arguments[0]
// 				&& decl.init.arguments[0].type === "Literal"
//
// 			) {
// 				js.getInfoTracker().insertDeclPair(decl.id.name, (decl.init.arguments[0] as SimpleLiteral).value.toString())
// 			}
// 		}
//
// 	})
// 	// traverse(js.getAST(),
// 	// 	{
// 	// 		enter: (node: Node, parent: Node | null) => {
// 	// 			if (node.type === "VariableDeclaration"
// 	// 				&& node.declarations
// 	// 				&& node.declarations[0]
// 	//
// 	// 			) {
// 	// 				let decl: VariableDeclarator = node.declarations[0];
// 	// 				if (
// 	// 					decl.init
// 	// 					&& decl.id.type === "Identifier"
// 	// 					&& decl.init.type === "CallExpression"
// 	// 					&& decl.init.callee.type === "Identifier"
// 	// 					&& decl.init.callee.name === "require"
// 	// 					&& decl.init.arguments
// 	// 					&& decl.init.arguments[0]
// 	// 					&& decl.init.arguments[0].type === "Literal"
// 	//
// 	// 				) {
// 	// 					js.getInfoTracker().insertDeclPair(decl.id.name, (decl.init.arguments[0] as SimpleLiteral).value.toString())
// 	// 				}
// 	// 			}
// 	// 		}
// 	// 	})
// }



