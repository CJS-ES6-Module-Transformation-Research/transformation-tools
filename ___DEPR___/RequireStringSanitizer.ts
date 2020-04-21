// import {RequireStringTransformer} from "../src/transformations/sanitizing/requireStringTransformer";
// import {CallExpression, Identifier, Node} from 'estree'
// import {Walker} from "./Walker";
//
//
// export class RequireStringSanitizer extends Walker<null> {
//     constructor() {
//         super(false);
//     }
//
//     enter = (node: Node) => {
//         console.log("enter")
//
//         let requireStringTF: RequireStringTransformer = new RequireStringTransformer(this.js.getDir())
//         if (node.type === "CallExpression"
//             && node.callee.type === "Identifier"
//             && node.callee.name === "require"
//             && node.arguments[0].type === "Literal") {
//
//
//             let literal = node.arguments[0]
//             let requireString: string = requireStringTF.getTransformed(literal.value.toString())
//             literal.value = requireString
//             literal.raw = `'${requireString}'`
//
//
//         }
//     };
//     leave = (node: Node, parent: Node) => {
//     }
//     postTraversal = () => {
//     }
//
// }