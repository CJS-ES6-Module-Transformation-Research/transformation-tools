import {parseModule, parseScript, Program} from "esprima";
import shebangRegex from "shebang-regex";
import {generate} from "escodegen";
import {ReadableFile} from "../project/FilesTypes";
import {Directive, ModuleDeclaration, Statement} from "estree";

import {Export} from "../../../transformations/export_transformations/Export";
import {script_or_module} from "../project/FileProcessing";
import {Namespace} from "./Namespace";
import {ImportManager} from "../../../transformations/import_transformations/ImportManager";


type StringReplace = (arg: string) => string
type JSFileVisitor<R> = (prog: Program) => R


/**
 * Project representation of a javascript file. This object contains the file's text, AST in MDN/esprima/estree format,
 * as well as tools related to generating new and replacing old data.
 */
export class JSFile extends ReadableFile {
    private shebang: string;
    private ast: Program

    private toAddToTop: (Directive | Statement | ModuleDeclaration)[]
    private toAddToBottom: (Directive | Statement | ModuleDeclaration)[]
    private built: boolean = false;

    private stringReplace: Map<string, string> = new Map<string, string>();


    private replacer: StringReplace = (s) => s;

    private imports: ImportManager
    private exports: Export;

    private namespace: Namespace

    constructor(dir: string, rel: string, file: string, readType: script_or_module = 'script') {
        super(dir, rel, file, 0);
        this.imports = new ImportManager();
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
        this.rebuildNamespace();
    }

    public rebuildNamespace() {
        this.namespace = Namespace.create(this.ast);
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


    public registerReplace(replace: string, value: string): void {
        this.stringReplace.set(replace,value);
    }

    /**
     * builds the AST for generating a string. can only be done ONCE.
     */
    private build() {
        this.toAddToTop = [];
        this.toAddToBottom = [];
        if (this.built) {
            return;
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
            this.imports.buildDeclList().forEach((e) => {
                body.splice(0, 0, e)
            })
        }
        if (this.exports) {
            this.exports.buildAll().forEach((e) => {
                // body.push(e)
            });
        }
    }

    /**
     * generates a string from the built AST.
     */
    public makeString(): string {
        this.build();


        try {
            let program = generate(this.ast);
            this.stringReplace.forEach((k: string, v: string) => {
                program = program.replace(k, v)
            });
            this.shebang = this.shebang ? this.shebang + '\n' : this.shebang;
            return `${this.shebang}\n${program}\n`

        } catch (e) {
            console.log(`in file ${this.relative} with exception: ${e}`)
        }
    }

    /**
     * returns true if this is source code (always).
     */
    public isSource(): boolean {
        return true;
    }

    /**
     * returns true if identifier is in the namespace.
     */
    namespaceContains(identifier: string) {
        return this.namespace.containsName(identifier);
    }

    /**
     * gets the current object representing the namespace for the ast.
     */
    getNamespace(): Namespace {
        this.rebuildNamespace();
        return this.namespace;
    }


    setExports(exports: Export) {
        this.exports = exports;
    }

    /**
     * gets the JSFiles ImportManager.
     */
    getImportManager(): ImportManager {
        return this.imports;
    }


}
