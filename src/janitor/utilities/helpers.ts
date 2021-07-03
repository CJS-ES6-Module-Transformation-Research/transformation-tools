import {generate} from "escodegen";
import {replace, VisitorOption} from "estraverse";
import {
	AssignmentExpression,
	CallExpression,
	Expression,
	Identifier,
	Literal,
	MemberExpression,
	Node,
	Pattern,
	SourceLocation,
	Statement,
	VariableDeclarator
} from "estree";
import {createRequireDecl, id} from "../../abstract_fs_v2/interfaces";
import {JSFile} from "../../abstract_fs_v2/JSv2";
import {RequireStringTransformer} from "../../transformations/sanitizing/requireStringTransformer";
import {JanitorRequireData} from "../data_management/RequireStringData";
import {requireData} from "../pass0";
import {ExportAssignment, ExportAssignmentStatement, LHSExport} from "./JanitorTypes";


export const JSON_REGEX: RegExp = new RegExp('.+\.json$');


export function cleanRequire(node: CallExpression, js: JSFile) {
	let rst: RequireStringTransformer = js.getRST()
	if (node.callee.type === "Identifier"
		&& node.callee.name === "require"
		&& node.arguments[0].type === "Literal") {
		let literal = node.arguments[0].value.toString()
		let requireString: string = rst.getTransformed(literal)
		if (requireString !== literal) {
			//had to be cleaned
		}


		if (JSON_REGEX.test(requireString)) {
			//was json
			requireString = js.createCJSFromIdentifier(requireString)
		}

		node.arguments[0] = {type: "Literal", value: requireString}
		return requireString
	}
}

export function isARequire(node) {
	return node.type === "CallExpression"
		&& node.callee.type === "Identifier"
		&& node.callee.name === "require";
}

export function isAnExport(node: Node, parent: Node): boolean {
	if (node.type !== "MemberExpression"
		|| parent.type !== "AssignmentExpression") {
		return false
	}

	if (node.object.type === "Identifier" && node.property.type === "Identifier") {
		if (node.object.name === "module") {
			//name = 'default'
		} else if (node.object.name === "exports") {
			//name = node.property.name
		}
	} else if (
		node.object.type === "MemberExpression"
		&& node.object.object.type === "Identifier"
		&& node.object.object.name === "module"
		&& node.object.property.type === "Identifier"
		&& node.object.property.name === "exports"
		&& node.property.type === "Identifier") {

	}
}

export interface ModuleDotExports extends DotExpr {
	object: { type: "Identifier", name: "module" }
	property: { type: "Identifier", name: "exports" }
}

export interface DotExpr extends MemberExpression {
	computed: false
}

export function cleanMS(requireStr: string) {

	let replaceDotJS: RegExp = new RegExp(`(\.json)|(\.js)`, 'g')// /[\.js|]/gi
	let illegal: RegExp = new RegExp(`([^a-zA-Z0-9_\$])`, "g"); ///[alphaNumericString|_]/g
	let cleaned = requireStr.replace(replaceDotJS, '');
	cleaned = cleaned.replace(illegal, "_");
	if (cleaned[0] !== '_') {
		cleaned = '_' + cleaned;
	}
	return cleaned;
}


export const module_dot_exports: (loc?: SourceLocation) => ModuleDotExports = (loc: SourceLocation = undefined) => {
	let retVal: ModuleDotExports = {
		type: "MemberExpression",
		object: {type: "Identifier", name: "module"},
		property: {type: "Identifier", name: "exports"},
		computed: false,
		loc: loc
	}
	return retVal
}

export function cleanRequires(node: Node, parent: Node, rd: { [k: string]: requireData }, data: JanitorRequireData,/* ids: { [p: string]: string },*/ js: JSFile): void {
	let raw: string, _id: string
	let cleaned: string
	if (node.type === "CallExpression" && isARequire(node)) {
		raw = (node.arguments[0] as Literal).value.toString()
		if (parent && parent.type === "VariableDeclarator"
			&& parent.id.type === "Identifier") {
			cleaned = cleanRequire(node, js)
			data.addSpecifier(cleaned, parent.id.name)
			_id = parent.id.name
			// ids[cleanRequire(node, js)] = parent.id.name
			// return VisitorOption.
		} else if (parent && parent.type !== "VariableDeclarator") {
			cleaned = cleanRequire(node, js)
			data.addSpecifier(cleaned)


			// ids[cleaned] = ''; // so it is a key
		} else {

			cleaned = cleanRequire(node, js)
			//case where parent is variabledeclarator and not identifier
			// (handled in pattern flatten)
			// id()return
		}
		if (!_id) {
			_id = cleanMS(raw)
		}
		rd[raw] = {raw, clean: cleaned, id: _id}

	}
}

export function makeAnExportStatement(prop: ModuleDotExports | Identifier, name: Identifier, exportCopy: Identifier): ExportAssignmentStatement {
	let left: LHSExport = {computed: false, object: prop, property: name, type: "MemberExpression"}
	let expression: ExportAssignment = {left, right: exportCopy, type: "AssignmentExpression", operator: "="}
	let exp: ExportAssignmentStatement = {type: "ExpressionStatement", expression}
	return exp
}


export function exportsDot(prop: string): MemberExpression {
	let _retVal: MemberExpression = {
		type: "MemberExpression",
		object: module_dot_exports(),
		property: id(prop),
		computed: false,

	}

	return _retVal
}

function isAnExportRW(node: Node) {
	if (node.type === "MemberExpression") {
		switch (node.object.type) {
			case "MemberExpression":
				break;

			case "Identifier":
				if (node.object.name === "exports"
					&& node.property.type === "Identifier") {

				} else if (node.object.name === "module"
					&& node.property.type === "Identifier"
					&& node.property.name === "exports"
				) {

				} else {

				}
				break;
		}
	}
}

export enum ExportType {
	NAME_SHORTCUT = 'NAME_SHORTCUT',
	NAMED = 'NAMED',
	DEFAULT = 'DEFAULT'

}


export function isModuleDotExports(node: Node): { Type: ExportType, name: string } {
	if (node.type === "MemberExpression" && node.property.type === "Identifier") {
		if (node.object.type === "MemberExpression" && isModuleDotExports(node.object).Type === ExportType.DEFAULT) {
			return {name: node.property.name, Type: ExportType.NAMED}
		} else if (node.object.type === "Identifier") {
			if (node.object.name === "module"
				&& node.property.name === "exports") {
				return {name: '', Type: ExportType.DEFAULT}
			} else if (node.object.name === "Exports") {
				return {name: node.property.name, Type: ExportType.NAME_SHORTCUT}
			}
		}

	}
	return null;
}

export function isModule_Dot_Exports(node: Node): boolean {
	return node.type === "MemberExpression"
		&& node.property.type === "Identifier"
		&& node.property.name === "exports"
		&& node.object.type === "Identifier"
		&& node.object.name === "module"
}


export function memberEx(object: Expression, property: Expression): MemberExpression {
	return {
		computed: false, object, property, type: "MemberExpression"

	}
}

export type EXPORT_INFO = { hasDefault: boolean, hasNamed: boolean, exportNames: { [p: string]: string } }

// export function declare(ident: string|Identifier, value: Expression = undefined): VariableDeclarator {
// 	let _id  = typeof ident == 'string'? id(ident):ident
// 	return {id:_id , init: value|| null, type: "VariableDeclarator"}
// }

export function assign(val: Pattern, expr: Expression): AssignmentExpression {
	return {
		left: val,
		right: expr,
		operator: '=',
		type: "AssignmentExpression"

	}

}

