import {Expression, Identifier, SimpleCallExpression, SimpleLiteral} from "estree";
import {id} from "../../abstract_fs_v2/interfaces";
import {cleanMS} from "./helpers";


export interface RequireCall extends SimpleCallExpression {
	callee: Identifier
	arguments: Array<SimpleLiteral>
	getRS:()=>string
	getCleaned:()=>string

}

export function asRequire(node: Expression): RequireCall {
	if (node.type === "CallExpression"
		&& node.callee.type === "Identifier"
		&& node.arguments[0]
		&& node.arguments[0].type === "Literal") {
 return new RequireCallz(node.arguments[0].value.toString() )
	}

	return null;
}

class RequireCallz implements RequireCall {
	private readonly rstring:string
	private readonly cleaned:string

	constructor(rstring: string) {
		this.cleaned = cleanMS(this.rstring)
		this.callee = id('require')
		this.arguments = [{type: "Literal", value: rstring}]
		this.rstring = rstring
	}

	arguments: Array<SimpleLiteral>;
	callee: Identifier;
	type: "CallExpression";

	getRS(): string {
		return this.rstring;
	}
	getCleaned(): string {
		return this.cleaned;
	}

}