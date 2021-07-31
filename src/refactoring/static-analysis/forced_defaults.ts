import {traverse} from "estraverse";
import {JSFile} from "../../filesystem/JSFile";

export function forcedDefaults(js:JSFile){
	let intermediate = js.getIntermediate()
	let listOfVars = intermediate.getListOfIDs()
	let reporter = js .getReporter()

	let fromId = intermediate.id_to_ms
	traverse(js.getAST(), {
		enter: (node, parent) => {
			if (node.type === "AssignmentExpression"
				&& node.right.type === "Identifier"
				&& listOfVars.includes(node.right.name)

			) {
				reporter.reportOn().addForcedDefault(js,  fromId[node.right.name], "property_assignment")
 				intermediate.addForcedDefault( node.right.name, "property_assignment" )
			} else if (node.type === "Property"
				&& node.value.type === "Identifier"
				&& listOfVars.includes(node.value.name)
			) {
				reporter.reportOn().addForcedDefault(js,  fromId[node.value.name], "property_assignment")
				intermediate.addForcedDefault( node.value.name, "property_assignment" )
			}
		}
	});
}