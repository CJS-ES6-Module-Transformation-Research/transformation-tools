import {

    DefaultExport,
    ExportAliases,
    ExportInfo,
    getName,
    NamedExports
} from "./visitors/exportCollector";
 import {traverse, Visitor} from "estraverse";
import {MemberExpression, Node,ModuleDeclaration} from "estree";
import {JSFile} from "../../abstract_representation/project_representation";
import {DEFAULT_EXPORT_STRING} from "./visitors/types";

export class Export {
    private hasDefault: boolean;
    private hasNamed: boolean;
    private namedExports: ExportInfo;
    private defaultExport: DefaultExport;

    constructor(js: JSFile) {
        this.defaultExport = hasDefaultExport(js);
        this.hasDefault =   this.defaultExport && true   ;
        this.namedExports = getAllNamed(js);
        this.hasNamed = (this.namedExports.exports&& true);
        js.setExports(this);

    }
    buildAll():ModuleDeclaration[] {
        return null
    }
}


function hasDefaultExport(js: JSFile) {

    let count = 0;
    let default_: DefaultExport = null;
    let defaultVisitor: Visitor = {
        enter: (node: Node, parent: Node) => {
            let child: Node

            if (node.type === "AssignmentExpression") {
                child = node.left;
                child = node.left;

                if (child.type === "MemberExpression"
                    && child.object.type === "Identifier"
                    && child.property.type === "Identifier"
                    && child.object.name
                    && child.object.name === 'module'
                    && child.property.name === 'exports') {
                    count++
                    if (count > 1) {
                        throw new Error('multiple default exports!')
                    }

                    let defstring = node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING
                    default_ = {
                        identifier: defstring,
                        alias: defstring,
                        expr: node.right,
                        type: node.right.type

                    }
                }
            }
        }
    }
    traverse(js.getAST(), defaultVisitor)
    return default_;
}


function getAllNamed(js: JSFile): ExportInfo {
    let namedEX: NamedExports = {};
    let aliases: ExportAliases = {};

    const namedVisitor: Visitor = {
        enter: (node: Node, parent: Node) => {

            if (node.type === "AssignmentExpression" && node.left.type === "MemberExpression") {
                let child: MemberExpression = node.left;
                if (
                    (child.object.type === "MemberExpression"
                        && child.object.object.type === "Identifier"
                        && child.object.property.type === "Identifier"
                        && child.object.object.name === "module"
                        && child.property.type === "Identifier")
                    ||
                    (child.object.type === "Identifier"
                        && child.property.type === "Identifier"
                        && child.object.name === "exports")

                ) {
                    let identifier = `${getName(node, parent, child)}`;
                    let alias = ` _${identifier}_namedExport`
                    namedEX[identifier] = node.right;
                    if (js.namespaceContains(identifier)) {
                        aliases[identifier] = alias;
                    }
                }
            }
        }
    }
    traverse(js.getAST(), namedVisitor);
    return {
        exports: namedEX,
        aliases: aliases
    }
}
