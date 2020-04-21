import {
    ArrayPattern,
    AssignmentOperator, AssignmentPattern,
    ExportDefaultDeclaration,
    ExportNamedDeclaration,
    ExportSpecifier,
    Expression, Identifier, MemberExpression, ObjectPattern, RestElement,
    Statement, VariableDeclaration
} from "estree";
import {ExportInstance} from "../../transformations/export_transformations/visitors/exportCollector";
import {JPP} from "../../../../index";

export function createNamedAssignment(named: string, assignable: Expression, op: AssignmentOperator = "="): Statement {
    return {
        type: "ExpressionStatement",
        expression: {
            type: "AssignmentExpression",
            operator: op,
            left: {
                type: "MemberExpression",
                computed: false,
                object: {
                    type: "MemberExpression",
                    computed: false,
                    object: {
                        type: "Identifier",
                        name: "module"
                    },
                    property: {
                        type: "Identifier",
                        name: "exports"
                    }
                },
                property: {
                    type: "Identifier",
                    name: named
                }
            },
            right: assignable
        }
    };

}




export function createAnExport(exp: ExportInstance): ExportDefaultDeclaration | ExportNamedDeclaration {


    if (exp.isDefault) {

        // let typeX = getAType(exp)
        return {
            type: "ExportDefaultDeclaration",
            declaration: {
                type: "Identifier",
                name: exp.alias
            }
        }
    } else {
        return {
            type: "ExportNamedDeclaration",
            declaration: createVarDecl(),
            specifiers: [createSpecifier()],
            source: null //todo verify source can be null
        }
    }
    return null;

    function createSpecifier(): ExportSpecifier {
        return {
            type: "ExportSpecifier",
            exported: {type: "Identifier", name: exp.identifier},
            local: {type: "Identifier", name: exp.alias}
        }
    }

    function createVarDecl(): VariableDeclaration {
        return {
            declarations: [{type: "VariableDeclarator", id: {type: "Identifier", name: exp.alias}, init: exp.expr}],
            kind: "const",
            type: "VariableDeclaration"
        }

    }
}

export function walkPatternToIdentifier(node: (Identifier | ObjectPattern | ArrayPattern | RestElement |
    AssignmentPattern | MemberExpression), ids: Set<string>) {
    switch (node.type) {
        case "ArrayPattern":
            node.elements.forEach((e) => walkPatternToIdentifier(e, ids))
            break;
        case "AssignmentPattern":
            walkPatternToIdentifier(node.left, ids)
            break;
        case "Identifier":
            ids.add(node.name);
            break;
        case "ObjectPattern":
            node.properties.forEach((e) => {
                if (e.type === "Property") {
                    walkPatternToIdentifier(e.value, ids)
                } else {
                    walkPatternToIdentifier(e, ids)
                }
            })
            break;
        case "RestElement":
            walkPatternToIdentifier(node.argument, ids)
            break;
        case "MemberExpression":
            if (node.object.type === "Identifier") {
                ids.add(node.object.name)
            } else if (node.object.type === "MemberExpression") {
                walkPatternToIdentifier(node.object, ids)
            }
    }
}

