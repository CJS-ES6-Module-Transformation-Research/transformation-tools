import {parseModule, parseScript, Program} from "esprima";
import shebangRegex from "shebang-regex";
import {generate} from "escodegen";
import {ReadableFile} from "./FilesTypes";
import {
    ArrayPattern,
    AssignmentPattern,
    Directive,
    Identifier, MemberExpression,
    ModuleDeclaration,
    ImportDeclaration,
    ObjectPattern,
    RestElement,
    Statement
} from "estree";
import {SideEffectImport} from "../import_tools/Import";
import {DefaultImport} from "../import_tools/Import";
import {NamedImport} from "../import_tools/Import";
import {traverse, Visitor} from "estraverse";
import {JPP} from "../../index";
import {walkPatternToIdentifier} from "../ast_tools/exportsTools";
import {Export} from "../visitors/exports/Export";
import {script_or_module} from "./FileProcessing";


type StringReplace = (arg: string) => string
type JSFileVisitor<R> = (prog: Program) => R


export class JSFile extends ReadableFile {
    private shebang: string;
    private ast: Program

    private toAddToTop: (Directive | Statement | ModuleDeclaration)[]
    private toAddToBottom: (Directive | Statement | ModuleDeclaration)[]
    private built: boolean = false;

    private replacer: StringReplace = (s) => s;

    private imports: ImportDeclaration[]
    private exports: Export;

    private namespace: Set<string>

    constructor(dir: string, rel: string, file: string, readType: script_or_module) {
        super(dir, rel, file, 0);
        this.imports = [];
        this.shebang = '';
        this.toAddToTop = [];
        this.toAddToBottom = [];
        let program: string = this.text
        if (shebangRegex.test(this.text)) {
            this.shebang = shebangRegex.exec(this.text)[0].toString()
            program = program.replace(this.shebang, '');
        }
        try {
            if (readType === 'script') {
                this.ast = parseScript(program)
            } else {
                this.ast = parseModule(program)
            }
        } catch (e) {
            console.log(`${rel} has error:  ${e} with text: \n ${this.text}`);
        }
        this.namespace = new Set<string>()
        this.rebuildNamespace();
    }

    public rebuildNamespace() {
        traverse(this.ast, populateNamespace(this.namespace))
    }


    public addToTop(toAdd: Directive | Statement | ModuleDeclaration) {
        this.toAddToTop.push(toAdd)
    }

    public addToBottom(toAdd: Directive | Statement | ModuleDeclaration) {
        this.toAddToTop.push(toAdd)
    }


    public getAST(): Program {
        return this.ast;
    }

    public getSheBang(): string {
        return this.shebang;
    }

    public accept<R>(visitor: JSFileVisitor<R>) {
        return visitor(this.ast);
    }


    public registerReplace(replacer: StringReplace): void {
        this.replacer = (s) => replacer(this.replacer(s))
    }

    public makeStringWithReplace(replacer: StringReplace): string {
        return this.replacer(replacer(generate(this.ast)));
    }

    private build() {
        this.toAddToTop = [];
        this.toAddToBottom = [];
        if (this.built) {
            return
        }
        let body = this.ast.body;
        this.ast.sourceType = "module"
        this.toAddToTop.forEach((e) => {
            body.splice(0, 0, e)
        })

        this.toAddToBottom.forEach((e) => {
            body.push(e)
        })

        if (this.imports) {
            this.imports.forEach((e) => {
                body.splice(0, 0, e)
            })
        }
        if (this.exports) {
            this.exports.buildAll().forEach((e) => {
                // body.push(e)
            });
        }
    }

    public makeString(): string {
        this.build();
        try {
            let program = this.replacer ? this.replacer(generate(this.ast)) : generate(this.ast);

            if (this.shebang) {
                return `${this.shebang}\n${program}\n`
            } else {
                return program + "\n";
            }
        } catch (e) {
            console.log(`in file ${this.relative} with exception: ${e}`)
        }
    }

    public isSource(): boolean {
        return true;
    }

    namespaceContains(identifier: string) {
        return this.namespace.has(identifier);
    }

    setExports(exports: Export) {
        this.exports = exports;
    }


    addAnImport(e: ImportDeclaration) {
        this.imports.push(e);
    }
}


function populateNamespace(namespace: Set<string>): Visitor {
    return {
        enter: (node, parent) => {
            switch (node.type) {
                case "VariableDeclarator": {
                    walkPatternToIdentifier(node.id, namespace);
                    break;
                }
                case "AssignmentExpression": {
                    walkPatternToIdentifier(node.left, namespace);
                    break;
                }
                case "FunctionDeclaration": {
                    node.params.forEach((e) => walkPatternToIdentifier(e, namespace))
                    break;
                }
                case "ClassDeclaration": {
                    namespace.add(node.id.name)
                    break;
                }
            }
        }
    }
}
