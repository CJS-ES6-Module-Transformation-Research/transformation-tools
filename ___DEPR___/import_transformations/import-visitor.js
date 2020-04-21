// import {visitor} from "../Types";
// import {
//     Node,
//     ImportDeclaration,
//     VariableDeclaration,
//     VariableDeclarator,
//     Identifier,
//     Literal,
//     Property,
//     Directive,
//     Statement,
//     Pattern,
//     BlockStatement,
//     ImportSpecifier,
//     ImportDefaultSpecifier,
//     ImportNamespaceSpecifier,
//     BaseStatement,
//     ModuleDeclaration,
//     default as ESTree, BaseModuleDeclaration, BaseModuleSpecifier, BaseExpression, Expression
// } from 'estree'
// import {parseModule, parseScript, Program} from 'esprima'
// import {genericSupplier, Mutator, mutator, WrappedReturnVisitor} from "../ast/transformationTools";
// import {traverse, VisitorOption, replace, Visitor} from "estraverse";
// import {generate} from "escodegen";
//
// // import {JPP} from "../../index";
//
//
// export interface ImportTransformReport {
//     importPath: string
//     named: boolean
//     identifiers: string[]
//     varDeclarations: Replaceable
// }
//
// export interface Replaceable {
//     declaration: VariableDeclaration
//     body: (Program | Directive | Statement | ModuleDeclaration)[]
//     isTopLevel: boolean
// }
//
//
// let importMaker: mutator<ImportTransformReport[]> = (mylist: ImportTransformReport[], program) => {
//     mylist.forEach((report) => {
//         let body = report.varDeclarations.body
//         let variableDeclaration = report.varDeclarations.declaration
//         body.splice(body.indexOf(variableDeclaration), 1)
//     })
//
//
//     mylist.forEach((report) => {
//         let body
//             = report.varDeclarations.body
//         let importDecl = createFromImportReport(report)
//         body.splice(0, 0, importDecl)
//     })
//
//
// }
//
// export const importVisitor: WrappedReturnVisitor<ImportTransformReport[]>
//     = (importCollection: ImportTransformReport[]) => {
//
//     return {
//         leave: function (node: Node, parent: Node) {
//             let deleteMe = false;
//             let child: VariableDeclarator
//             if (node.type === "VariableDeclaration") {
//                 //depr.sanitize should guarantee this is ok.
//                 child = node.declarations[0]
//             } else {
//                 return;
//             }
//             if (child.init && child.init.type === "CallExpression" && child.init.callee.type === "Identifier" && child.init.callee.name === 'require') {
//
//                 let importString: string = `${(child.init.arguments[0] as Literal).value}`
//                 let imports: string[] = []
//                 let isNamed = false;
//                 if (child.id.type === "Identifier") {
//                     //CREATE DEFAULT OR STAR IMPORT
//                     imports.push(child.id.name)
//                     deleteMe = true;
//                 } else if (child.id.type === "ObjectPattern") {
//                     child.id.properties.forEach((property) => {
//                         let id = ((property as Property).key as Identifier).name
//                         imports.push(id)
//                         deleteMe = true;
//                     })
//                     isNamed = true;
//                 } else {
//                     throw new Error(child.type)
//                 }
//                 let body
//                 if (parent.type === "Program" || parent.type === "BlockStatement") {
//                     body = parent.body;
//                 } else {
//                     //
//                 }
//                 const isTopLevel = parent.type === "Program" ? true : parent.type === "BlockStatement" ? false : null;
//                 if (isTopLevel === null) {
//                     throw new Error("invalid isTopLevel")
//                 }
//
//
//                 let buildable: ImportTransformReport = {
//                     importPath: importString,
//                     named: isNamed,
//                     identifiers: imports,
//                     varDeclarations: {
//                         declaration: node,
//                         body: body,
//                         isTopLevel: isTopLevel
//
//                     }
//                 };
//                 importCollection.push(buildable)
//             }
//
//
//         }
//
//     }
//
// }
//
// function createFromImportReport(report: ImportTransformReport): ImportDeclaration {
//     return {
//         type: "ImportDeclaration",
//         specifiers: getSpecifiersFromReport(report),
//         source: {
//             type: "Literal",
//             value: report.importPath
//         }
//     }
//
//     function getSpecifiersFromReport(report: ImportTransformReport): (ImportSpecifier | ImportNamespaceSpecifier | ImportDefaultSpecifier)[] {
//         let specifierArr: (ImportSpecifier | ImportNamespaceSpecifier | ImportDefaultSpecifier)[] = []
//         if (!report.named) {
//             //default
//             let defSpec: ImportDefaultSpecifier =
//                 {
//                     type: "ImportDefaultSpecifier",
//                     local: {
//                         type: "Identifier",
//                         name: report.identifiers[0]
//                     }
//                 }
//             specifierArr.push(defSpec)
//         } else if (report.named) {
//             report.identifiers.forEach((id) => {
//                 let spec: ImportSpecifier = {
//                     type: "ImportSpecifier",
//                     local: {
//                         type: "Identifier",
//                         name: id
//                     },
//                     imported: {
//                         type: "Identifier",
//                         name: id
//                     }
//                 }
//                 specifierArr.push(spec)
//             })
//         }
//         return specifierArr;
//     }
//
// }
//
//
// let json = (j) => console.log(JSON.stringify(j, null, 3))
//
// let program: string =
//     `
//     \nconst x = require('x');
//     console.log('hello');
//     let w = 3;
//     const app2 = hello(x);
//     let {expect} = require('chai');;
//     var {expect,assert,beforeEach} = require('chai');
//     expect(x).to.be.equal(y)
//      var app = express()
//
//     `
//
// let visitor: Visitor = {
//     enter: (node, parentNode) => {
//     },
//     leave: (node, parentNode) => {
//     }
//     // keys: replace()
// }
// let ast = parseScript(program);
// replace(ast, visitor)
// // let imports: ImportTransformReport[] = []
// // depr.ast = parseModule('import {x,y as z} from "importStr"' + "\n" + 'import q  from  "importStr"')
//
// // traverse(depr.ast, importVisitor(imports))
// // traverse(depr.ast, importVisitor(imports))
// // depr.ast.body.filter((e:Node)=>e.type != "EmptyStatement")
//
// export let mutator_imports: Mutator<ImportTransformReport[]> = {
//     supplier: () => {
//         let t: ImportTransformReport[] = [];
//         return t
//     },
//     mutator: importMaker
//
// }
// // depr.ast.sourceType = "module"
//
// // imports.forEach((e)=>{console.log( `${e.importPath}\t${e.identifiers}${e.named}`)} )
// // json(imports)
// // importMaker(imports, depr.ast.body)
// // json(depr.ast)
// // json(generate(depr.ast))
// // json(generate(depr.ast  ))
//
//
// // json(imports)
//
// // console.log(JSON.stringify(parseScript('var {ImportTransformReport,y,ImportTransformReport } = require("asdf")'), null, 3))
//
//
//
// let createImportMap = () => {
//     return {importString: null, importNames: [], isObjectExpression: false}
// }
//
// // let asdf = new DeclWalker().walk([], depr.ast)
// //
// // class RemoveEmptyStatements extends Walker<null> {
// //     constructor() {
// //         super(true);
// //     }
// //
// //     enter: (node: Node, parentNode: (Node | null)) => (VisitorOption | Node | void);
// //     leave = function (node: Node) {
// //         if (node.type === "EmptyStatement") {
// //             return VisitorOption.Remove;
// //         }
// //     }
// //
// // }
// //
// // new RemoveEmptyStatements().walk(null, depr.ast)
//
// console.log(generate(ast))
// //
// // function createAnImportDeclaration(importData: ImportData): ImportDeclaration {
// //     let specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier> = [];
// //     // let aSpec:ImportSpecifier =
// //     if (importData.isObjectExpression) {
// //
// //         importData.importNames.forEach((e) => {
// //                 specifiers.push(
// //                     {
// //                         type: "ImportSpecifier",
// //                         imported: {
// //                             type: "Identifier",
// //                             name: e
// //                         }, local: {
// //                             type: "Identifier",
// //                             name: e
// //                         }
// //                     }
// //                 )
// //             }
// //         )
// //     } else {
// //         specifiers.push({type: "ImportDefaultSpecifier", local: {type: "Identifier", name: importData.importNames[0]}})
// //     }
// //
// //     return {
// //         type: "ImportDeclaration",
// //         specifiers: specifiers,
// //         source: {
// //             type: "Literal",
// //             value: importData.importString
// //         }
// //     } ;
// // }
