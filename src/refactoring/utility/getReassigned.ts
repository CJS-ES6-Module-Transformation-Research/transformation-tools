import assert from "assert";
import {traverse} from "estraverse";
import {Expression, Identifier, Node, Program} from "estree";
import {Reporter} from "../../control";
import { JSFile  } from "../../filesystem/JSFile";
import {Intermediate} from "../../utility/Intermediate";
import {ForcedDefaultMap} from "../../utility/types";

export function getReassignedPropsOrIDs(js: JSFile) {

	let forcedDefault: boolean = false;
	let intermediate: Intermediate = js.getIntermediate()
	let ids = intermediate.getListOfIDs()
	let ast: Program = js.getAST()
	let addFromID = createForcedDefaultReporter(js)

	let _forcedDefault: ForcedDefaultMap = intermediate.getForcedDefaults()
	let from = intermediate.id_to_ms
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
						&& ids.includes((val as Identifier).name)) {
						_forcedDefault[(val as Identifier).name] = true;
						addFromID((val as Identifier).name, 'part of a boolean expression')

					}
					if (node.right.right.type === "Identifier"
						&& ids.includes((val2 as Identifier).name)) {
						_forcedDefault[(val2 as Identifier).name] = true;
						addFromID((val2 as Identifier).name, 'part of a boolean expression')
					}
				} else if (node.right.type === "ConditionalExpression") {
					let val = node.right.consequent
					let val2 = node.right.alternate
					if (node.right.consequent.type === "Identifier"
						&& ids.includes((val as Identifier).name)) {
						_forcedDefault[(val as Identifier).name] = true;

						addFromID((val as Identifier).name, 'part of a ternary operator')
					}
					if (node.right.alternate.type === "Identifier"
						&& ids.includes((val2 as Identifier).name)) {
						_forcedDefault[(val2 as Identifier).name] = true;

						addFromID((val2 as Identifier).name, 'part of a ternary operator')
					}
				}
				//ToDO extract method so i can read this (make sure OREQUALS)
				if (node.left.type === "MemberExpression"
					&& node.left.object.type === "Identifier"
					&& node.left.property.type === "Identifier") {
					let name = node.left.object.name;
					let prop = node.left.property.name;
					if ([name]
					) {
						_forcedDefault[name]
						forcedDefault = true;

					}
				}
			}
			//ToDO extract method so i can read this (make sure OREQUALS)
			if (node.type === "AssignmentExpression"
				&& node.left.type === "MemberExpression"
				&& node.left.object.type === "Identifier"
				&& node.left.property.type === "Identifier") {
				let name = node.left.object.name;
				let prop = node.left.property.name;
				if (_forcedDefault[name]
				) {
					_forcedDefault[name] = true;
					addFromID(name, `property of ${name} reassigned`)
					forcedDefault = true;

				}

			}
			if (node.type === "AssignmentExpression"
				&& node.right.type === "Identifier"
				&& node.right.name
				&& ids.includes(node.right.name)
			) {
				js.getReporter()
					.reportOn()
					.addForcedDefault(js, from [node.right.name], "property_assignment")
				//copy module reference
				assert(node.right.name, "assigned to " + node.right.name)
				_forcedDefault[node.right.name] = true;
			}
			if (node.type === "VariableDeclarator"
				&& node.id.type === "Identifier"
				&& node.init
				&& node.init.type === "Identifier"
				&& node.init.name
				&& ids.includes(node.init.name)
			) {

				js.getReporter().reportOn().addForcedDefault(js, from[node.init.name], "property_assignment")
				_forcedDefault[node.init.name] = true;
			}

			if ((node.type === "CallExpression" || node.type === "NewExpression")
				&& node.arguments
				&& node.arguments.length > 0) {
				node.arguments.forEach(e => {
					if (e.type === "Identifier" && e.name && ids.includes(e.name)) {
						js.getReporter()
							.reportOn()
							.addForcedDefault(js, from[e.name], "property_assignment")
						_forcedDefault[e.name] = true;
					}
				})
			}
		},
	});
	return forcedDefault;
}

function createForcedDefaultReporter(js: JSFile) {

	return function addFromID(id: string, reason: string = js.getRelative()) {
		js.getReporter()
			.addSingleLine(Reporter.forcedDefault)
			.data[js.getAPIMap().resolve(js.getIntermediate().id_to_ms[id], js)] = reason

	}
}