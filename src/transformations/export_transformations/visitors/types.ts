import {Expression} from "estree";


enum ExprType {
    EXPR = "Expression",
    IDENTIFIER = "Identifier",
    OBJECT = "ObjectExpression",
    SIMPLE_EXPR = "Expression",
    DECL = "Declaration",
    OTHER = "Other"
}
interface NamedExport {
    name: string
    value: Expression
}
export interface ExportInstance {
    alias: string
    identifier: string
    expr: Expression
    type: string
    isDefault: boolean
}

export interface ExportData {
    names: ExportInstance[]
    hasDefault: boolean
}


export const DEFAULT_EXPORT_STRING: string = '__default_export';