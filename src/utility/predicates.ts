import {Node} from "estree";
import {ExportType} from "./types";

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

export function isExpr(val: string): boolean {
	switch (val) {
		case     "ThisExpression":
		case       "ArrayExpression":
		case       "ObjectExpression":
		case       "FunctionExpression":
		case    "ArrowFunctionExpression":
		case       "YieldExpression":
		case      "Literal":
		case       "UnaryExpression":
		case  "UpdateExpression":
		case       "BinaryExpression":
		case     "AssignmentExpression":
		case      "LogicalExpression":
		case          "MemberExpression":
		case            "ConditionalExpression":
		case       "CallExpression":
		case            "NewExpression":
		case            "SequenceExpression":
		case            "TemplateLiteral":
		case       "TaggedTemplateExpression":
		case           "ClassExpression":
		case           "MetaProperty":
		case            "Identifier":
		case     "AwaitExpression":
		case     "ImportExpression":
			return true;
		case "ObjectPattern":
		case "ArrayPattern":
		case "AssignmentPattern":
		case "RestElement":
			return false;
		default:
			throw new Error(` unreachable code. type is ${val}`);
	}
}