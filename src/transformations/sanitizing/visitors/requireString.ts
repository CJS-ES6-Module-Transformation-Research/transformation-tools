import {isCallExpr, isIdentifier, isLiteral, WrappedVisitor} from "../../../../Types";
import {Identifier, Node, CallExpression} from "estree";
import {RequireStringTransformer} from "../requireStringTransformer";
import {TransformFunction} from '../../Transformer'
import {JSFile} from "../../../abstract_representation/project_representation/JS";
import {Visitor,traverse} from "estraverse";

export const requireStringSanitizer: TransformFunction = function (js: JSFile) {
    let requireStringTF: RequireStringTransformer = new RequireStringTransformer(js.getDir())
    let visitor: Visitor = {
        enter: function (node: Node): void {


            if (node.type === "CallExpression"
                && node.callee.type === "Identifier"
                && node.callee.name === "require"
                && node.arguments[0].type === "Literal") {


                let literal = node.arguments[0]
                let requireString: string = requireStringTF.getTransformed(literal.value.toString())
                literal.value = requireString
                literal.raw = `'${requireString}'`


            }
        }
        // {
        //     let requireStringTF: RequireStringTransformer = new RequireStringTransformer(js.getDir())
        //     let callExpr: CallExpression
        //     let callee:Identifier
        //     if (isCallExpr(node)) {
        //         callExpr = node
        //         if (isIdentifier(callExpr.callee)) {
        //             callee = callExpr.callee
        //             if (callee && isIdentifier(callee) && (callee as Identifier).name === "require") {
        //                 if (isLiteral(callExpr.arguments[0])) {
        //                     let literal = callExpr.arguments[0]
        //                     let requireString: string
        //                     if (literal.value) {//TODO remove? Type changed from Literal to SimpleLiteral -- verify works
        //                         // all literals of this type should have a value field
        //                         requireString = requireStringTF.getTransformed(`${literal.value}`)
        //                         literal.value = requireString
        //                         literal.raw = `'${requireString}'`
        //                     }
        //                 }
        //             }
        //         }
        //
        //     }
        // }
    };
    traverse(js.getAST(),visitor)

}




