import {traverse, Visitor} from 'estraverse'
import {Node, Program} from "estree";
import {SeqNumb} from "../types";

export function createCompare(node: Node, other: Node) {

}

export enum NodeComparators {
	NODE_ID = "$ID$",
	Scope_ID = "$Scope$"
}

interface NodeComparator {
	compare(node: Node, other: Node): boolean

	ID: NodeComparators
}

// interface NumericIDVisitor extends Visitor{
// 	 seq_no:number
// }
type tagger = (node: Node, parent?: Node) => void
// export function
export function getScopeTagger(node: Node, seq:SeqNumb):tagger {
	let key = NodeComparators.Scope_ID

	return function (node: Node, parent: Node): void {

		switch (node.type) {
			case "Program": {
				node[key] = seq.next()
				break;
			}
			case "BlockStatement": {
				if (!parent[key]) {
					parent[key] = seq.next();
				}
			}
		}

	}

}
