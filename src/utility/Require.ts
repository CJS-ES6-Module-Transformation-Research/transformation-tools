import {
	Expression,
	ExpressionStatement,
	Identifier,
	SimpleCallExpression,
	SimpleLiteral,
	VariableDeclaration,
	VariableDeclarator
} from "estree";
import {cleanMS, id} from "./factories";


export interface RequireDeclaration extends VariableDeclaration {
	declarations: [RequireDeclarator];
}

export interface RequireDeclarator extends VariableDeclarator {
	id: Identifier;
	init: { type: "CallExpression", callee: Identifier, arguments: [SimpleLiteral] }
}

export interface RequireExpression extends ExpressionStatement {
	type: "ExpressionStatement"
	expression: { type: "CallExpression", callee: Identifier, arguments: [SimpleLiteral] }
}


interface RequireID extends Identifier {
	name: "require"
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
							value: importStr
						}
					]
				},
			}
		],
		kind: kindStr
	};
	return varDecl;
}

export interface RequireCall extends SimpleCallExpression {
	callee: Identifier
	arguments: Array<SimpleLiteral>
	getRS: () => string
	getCleaned: () => string

}
export {RequireCall as Require}
export function asRequire(node: Expression): RequireCall {
	if (node.type === "CallExpression"
		&& node.callee.type === "Identifier"
		&& node.arguments[0]
		&& node.arguments[0].type === "Literal") {
		return new RequireCallz(node.arguments[0].value.toString())
	}

	return null;
}

class RequireCallz implements RequireCall {
	private readonly rstring: string
	private readonly cleaned: string

	constructor(rstring: string) {
		this.rstring = rstring
		this.arguments = [{type: "Literal", value: rstring}]
		this.cleaned = cleanMS(this.rstring)
		this.callee = id('require')
	}

	arguments: Array<SimpleLiteral>;
	callee: Identifier;
	type: "CallExpression" = "CallExpression"

	getRS(): string {
		return this.rstring;
	}

	getCleaned(): string {
		return this.cleaned;
	}

}