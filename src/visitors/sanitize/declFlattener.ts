import {
    BlockStatement,
    Directive,
    ModuleDeclaration,
    Node,
    Program,
    Statement,
    VariableDeclaration,
    VariableDeclarator
} from "estree";
import {TransformFunction} from "../../tools/transformation_tools/Transformer";
import {JSFile} from "../../filesystem/JS";
import {traverse, Visitor} from "estraverse";


export const flattenDecls: TransformFunction = function (js: JSFile) {


    let leaveFlatten: Visitor = {
        leave: (node: Node, parent: Node): void => {
            let vdcln: VariableDeclaration
            let flattened: (Statement | VariableDeclaration)[] = []
            if (parent !== null && parent.type === "ForStatement") {
                return; //handled elsewhere
            }
            if (node.type === 'VariableDeclaration' ) {
                vdcln = (node as VariableDeclaration)

                if (vdcln.declarations.length > 1) {
                    vdcln.declarations.forEach((decl: VariableDeclarator) => {

                        let ls: VariableDeclarator[] = []
                        ls.push(decl)
                        let flat: VariableDeclaration = {
                            kind: vdcln.kind,
                            type: vdcln.type,
                            declarations: ls
                        }
                        flattened.push(flat)
                    });
                    let body: (Statement | Directive | ModuleDeclaration)[]
                    let pNode: Node;// = parentNode;
                    pNode = (parent as Node)

                    if ("Program" === pNode.type) {
                        body = (pNode as Program).body
                    } else if (pNode.type === "BlockStatement") {
                        body = (pNode as BlockStatement).body
                    } else if (pNode.type === "ForStatement") {
                        return;
                    } else {
                        throw new Error("don't know why it got here ")
                    }
                    let indexof = body.indexOf((node as Statement | Directive));
                    flattened.reverse().forEach((e) => {
                            body.splice(indexof, 0, e)
                        }
                    )
                    indexof = body.indexOf((node as Statement | Directive));
                    body.splice(indexof, 1)
                }
            }
        }
    };
    traverse(js.getAST(), leaveFlatten);
}