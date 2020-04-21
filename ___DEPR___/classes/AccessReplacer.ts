import {traverse, Visitor, VisitorOption} from "estraverse";
import {RequireAccessIDs} from "../../../Types";
import {CallExpression, Identifier, Literal, Node} from "estree";
import {createRequireDecl} from "../../../depr/ast/AST_Factory";
import {includes} from 'lodash'
import {Walker} from "../../../tools.transformation_tools/Walker";

export class AccessReplacer extends Walker<RequireAccessIDs> {
    constructor() {
        super(false);
    }
    enter = (node: Node, parent: Node) => {
        if (node.type === 'CallExpression') {
            let calleeID = (node.callee as Identifier)
            if ((calleeID.name === 'require') && (parent.type !== "VariableDeclarator")) {
                let identifier: Identifier;
                if ((parent.type === 'CallExpression') || (parent.type === 'MemberExpression') || (parent.type === 'AssignmentExpression')) {
                    identifier = this.extract(node);
                } else if (parent.type === "ExpressionStatement") {
                    return;
                } else {
                    throw new Error(parent.type)
                }

                if (identifier) {
                    switch (parent.type) {
                        case "CallExpression":
                            parent.callee = identifier
                            break;
                        case "MemberExpression":
                            parent.object = identifier
                            break;
                        case "AssignmentExpression":
                            parent.right = identifier
                            break;
                    }
                }
            }
        }
    }

    leave = (node: Node) => {
    }

    private extract(expr: CallExpression): Identifier {
        let requireStr = `${(expr.arguments[0] as Literal).value}`
        let cleaned = '';
        let alphaNum = 'qwertyuioplkjhgfdsazxcvbnm'
        alphaNum += alphaNum.toUpperCase() + '1234567890'

        for (let i = 0; i < requireStr.length; i++) {
            let j = requireStr[i];
            if (!includes(alphaNum, j)) {
                cleaned += '_';
            } else {
                cleaned += j;
            }
        }
        let idName = `_Import_Access_Variable_for_${cleaned}`
        this.data[requireStr] = idName;
        return {
            type: "Identifier",
            name: idName
        }
    }

    postTraversal = () => {
        let body: Node[] = this.js.getAST().body;
        for (const reqStr in this.data) {
            let vName: string = this.data[reqStr];
            body.splice(0, 0, createRequireDecl(vName, reqStr, "const"))
        }
    }
}

