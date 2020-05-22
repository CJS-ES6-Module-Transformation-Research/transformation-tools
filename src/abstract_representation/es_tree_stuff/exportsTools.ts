import {
    AssignmentOperator,
    ExportDefaultDeclaration,
    ExportNamedDeclaration,
    ExportSpecifier,
    Expression,
    Statement,
    VariableDeclaration
} from "estree";

export interface ExportInstance {
    alias: string
    identifier: string
    expr: Expression
    type: string
    isDefault: boolean
}

//
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


