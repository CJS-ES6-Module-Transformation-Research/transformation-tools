import {traverse, Visitor, VisitorOption} from "estraverse";
import {VariableDeclarator} from "estree";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {RequireTracker} from "../../../RequireTracker";

export const requireRegistration = (js: JSFile) => {
    let ast = js.getAST()
    let list =[]
    let requireMgr:RequireTracker =js.getRequireTracker()

    let visitor: Visitor = {
        leave: (node, parent) => {
             if (node.type === "VariableDeclaration" && parent.type ==="Program") {
                if (node.declarations
                    && node.declarations[0]
                    && node.declarations[0].type === "VariableDeclarator"
                    && node.declarations[0]) {
                    let declarator: VariableDeclarator = node.declarations[0]
                    let init = declarator.init
                    if (declarator.id.type === "Identifier"
                        && init
                        && init.type === "CallExpression"
                        && init.callee.type === "Identifier"
                        && init.callee.name === "require"
                        && init.arguments
                        && init.arguments[0]
                        && init.arguments[0].type === "Literal"

                    ) {
                        let require_string = init.arguments[0].value.toString()
                        list.push(require_string)
                       try {
                            requireMgr.insert(declarator.id.name, require_string, false)
                        }catch (e) {
                            //should only get here if the code is bad
                           console.log (`Saw ${requireMgr.getIfExists(require_string)} in addition to identifier ${declarator.id.name} for the same module id.`)
                       }
                       return VisitorOption.Remove
                    }
                }
            }
        }
    }

    traverse(ast, visitor)


}
