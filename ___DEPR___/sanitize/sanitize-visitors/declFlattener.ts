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
import {visitor} from '../../Types'
export let leaveFlatten: visitor = (node: Node, parentNode): void => {
    let vdcln: VariableDeclaration
    let flattened: (Statement | VariableDeclaration)[] = []
    if (parentNode!== null && parentNode .type === "ForStatement") {
        //todo if CONTAINS REQUIRE not doable ??
        return;
    }
    if (node.type === 'VariableDeclaration') {
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
                console.log(flat)
                flattened.push(flat)
            });
            let body: (Statement | Directive | ModuleDeclaration)[]
            let pNode: Node;// = parentNode;
            // @ts-ignore
            pNode = (parentNode as Node)

            if ("Program" === pNode.type) {
                body = (pNode as Program).body
            } else if (pNode.type === "BlockStatement") {
                body = (pNode as BlockStatement).body
            } else if (pNode.type === "ForStatement") {
                //todo if CONTAINS REQUIRE not doable ??
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