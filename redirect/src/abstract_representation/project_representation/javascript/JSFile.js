// import {parseModule, parseScript, Program} from "esprima";
// import shebangRegex from "shebang-regex";
// import {generate} from "escodegen";
// import {ReadableFile} from "../project/FilesTypes";
// import {Directive, ModuleDeclaration, Statement} from "estree";
//
// import {script_or_module} from "../project/FileProcessing";
// import {Namespace} from "./Namespace";
// import {ImportManager} from "../../../transformations/import_transformations/ImportManager";
// import {ExportBuilder} from "../../../transformations/export_transformations/ExportsBuilder";
//
//
// type StringReplace = (arg: string) => string
// type JSFileVisitor<R> = (prog: Program) => R
//
// /**
//  * Project representation of a javascript file. This object contains the file's text, AST in MDN/esprima/estree format,
//  * as well as tools related to generating new and replacing old data.
//  */
// export class JSFile extends ReadableFile {
//     private ast: Program
//
//     private shebang: string;
//
//     private isStrict: boolean = false;
//
//     private toAddToTop: (Directive | Statement | ModuleDeclaration)[]
//     private toAddToBottom: (Directive | Statement | ModuleDeclaration)[]
//
//     private stringReplace: { [key: string]: string } = {};
//
//
//     private replacer: (s: string) => string = (s) => s;
//
//     private imports: ImportManager
//     private exports: ExportBuilder;
//
//     private namespace: Namespace
//     private moduleType: script_or_module;
//
//     constructor(dir: string, rel: string, file: string, readType: script_or_module = 'script', text = '') {
//         super(dir, rel, file, 0, text);
//         this.moduleType = readType;
//         this.imports = new ImportManager();
//         this.exports = new ExportBuilder();
//         this.shebang = '';
//         this.toAddToTop = [];
//         this.toAddToBottom = [];
//         let program: string = this.text
//         if (shebangRegex.test(this.text)) {
//             this.shebang = shebangRegex.exec(this.text)[0].toString()
//             program = program.replace(this.shebang, '');
//
//         }
//         try {
//             if (readType === 'script') {
//
//                 this.ast = parseScript(program)
//             } else {
//
//                 this.ast = parseModule(program)
//             }
//         } catch (e) {
//             // console.log(`${rel} has error:  ${e} with text: \n ${this.text}`);
//             throw e;
//         }
//
//
//
//         this.isStrict = this.ast.body.length !== 0
//             && (this.ast.body[0]['directive'] === "use strict")
//         if (this.isStrict) {
//             this.ast.body.splice(0, 1)
//         }
//
//
//         this.rebuildNamespace();
//     }
//
//     public rebuildNamespace() {
//         this.namespace = Namespace.create(this.ast);
//     }
//
//
//     public addToTop(toAdd: Directive | Statement | ModuleDeclaration) {
//         this.toAddToTop.push(toAdd)
//     }
//
//     public addToBottom(toAdd: Directive | Statement | ModuleDeclaration) {
//         this.toAddToTop.push(toAdd)
//     }
//
//     public setAsModule() {
//         this.moduleType = "module";
//     }
//
//     public getAST(): Program {
//         return this.ast;
//     }
//
//     public getSheBang(): string {
//         return this.shebang;
//     }
//
//
//     public registerReplace(replace: string, value: string): void {
//         // this.stringReplace.set(replace, value);
//         this.stringReplace[replace] = value
//     }
//
//     /**
//      * builds the AST for generating a string.
//      */
//     private build(): Program {
//         let addToTop = this.toAddToTop;
//         let addToBottom = this.toAddToBottom
//
//         let newAST = this.ast;
//         let body
//             = newAST.body;
//         newAST.sourceType = this.moduleType//TODO B=
//
//         addToTop.reverse().forEach((e) => {
//             body.splice(0, 0, e)
//         })
//
//         addToBottom.forEach((e) => {
//             body.push(e)
//         })
//
//
//         this.imports.buildDeclList().forEach((e) => {
//             body.splice(0, 0, e)
//         })
//
//         let exports = this.exports.build();
//
//         if (exports.named_exports && exports.named_exports.specifiers.length > 0) {
//             body.push(exports.named_exports)
//         }
//
//         if (exports.default_exports && exports.default_exports.declaration) {
//
//             switch (exports.default_exports.declaration.type) {
//
//                 case "ObjectExpression":
//                     if (exports.default_exports.declaration.properties.length === 0) {
//                         break;
//                     }
//
//                 // not technically necessary however it is the only other possibility at this time... seems explicit.
//                 case "Identifier":
//                 default:
//                     body.push(exports.default_exports)
//                     break;
//             }
//         }
//
//
//         if (this.isStrict && this.ast.sourceType !== "module") {
//             this.ast.body.splice(0, 0, useStrict);
//         }
//
//         return newAST;
//     }
//
//     /**
//      * generates a string from the built AST.
//      */
//     public makeString(): string {
//         try {
//             let program = generate(this.build());
//             for (let key in this.stringReplace) {
//                 let value = this.stringReplace[key];
//                 console.log(`replacing ${key} with ${value}`)
//                 program = program.replace(key, value)
//             }
//             // .forEach((k: string, v: string) => {
//             //todo import.meta....
//
//             // });
//             this.shebang = this.shebang ? this.shebang + '\n' : this.shebang;
//             return `${this.shebang}\n${program}\n`
//
//         } catch (e) {
//             console.log(`in file ${this.relative} with exception: ${e}`)
//
//         }
//     }
//
//     /**
//      * returns true if this is source code (always).
//      */
//     public isSource(): boolean {
//         return true;
//     }
//
//     /**
//      * returns true if identifier is in the namespace.
//      */
//     namespaceContains(identifier: string) {
//         return this.namespace.containsName(identifier);
//     }
//
//     /**
//      * gets the current object representing the namespace for the ast.
//      */
//     getNamespace(): Namespace {
//         this.rebuildNamespace();
//         return this.namespace;
//     }
//
//
//     /**
//      * gets the JSFiles ImportManager.
//      */
//     getImportManager(): ImportManager {
//         return this.imports;
//     }
//
//
//     getExportBuilder(): ExportBuilder {
//         return this.exports;
//     }
// }
//
// const useStrict: Directive = {
//     "type": "ExpressionStatement",
//     "expression": {
//         "type": "Literal",
//         "value": "use strict",
//         "raw": "\"use strict\""
//     },
//     "directive": "use strict"
// }
//
// interface StringReplaceValues {
//     [key: string]: string
// }