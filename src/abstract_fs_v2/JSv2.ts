import {generate} from "escodegen";
import {parseModule, parseScript} from "esprima";
import {Directive, ModuleDeclaration, Program, Statement} from "estree";
import {existsSync} from "fs";
import {basename, dirname, join, relative} from "path";
import shebangRegex from "shebang-regex";
import {RequireTracker} from "../RequireTracker";
import {ExportBuilder} from "../transformations/export_transformations/ExportsBuilder";
import {ImportManager} from "../transformations/import_transformations/ImportManager";
import {AbstractDataFile} from './Abstractions'
import {Dir} from './Dirv2'
import {MetaData, SerializedJSData} from "./interfaces";
import {Namespace} from "./Namespace";

// import {script_or_module} from "./interfaces";
type script_or_module = "script" | "module"


// export interface JSFile {
//     rebuildNamespace(): void;
//
//     addToTop(toAdd: Directive | Statement | ModuleDeclaration): void;
//
//     addToBottom(toAdd: Directive | Statement | ModuleDeclaration): void;
//
//     setAsModule(): void;
//
//     getAST(): Program;
//
//     getSheBang(): string;
//
//     registerReplace(replace: string, value: string): void;
//
//     namespaceContains(identifier: string): boolean;
//
//     getNamespace(): Namespace;
//
//     getImportManager(): ImportManager;
//
//     getExportBuilder(): ExportBuilder;
// }
//
// export function create(){
//
// }


export class JSFile extends AbstractDataFile {
    getRequireTracker(): RequireTracker {
        return this.r_tracker;
    }

    private r_tracker: RequireTracker;
    private readonly ast: Program;
    private shebang: string;
    private isStrict: boolean = false;//TODO might be unnnecssary--find purposes

    private toAddToTop: (Directive | Statement | ModuleDeclaration)[] = []
    private toAddToBottom: (Directive | Statement | ModuleDeclaration)[] = []

    private stringReplace: { [key: string]: string } = {};
    private replacer: (s: string) => string = (s) => s;

    private imports: ImportManager
    private exports: ExportBuilder;

    private namespace: Namespace
    private moduleType: script_or_module;

    constructor(path: string, b: MetaData, parent: Dir, isModule: boolean) {
        super(path, b, parent);

        this.moduleType = isModule ? "module" : "script" //TODO delete or find purpose

        this.ast = this.parseProgram(this.data, isModule)

        this.r_tracker = new RequireTracker();
        this.removeStrict();
        this.rebuildNamespace();

    }

    public spawnCJS(moduleID: string): string {
        let parent: Dir = this.parent();
        let parentDir = parent.getAbsolute()
        let base = basename(moduleID, ".json");
        let cjsName = `${base}.cjs`
        if (existsSync(join(parentDir, cjsName))) {
            let i = 0;
            let cjsName = `${base}_${i}.cjs`
            while (existsSync(join(parentDir, cjsName))) {
                cjsName = `${base}_${i}.cjs`
                i++
            }
        }
        let json = join(this.path_abs, moduleID)
        let relativeToRoot = relative(this.parent().getRootDirPath(), json)
        let dirRelativeToRoot = dirname(relativeToRoot)

        let builder = {
            cjsFileName: `${dirRelativeToRoot}/${basename(json)}.cjs`,
            jsonFileName: relative(this.parent().getRootDirPath(), json),
            dataAsString: `module.exports = require('./${basename(moduleID)}');`,
            dir: parent

        }


        let spawn = this.parent().spawnCJS(builder)

        return join(dirname(moduleID), basename(spawn))

    }

    private removeStrict() {
        this.isStrict = this.ast.body.length !== 0
            && (this.ast.body[0]['directive'] === "use strict")
        if (this.isStrict) {
            this.ast.body.splice(0, 1)
        }
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

    public setAsModule() {
        this.moduleType = "module";
    }

    public getAST(): Program {
        return this.ast;
    }

    public getSheBang(): string {
        return this.shebang;
    }


    public registerReplace(replace: string, value: string): void {
        // this.stringReplace.set(replace, value);
        this.stringReplace[replace] = value
    }


    private buildProgram(): Program {
        let addToTop: (Directive | Statement | ModuleDeclaration)[] = []
        this.toAddToTop.forEach(e => addToTop.push(e));
        let addToBottom: (Directive | Statement | ModuleDeclaration)[] = []
        this.toAddToBottom.forEach(e => addToBottom.push(e));

        let newAST = this.ast;
        let body
            = newAST.body;
        newAST.sourceType = this.moduleType

        addToTop.reverse().forEach((e) => {
            body.splice(0, 0, e)
        })

        addToBottom.reverse().forEach((e) => {
            body.push(e)
        })


        if (this.moduleType === "module") {
            this.makeExportsArray(newAST.body)
        }
        this.getImportManager().buildDeclList().forEach(e => {
            newAST.body.splice(0, 0, e)
        })

        //MUST BE LAST
        if (this.isStrict && this.ast.sourceType !== "module") {
            this.ast.body.splice(0, 0,
                JSFile.useStrict
            );
        }
        return newAST;
    }

    protected static readonly useStrict: Directive = {
        "type": "ExpressionStatement",
        "expression": {
            "type": "Literal",
            "value": "use strict",
            "raw": "\"use strict\""
        },
        "directive": "use strict"
    }

    private makeExportsArray(body: (Directive | ModuleDeclaration | Statement)[]) {

        let exports = this.exports.build();

        if (exports.named_exports && exports.named_exports.specifiers.length > 0) {
            body.push(exports.named_exports)
        }

        if (exports.default_exports && exports.default_exports.declaration) {
            switch (exports.default_exports.declaration.type) {

                case "ObjectExpression":
                    if (exports.default_exports.declaration.properties.length === 0) {
                        break;
                    }

                // not technically necessary however it is the only other possibility at this time... seems explicit.
                case "Identifier":
                default:
                    body.push(exports.default_exports)
                    break;
            }
        }
    }

    private parseProgram(program: string, isModule): Program {
        if (shebangRegex.test(this.data)) {
            this.shebang = shebangRegex.exec(this.data)[0].toString()
            program = program.replace(this.shebang, '');

        } else {
            this.shebang = '';
        }

        try {
            return (isModule ? parseModule : parseScript)(program)
        } catch (e) {
            throw new Error(`Esprima Parse ERROR in file ${this.path_abs} on line ${e.lineNumber}:${e.index} with description ${e.description}\n`)
        }
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


    /**
     * gets the JSFiles ImportManager.
     */
    getImportManager(): ImportManager {
        if (!this.imports) {
            this.imports = new ImportManager();
        }
        return this.imports;
    }


    getExportBuilder(): ExportBuilder {
        if (!this.exports) {
            this.exports = new ExportBuilder();
        }
        return this.exports;
    }


    makeSerializable(): SerializedJSData {
        let program: string
        try {
            program = generate(this.buildProgram())
            for (let key in this.stringReplace) {
                let value = this.stringReplace[key];
                console.log(`replacing ${key} with ${value}`)
                program = program.replace(key, value)
            }
            // .forEach((k: string, v: string) => {
            //todo import.meta....

            // });
            this.shebang = this.shebang ? this.shebang + '\n' : this.shebang;
            program = `${this.shebang}\n${program}\n`

        } catch (e) {
            console.log(`in file ${this.path_relative} with exception: ${e}`)

        }

        return {
            relativePath: this.path_relative,
            fileData: program
        };
    }
}