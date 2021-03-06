import {traverse, Visitor} from "estraverse";
import {Node, SimpleLiteral} from "estree";
import {JSFile} from "../../../filesystem/JSFile";
import {TransformFunction} from "../../../utility/types";
import {RequireStringTransformer} from "../../../refactoring/utility/requireStringTransformer";


/**
 * Require string sanitizer visitor. Type of TransformFunction.
 * @param js a JSFile
 */
export const requireStringSanitizer: TransformFunction = function (js: JSFile) {
	// let requireStringTF: RequireStringTransformer = new RequireStringTransformer(dirname(js.getAbsolute()), js.getParent().getPackageJSON().getMain())
	let re: RegExp = new RegExp('.+\.json$');
	let rst: RequireStringTransformer = new RequireStringTransformer(js)
	let dataRep = js.getReporter().addMultiLine('require_count').data
	let _json_req = js.getReporter().addMultiLine('json_requires').data
	dataRep[js.getRelative()] = []
	_json_req[js.getRelative()] = []
	let report = js.report()
	let visitor: Visitor = {
		enter: function (node: Node): void {


			if (node.type === "CallExpression"
				&& node.callee.type === "Identifier"
				&& node.callee.name === "require"
				&& node.arguments[0].type === "Literal") {
				let literal: SimpleLiteral = (node.arguments[0] as SimpleLiteral)
				report.addARequire(js)
				let requireString: string = rst.getTransformed(literal.value.toString()) //requireStringTF.getTransformed(literal.value.toString(),js.getParent())
				dataRep[js.getRelative()].push(requireString)
				if (requireString !== literal.value.toString()) {
					report.addSaniRequire(js)
				}

				if (re.test(requireString)) {
					requireString = js.createCJSFromIdentifier(requireString)
					_json_req[js.getRelative()].push(requireString)
					report.addJSONRequire(js, requireString)
				}

				node.arguments[0] = {type: "Literal", value: requireString}
			}
		}
	};
	traverse(js.getAST(), visitor)
}

