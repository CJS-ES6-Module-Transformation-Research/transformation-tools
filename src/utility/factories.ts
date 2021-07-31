import {
    AssignmentExpression,
    CallExpression, ExportDefaultDeclaration, ExportNamedDeclaration, ExportSpecifier,
    Expression,
    Identifier, ImportDeclaration, ImportSpecifier,
    Literal,
    MemberExpression,
    Pattern, SimpleLiteral,
    SourceLocation,
    VariableDeclarator
} from "estree";
import {JSFile} from "../filesystem";

import {RequireStringTransformer} from "../refactoring/utility/requireStringTransformer";
import {JSON_REGEX} from "./data";
import {isModule_Dot_Exports} from "./predicates";
import {ExportAssignment, ExportAssignmentStatement, LHSExport, ModuleDotExports} from "./types";
// import {
// 	ExportAssignment,
// 	ExportAssignmentStatement,
// 	isModule_Dot_Exports,
// 	JSON_REGEX,
// 	LHSExport,
// 	ModuleDotExports
// } from "./";

export function id(name: string, index: number = 0, arr: string[] = []): Identifier {

    return {type: "Identifier", name: name}
}

export function lit(value: string): Literal {
    return {type: "Literal", value}
}

export function cleanRequire(node: CallExpression, js: JSFile) {
    let rst: RequireStringTransformer = js.getRST()
    if (node.callee.type === "Identifier"
        && node.callee.name === "require"
        && node.arguments[0].type === "Literal") {
        let literal = node.arguments[0].value.toString()
        let requireString: string = rst.getTransformed(literal)
        if (requireString !== literal) {
            //ha d to be cleaned
        }


        if (JSON_REGEX.test(requireString)) {
            //was json
            requireString = js.createCJSFromIdentifier(requireString)
        }

        node.arguments[0] = {type: "Literal", value: requireString}
        return requireString
    }
}

export function cleanMS(requireStr: string) {

    let replaceDotJS: RegExp = new RegExp(`(\.json)|(\.js)`, 'g')// /[\.js|]/gi
    let illegal: RegExp = new RegExp(`([^a-zA-Z0-9_\$])`, "g"); ///[alphaNumericString|_]/g
    let cleaned = requireStr.replace(replaceDotJS, '');
    cleaned = cleaned.replace(illegal, "_");
    if (cleaned[0] !== '_') {
        cleaned = '_' + cleaned;
    }
    return cleaned;
}


export const module_dot_exports: (loc?: SourceLocation) => ModuleDotExports = (loc: SourceLocation = undefined) => {
    let retVal: ModuleDotExports = {
        type: "MemberExpression",
        object: id('module'),
        property: id('exports'),
        computed: false,
        loc: loc
    }
    return retVal
}

// export function cleanRequires(node: Node, parent: Node, rd: { [k: string]: requireData }, data: JanitorRequireData,/* ids: { [p: string]: string },*/ js: JSFile): void {
// 	let raw: string, _id: string
// 	let cleaned: string
// 	if (node.type === "CallExpression" && isARequire(node)) {
// 		raw = (node.arguments[0] as Literal).value.toString()
// 		if (parent && parent.type === "VariableDeclarator"
// 			&& parent.id.type === "Identifier") {
// 			cleaned = cleanRequire(node, js)
// 			data.addSpecifier(cleaned, parent.id.name)
// 			_id = parent.id.name
// 			// ids[cleanRequire(node, js)] = parent.id.name
// 			// return VisitorOption.
// 		} else if (parent && parent.type !== "VariableDeclarator") {
// 			cleaned = cleanRequire(node, js)
// 			data.addSpecifier(cleaned)
//
//
// 			// ids[cleaned] = ''; // so it is a key
// 		} else {
//
// 			cleaned = cleanRequire(node, js)
// 			//case where parent is variabledeclarator and not identifier
// 			// (handled in pattern flatten)
// 			// id()return
// 		}
// 		if (!_id) {
// 			_id = cleanMS(raw)
// 		}
// 		rd[raw] = {raw, clean: cleaned, id: _id}
//
// 	}
// }

export function makeAnExportStatement(prop: ModuleDotExports | Identifier, name: Identifier, exportCopy: Identifier): ExportAssignmentStatement {
    let left: LHSExport = {computed: false, object: prop, property: name, type: "MemberExpression"}
    let expression: ExportAssignment = {left, right: exportCopy, type: "AssignmentExpression", operator: "="}
    let exp: ExportAssignmentStatement = {type: "ExpressionStatement", expression}
    return exp
}

export function exportsDot(prop: string): MemberExpression {
    let _retVal: MemberExpression = {
        type: "MemberExpression",
        object: module_dot_exports(),
        property: id(prop),
        computed: false,

    }

    return _retVal
}

export function declare(ident: string | Identifier, value: Expression = null): VariableDeclarator {
    let _id = typeof ident == 'string' ? id(ident) : ident
    return {id: _id, init: value || null, type: "VariableDeclarator"}
}

export function asModuleDotExports(mx: MemberExpression): { Export: string, type: 'name' | 'default' } {
    if (mx.property.type === "Identifier") {
        if (mx.object.type === "Identifier"
            && mx.object.name === "module"
            && mx.property.name === "exports"
        ) {
            return {Export: '', type: 'default'}
        } else if (isModule_Dot_Exports(mx.object)) {
            if (!mx.property.name) {
                console.log(JSON.stringify(mx, null, 2));
            }
            return {Export: mx.property.name, type: 'name'}
        }
    }
    return null
}

export function memberEx(object: Expression, property: Expression): MemberExpression {
    return {
        computed: false, object, property, type: "MemberExpression"

    }
}

export function assign(val: Pattern, expr: Expression): AssignmentExpression {
    return {
        left: val,
        right: expr,
        operator: '=',
        type: "AssignmentExpression"

    }

}


export function createDefaultImport(ms: string, ident: string): ImportDeclaration {
    return unNamed(ms, ident, false)
}

export function createNamespaceImport(ms: string, ident: string): ImportDeclaration {
    return unNamed(ms, ident, true)
}

export function createNamedImport(ms: string, name: string, local: string = name) {
    let imp = baseImport(ms)
    let _id = id(local)
    let _local = id(local)
    let is: ImportSpecifier = {type: "ImportSpecifier", imported: _id, local: _local}
    imp.specifiers.push(is)
    return imp
}

export function createDefaultExport(name: string):  ExportDefaultDeclaration {
    return {
        type: "ExportDefaultDeclaration",
        declaration: id(name)
    }
}

export function createNamedExport(name:string, local:string): ExportNamedDeclaration {
let specs  : ExportSpecifier[] = [{
    type:"ExportSpecifier",
    local:id(local),
    exported:id(name)
}]
    return   {type:"ExportNamedDeclaration", specifiers:specs}
}

function unNamed(ms: string, ident: string, isNamed: boolean): ImportDeclaration {
    let imp = baseImport(ms)
    if (isNamed) {
        imp.specifiers.push({
            type: "ImportNamespaceSpecifier",
            local: id(ident)
        })
    } else {
        imp.specifiers.push({
            type: "ImportDefaultSpecifier",
            local: id(ident)
        })
    }
    return imp
}

function baseImport(ms: string) {

    let msLit = {type: "Literal", value: ms} as SimpleLiteral

    let _import: ImportDeclaration = {
        type: "ImportDeclaration",
        source: msLit,
        specifiers: []
    }
    return _import
}














