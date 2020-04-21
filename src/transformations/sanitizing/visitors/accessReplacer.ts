#!/bin/env ts-node
import {Identifier, Literal, Node, VariableDeclaration, VariableDeclarator} from 'estree'
import {traverse, Visitor} from 'estraverse'
import _ from 'lodash'
import {JSFile} from "../../../index";
import {RequireAccessIDs} from "../../../Types";
import {createRequireDecl} from '../../../abstract_representation/es_tree_stuff/astTools';


const lower = 'qwertyuioplkjhgfdsazxcvbnm';
const upper = 'QWERTYUIOPLKJHGFDSAZXCVBNM';
const numeric = '1234567890';
const alphaNumericString: string = `${lower}${upper}${numeric}`

export function accessReplace(js: JSFile) {

    let runTraversal = function () {
        let imports: RequireAccessIDs = {};
        let visitor: Visitor = {
            enter:
                (node: Node, parent: Node) => {
                    if (node.type === 'CallExpression'
                        && node.callee.type === "Identifier"
                        && node.callee.name === "require"&& parent.type !== "VariableDeclarator") {
                        let identifier = extract((node.arguments[0] as Literal).value.toString())
                        if ("CallExpression" === parent.type ||
                            "MemberExpression" === parent.type ||
                            "AssignmentExpression" === parent.type
                            //        isValidParentType(parent)
                        ) {

                            switch (parent.type) {
                                case "CallExpression":
                                    parent.callee = identifier;
                                    return;
                                case "MemberExpression":
                                    parent.object = identifier;
                                    return;
                                case "AssignmentExpression":
                                    parent.right = identifier;
                                    return;
                                // case "VariableDeclarator":
                                //     parent.init = identifier;
                                //     return;
                            }
                        } else if (parent.type === "ExpressionStatement") {
                            return;
                        } else {
                            throw new Error(parent.type)
                        }
                    }else  if (parent === null) {
                        return;
                    }
                    if ((parent.type === "ForStatement" && parent.init.type === "VariableDeclaration"
                        || parent.type === "ForInStatement" && parent.left.type === "VariableDeclaration")
                        && node.type === "VariableDeclaration"
                        && node.declarations.length > 0
                        && ((parent.type === "ForStatement" && node === parent.init)
                            || (parent.type === "ForInStatement" && node === parent.left))

                    ) {
                        node.declarations.forEach((e) => {
                            if (e.init.type === "CallExpression"
                                && e.init.callee.type === "Identifier"
                                && e.init.callee.name === "require"
                                && e.init.arguments && e.init.arguments[0] !== null
                                && e.init.arguments[0].type === "Literal") {

                                let lit = e.init.arguments[0].value.toString()
                                let id = extract(lit);

                                e.init = id;
                            }
                        })
                    }
                }
        }

        function isValidParentType(parent: Node): boolean {
            switch (parent.type) {
                case        'CallExpression':
                case      'MemberExpression':
                case  'AssignmentExpression':
                    // case    "VariableDeclarator":
                    return true;
                default:
                    return false;
            }
        }

        function extract(requireStr: string): Identifier {
            let cleaned = cleanValue(requireStr);
            let idName = `_Import_Access_Variable_for_${cleaned}`
            if (idName === "_Import_Access_Variable_for____lib"||idName === "_Import_Access_Variable_for_fs"){
                throw  new Error()
            }
            imports[requireStr] = idName;
            return {
                type: "Identifier",
                name: idName
            }
        }

        let declaratorVisitor: Visitor = {
            enter: (node: Node, parent: Node) => {
                if (parent === null) {
                    return;
                }
                if ((parent.type === "ForStatement" && parent.init.type === "VariableDeclaration"
                    || parent.type === "ForInStatement" && parent.left.type === "VariableDeclaration")
                    && node.type === "VariableDeclaration"
                    && node.declarations.length > 0
                    && ((parent.type === "ForStatement" && node === parent.init)
                        || (parent.type === "ForInStatement" && node === parent.left))

                ) {
                    node.declarations.forEach((e) => {
                        if (e.init.type === "CallExpression"
                            && e.init.callee.type === "Identifier"
                            && e.init.callee.name === "require"
                            && e.init.arguments && e.init.arguments[0] !== null
                            && e.init.arguments[0].type === "Literal") {

                            let lit = e.init.arguments[0].value.toString()
                            let id = extract(lit);

                            e.init = id;
                        }
                    })
                }
            }
        }

        traverse(js.getAST(), visitor)
        // traverse(js.getAST(), declaratorVisitor)
        return imports;
    }

    let imports = runTraversal();
    populateAccessDecls(imports, js.getAST().body)

}


function populateAccessDecls(reqStrMap: RequireAccessIDs, body: Node[]) {
    for (const reqStr in reqStrMap) {
        let vName: string = reqStrMap[reqStr];
        body.splice(0, 0, createRequireDecl(vName, reqStr, "const"))
    }
}


function cleanValue(requireStr: string): string {
    let replaceDotJS: RegExp = new RegExp(`(\.json)|(\.js)`, 'g')// /[\.js|]/gi
    let illegal: RegExp = new RegExp(`([^${alphaNumericString}_])`, "g"); ///[alphaNumericString|_]/g
    let cleaned = requireStr.replace(replaceDotJS, '');
    cleaned = cleaned.replace(illegal, "_");

    return cleaned;
}





