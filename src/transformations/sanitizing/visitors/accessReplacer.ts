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
    AssignmentProperty, Statement
} from 'estree'
import {traverse, Visitor} from 'estraverse'
import _ from 'lodash'
import {JSFile} from "../../../index";
import {RequireAccessIDs} from "../../../Types";
import {createRequireDecl, isARequire, isExpr} from '../../../abstract_representation/es_tree_stuff/astTools';
import {Namespace} from "../../../abstract_representation/project_representation/javascript/Namespace";
import {generate} from "escodegen";
import {parseScript} from "esprima";


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
                        && node.callee.name === "require" && parent.type) {//!== "VariableDeclarator") {
                        let requireString: string = (node.arguments[0] as Literal).value.toString();
                        if ("CallExpression" === parent.type ||
                            "MemberExpression" === parent.type ||
                            "AssignmentExpression" === parent.type ||
                            ("VariableDeclarator" === parent.type && parent.id.type === "ObjectPattern")) {
                            let identifier = extract(requireString, js.getNamespace())

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
                                        return;
                                    }
                            }
                        } else if (parent.type === "ExpressionStatement"
                            || (parent.type === "VariableDeclarator"
                                && parent.id.type !== "ObjectPattern")) {
                            return;
                        } else {
                            console.log(`unexpected type for  parent: ${parent.type}
                            Node type ${node.type} on require string: ${requireString} : ${imports[requireString]}`)
                        }
                    } else if (parent === null) {
                        return;
                    }
                    if (isForLoopAccess(node, parent)
                        && node.type === "VariableDeclaration"
                    ) {
                        node.declarations.forEach((e: VariableDeclarator) => {
                            extractRequireDataForAccess(e, extract, js);
                        });
                    }
                    // else if (node.type === "VariableDeclaration" || node.type === "ExpressionStatement") {
                    //     if (node.type === "VariableDeclaration" &&
                    //         node.declarations[0].init
                    //         && node.declarations[0].init.type === "CallExpression"
                    //         && node.declarations[0].init.callee.type === "Identifier"
                    //         && node.declarations[0].init.arguments[0].type === "Literal"
                    //         && node.declarations[0].id.type === "ObjectPattern"
                    //     ) {
                    //         let reqString = node.declarations[0].init.arguments[0].value.toString();
                    //         let stmts: Statement[]
                    //         node.declarations[0].id.properties.forEach((e: AssignmentProperty) => {
                    //
                    //             let identifier = extract(reqString, js.getNamespace())
                    //             let vname: Pattern = (e.value ? e.value : e.key) as Pattern;
                    //             let mem: MemberExpression = makeAMembery(identifier, e.key)
                    //             let st: Statement = toAssignOrDecl("VariableDeclaration", vname as Pattern, mem)
                    //             stmts.push(st);
                    //         });
                    //         // if (parent.type === "B")
                    //     }
                    // else if(
                    //     node.type === "ExpressionStatement"
                    //     && node.expression.type === "AssignmentExpression"
                    //     && node.expression.left.type === "ObjectPattern"
                    //     && node.expression.right.type === "CallExpression"
                    //     && node.expression.right.callee.type === "Identifier"
                    //     && node.expression.right.arguments[0].type === "Literal"
                    // ){
                    //     let reqString = node.expression.right.arguments[0].value.toString();
                    //
                    //     let stmts: Statement[]
                    //      node.expression.left.properties.forEach((e: AssignmentProperty) => {
                    //
                    //         let identifier = extract(reqString, js.getNamespace())
                    //         let vname: Pattern = (e.value ? e.value : e.key) as Pattern;
                    //         let mem: MemberExpression = makeAMembery(identifier, e.key)
                    //         let st: Statement = toAssignOrDecl("VariableDeclaration", vname as Pattern, mem)
                    //         stmts.push(st);
                    //     });
                    // }
                    // }
                    // if (parent
                    //     && (node.type === "VariableDeclarator"
                    //         && node.id.type === "ObjectPattern"
                    //         && node.init.type === "CallExpression"
                    //         && node.init.callee.type === "Identifier"
                    //         && node.init.callee.name === "require")
                    //     || (node.type === "ExpressionStatement"
                    //         && node.expression.type === "AssignmentExpression"
                    //         && node.expression.left.type === "ObjectPattern")) {
                    //
                    //
                    //     let rstring: string = '';
                    //
                    //
                    //     if
                    //     (node.type === "VariableDeclarator" && node.id.type === "ObjectPattern"
                    //         && node.init.type === "CallExpression"
                    //         && node.init.callee.type === "Identifier"
                    //         && node.init.callee.name === "require"
                    //         && node.init.arguments[0].type === "Identifier"
                    //     ) {
                    //         rstring = node.init.arguments[0].name
                    //     } else if (node.type === "ExpressionStatement"
                    //         && node.expression.type === "AssignmentExpression"
                    //         && node.expression.left.type === "ObjectPattern"
                    //         && isExpr(node.expression.right.type)
                    //         && node.expression.right.type === "Identifier"
                    //     ) {
                    //         rstring = node.expression.right.name
                    //     } else {
                    //         console.log(`ERROR: sohuld not get here`)
                    //         return;
                    //     }
                    // let jsN = extract(rstring, js.getNamespace())
                    //
                    // let body = (parent.type === "Program") ? parent.body
                    //     : (parent.type === "BlockStatement") ? parent.body : []
                    //
                    // let
                    //     id,
                    //     init;
                    // if (node.type === "VariableDeclarator") {
                    //
                    //     id = node.id as ObjectPattern;
                    //     init = node.init;
                    // } else if (node.expression.type === "AssignmentExpression") {
                    //     id = node.expression.left as ObjectPattern;
                    //     init = node.expression.left;
                    // }
                    //
                    //
                    // let decons: Statement[] = []
                    // let patterns: ObjectPattern = id as ObjectPattern;
                    //
                    // let initializingObject: Expression = init;
                    //
                    // patterns.properties.forEach((prop: AssignmentProperty) => {
                    //     if (prop.type === "Property") {
                    //         // prop.value//always a  patern
                    //         //use with assignment or decl
                    //         let memb = makeAMembery(extract(rstring, js.getNamespace()), prop.key);
                    //         let vname: Pattern = (prop.value ? prop.value : prop.key) as Pattern;// only uses pattern types for this.
                    //         decons.push(toAssignOrDecl("VariableDeclaration", vname as Pattern, memb))
                    //         console.log(`${generate(decons[decons.length - 1])}`)
                    //     }
                    //     ;
                    // });
                    //
                    //     let index = body.indexOf(node as (Statement));
                    //     decons.reverse().forEach(e => body.splice(index, 0, e));
                    //     index = body.indexOf(node as Statement);
                    //     body.splice(index, 1);
                    //     // objs.forEach(obj => {
                    //     //     obj.objPatt.properties.forEach(e=> obj.objPatt.properties.forEach(e:Property=> {
                    //     //         let v = extractObjectData(obj, e)
                    //     //         console.log(generate(v))
                    //     //         body.splice(0, 0, v);
                    //     //     })
                    //     //  });
                    // }
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


        traverse(js.getAST(), visitor)

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
        parent && (parent.type === "ForStatement" && parent.init.type === "VariableDeclaration"
        || parent.type === "ForInStatement" && parent.left.type === "VariableDeclaration")
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
    if ((e.init.type === "CallExpression"
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
