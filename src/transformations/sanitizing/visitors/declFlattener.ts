import {generate} from "escodegen";
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
import {traverse, Visitor} from "estraverse";
import {TransformFunction} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";

/**.
 * TransformFunction that does Variable Declaration Declarator flattening.
 * @param js the JSFile to transform.
 */
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

                //test to see if flattening is necessary
                if (vdcln.declarations.length > 1) {
                    vdcln.declarations.forEach((decl: VariableDeclarator) => {
                        //add declarator to be flattened.
                        let ls: VariableDeclarator[] = []
                        ls.push(decl)
                        let flat: VariableDeclaration = {
                            kind: vdcln.kind,
                            type: vdcln.type,
                            declarations: ls
                        }

                        //add to flatten decl list.
                        flattened.push(flat)
                    });


                    let body: (Statement | Directive | ModuleDeclaration)[]
                    let pNode: Node;// = parentNode;
                    pNode = (parent as Node)

                    // get body or code block
                    if ("Program" === pNode.type) {
                        body = (pNode as Program).body
                    } else if (pNode.type === "BlockStatement") {
                        body = (pNode as BlockStatement).body
                    } else if (pNode.type === "ForStatement") {
                        return;
                    } else {
                        throw new Error("don't know why it got here ")
                    }


                    // insert back into body array
                    let indexof = body.indexOf((node as Statement | Directive));
                    flattened.reverse().forEach((e ) => {
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
