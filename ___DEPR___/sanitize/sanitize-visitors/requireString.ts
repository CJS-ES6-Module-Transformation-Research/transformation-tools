import {AstFile, isCallExpr, isIdentifier, isLiteral, WrappedVisitor} from "../../Types";
import {Identifier, Node} from "estree";
import {RequireStringTransformer} from "../../../src/tools/sanitize_tools/requireStringTransformer";

export let requireStringSanitizer: WrappedVisitor = function (astFile: AstFile) {
    console.log('called')
    return {
        enter: function (node: Node): void {
            let requireStringTF: RequireStringTransformer = new RequireStringTransformer(astFile.dir)
            let callExpr
            let callee
            if (isCallExpr(node)) {
                callExpr = node
                if (isIdentifier(callExpr.callee)) {
                    callee = callExpr.callee
                    if (callee && isIdentifier(callee) && (callee as Identifier).alias === "require") {
                        if (isLiteral(callExpr.arguments[0])) {
                            let literal = callExpr.arguments[0]
                            let requireString: string
                            if (literal.value) {//TODO remove? Type changed from Literal to SimpleLiteral -- verify works
                                // all literals of this type should have a value field
                                let tmp = literal.value
                                requireString = requireStringTF.getTransformed(`${literal.value}`)
                                literal.value = requireString
                                literal.raw = `'${requireString}'`
                            }
                        }
                    }
                }

            }
        }
    }
}




