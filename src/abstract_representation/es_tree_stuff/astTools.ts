import {RequireDeclaration} from "../../abstract_fs_v2/interfaces";


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

export function createRequireDecl(varStr: string, importStr: string, kindStr: "var" | "let" | "const"): RequireDeclaration {
	let varDecl: RequireDeclaration;
	varDecl = {
		type: "VariableDeclaration",
		declarations: [
			{
				type: "VariableDeclarator",
				id: {
					type: "Identifier",
					name: varStr
				}, init: {
					type: "CallExpression",
					callee: {
						type: "Identifier",
						name: "require"
					},
					arguments: [
						{
							type: "Literal",
							value: importStr,
							raw: `'${importStr}'`
						}
					]
				},
			}
		],
		kind: kindStr
	};
	return varDecl;
}






