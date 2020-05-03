import {
    AssignmentOperator,
    ExportDefaultDeclaration,
    ExportNamedDeclaration,
    ExportSpecifier,
    Expression,
    Statement,
    VariableDeclaration
} from "estree";
import {ExportInstance} from "../../transformations/export_transformations/visitors/types";

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


