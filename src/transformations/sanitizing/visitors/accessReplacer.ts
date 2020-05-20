#!/bin/env ts-node
import {
    Identifier,
    Literal,
    Node,
    VariableDeclaration,
    VariableDeclarator,
    ObjectPattern,
    ArrayPattern,
    RestElement,
    AssignmentPattern,
    MemberExpression,
    AssignmentExpression,
    Pattern,
    Expression,
    Property,
    AssignmentProperty,
    Statement,
    FunctionDeclaration,
    FunctionExpression,
    ArrowFunctionExpression,
    ForStatement,
    BaseNode, CallExpression, SimpleCallExpression, Super, SpreadElement
} from 'estree'
import {replace, traverse, Visitor} from 'estraverse'
import _ from 'lodash'
import {JSFile} from "../../../index";
import {RequireAccessIDs} from "../../../Types";
import {createRequireDecl, isExpr} from '../../../abstract_representation/es_tree_stuff/astTools';
import {Namespace} from "../../../abstract_representation/project_representation/javascript/Namespace";
import {generate} from "escodegen";
import {parseScript} from "esprima";


const lower = 'qwertyuioplkjhgfdsazxcvbnm';
const upper = 'QWERTYUIOPLKJHGFDSAZXCVBNM';
const numeric = '1234567890';
const alphaNumericString: string = `${lower}${upper}${numeric}`

/**
 * TransformFunction to replace 'accesses' of require calls.
 * @param js the JSFile to transform.
 */
export function accessReplace(js: JSFile) {

    let runTraversal = function () {
        let imports: RequireAccessIDs = {};
        let visitor: Visitor = {
            leave:
                (node: Node, parent: Node | null) => {
                    if (isARequire(node) && parent.type) {
                        let require: Require = node as Require
                        let requireString: string = (require.arguments[0] as Literal).value.toString();
                        //gets the appropriate identifier for the require for a require string access variable.
                        let identifier = extract(requireString, js.getNamespace())

                            //check is call expression and not single-identifier declarator
                        if ("CallExpression" === parent.type ||
                            "MemberExpression" === parent.type ||
                            "AssignmentExpression" === parent.type ||
                            ("VariableDeclarator" === parent.type && parent.id.type === "ObjectPattern")) {


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
                                case "VariableDeclarator":
                                    if (parent.id.type === "ObjectPattern") {
                                        parent.init = identifier
                                    } else {
                                        return node;
                                    }
                            }
                        } else {
                            switch (parent.type) {
                                case "NewExpression":
                                case "IfStatement":
                                case"WhileStatement":
                                case"DoWhileStatement":
                                case "ForStatement":
                                case "LogicalExpression":
                                case  "ConditionalExpression":
                                case "SwitchCase":
                                    return identifier;
                                    break;
                                case "FunctionDeclaration" :
                                case "FunctionExpression" :
                                case "ArrowFunctionExpression":

                                    //not needed here because parent would be body
                                    break;
                                case"VariableDeclarator":
                                    return;
                                default://TODO run thru types again
                                    return;
                            }

                        }
                    } else if (parent === null) {
                        return;
                    }
                    //if there is a variable declaration of any type inside a for loop
                    if (isForLoopAccess(node, parent)
                        && node.type === "VariableDeclaration"
                    ) {
                         node.declarations.forEach((e: VariableDeclarator) => {
                             extractRequireDataForAccess(e, extract, js);
                        });
                    }
                }
        }

        function extract(requireStr: string, ns: Namespace): Identifier {
            let cleaned = cleanValue(requireStr);
            let idName = `_moduleAccess_${cleaned}`
            let identifier: Identifier;
            if (imports[requireStr] === undefined) {
                identifier = ns.generateBestName(idName);
                // identifier = {type:"Identifier", name:imports[requireStr]}
                imports[requireStr] = identifier.name;
            } else {
                identifier = {type: "Identifier", name: imports[requireStr]}
            }
            return identifier;
        }


        replace(js.getAST(), visitor)
        js.getAST().body.forEach(e =>{
            traverse(e, {
                enter:(node, parent) => {
                    if (parent !==  null  &&  node.type === "VariableDeclaration"){
                        node.declarations.forEach(e=> {
                            extractRequireDataForAccess(e, extract, js);
                        })
                    }
                }
            })
        });
        return imports;
    }

    let imports = runTraversal();
    populateAccessDecls(imports, js.getAST().body)

}


function populateAccessDecls(reqStrMap: RequireAccessIDs, body: Node[]) {
    let reverse: VariableDeclaration[] = []
    for (const reqStr in reqStrMap) {
        let vName: string = reqStrMap[reqStr];
        reverse[reqStr] = vName;
        reverse.push(createRequireDecl(vName, reqStr, "const"))
    }
    reverse.reverse().forEach(e => {
        body.splice(0, 0, e)
    })

}


function cleanValue(requireStr: string): string {
    let replaceDotJS: RegExp = new RegExp(`(\.json)|(\.js)`, 'g')// /[\.js|]/gi
    let illegal: RegExp = new RegExp(`([^${alphaNumericString}_])`, "g"); ///[alphaNumericString|_]/g
    let cleaned = requireStr.replace(replaceDotJS, '');
    cleaned = cleaned.replace(illegal, "_");

    return cleaned;
}


function getRequireStringFromDecl(node: VariableDeclarator) {
    if (node.init.type === "CallExpression"
        && node.init.callee.type === "Identifier"
        && node.init.callee.name === "require"
        && node.init.arguments && node.init.arguments[0] !== null
        && node.init.arguments[0].type === "Literal") {
        return node.init.arguments[0].value.toString();
    }
}

function isForLoopAccess(node: Node, parent: Node) {
    return ((
        parent && (parent.type === "ForStatement" && parent.init && parent.init.type === "VariableDeclaration"
        || parent.type === "ForInStatement" && parent.left&&parent.left.type === "VariableDeclaration")
        && node.type === "VariableDeclaration"
        && node.declarations.length > 0
        && ((parent.type === "ForStatement" && node === parent.init)
        || (parent.type === "ForInStatement" && node === parent.left))));

}

function extractObjectData(oPatt, obj: (Identifier | ObjectPattern | ArrayPattern | RestElement |
    AssignmentPattern | MemberExpression | AssignmentExpression)) {
    let key = (oPatt.obj as Property).key as (Identifier | ObjectPattern | ArrayPattern | RestElement |
        AssignmentPattern | MemberExpression | AssignmentExpression) as Pattern;

    let val = obj// (oPatt.obj as Property).value
    let vd: VariableDeclarator = {
        type: "VariableDeclarator",
        id: key,
        init: val as Expression
    }
    let vn: VariableDeclaration = {
        type: "VariableDeclaration",
        kind: "const",
        declarations: [vd]

    }
    return vn;
}

function extractRequireDataForAccess(e: VariableDeclarator, extract: (requireStr: string, ns: Namespace) => Identifier, js: JSFile) {
     if (( e.init && e.init.type === "CallExpression"
        && e.init.callee.type === "Identifier"
        && e.init.callee.name === "require"
        && e.init.arguments && e.init.arguments[0] !== null
        && e.init.arguments[0].type === "Literal")) {
        let id = extract(getRequireStringFromDecl(e), js.getNamespace());
         e.init = id;
    }
}


function toAssignOrDecl(typeName: string, id: Pattern, value: MemberExpression): Statement {
    if (typeName === "ExpressionStatement") {
        let as: AssignmentExpression = {
            type: "AssignmentExpression",
            left: id,
            right: value,
            operator: "="
        };
        return {
            type: "ExpressionStatement",
            expression: as
        }

    } else if (typeName === "VariableDeclaration") {
        let variableDeclarator: VariableDeclarator = {
            type: "VariableDeclarator",
            id: id,
            init: value
        }
        return {
            type: "VariableDeclaration",
            kind: "const",
            declarations: [variableDeclarator],
        }
    } else {
        throw new Error("unexpected state");
    }
}


function makeAMembery(objID: Expression, propID: Expression): MemberExpression {
    return {
        type: "MemberExpression",
        computed: false,
        object: objID,
        property: propID
    }
}

interface Require extends SimpleCallExpression {
    callee: { type: "Identifier", name: "require" }
    arguments: Array<Literal>
}

function isARequire(node: Node): boolean {
    return node.type === "CallExpression"
        && node.callee.type === "Identifier"
        && node.callee.name === "require";
}