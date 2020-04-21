// import {traverse, Visitor} from 'estraverse'
// import {Directive, ModuleDeclaration, Statement} from "estree";
// import {generate} from "escodegen";
// import {WrappedVisitor} from "../../src/Types";
//
// export type genericSupplier<T> = () => T;
//
// export interface Mutator<T> {
//     supplier: genericSupplier<T>,
//     mutator: mutator<T>
// }
//
// export type mutator<T> = (t: T, program: Array<Directive | Statement | ModuleDeclaration>) => void ;
//
// export type WrappedReturnVisitor<T> = (returnValue: T) => Visitor;
// export type varLetConst = "var" | "let" | "const";
//
// export type ListWrappedVisitor<T> = (list: T[]) => Visitor;
//
// export interface AccessRequire {
//     identifier: string
//     importValue: string
// }
//
// export interface ProgramString {
//     program: string,
//     name: string
// };
//
// export class ASTTransformer {
//     constructor(astFiles: AstFile[]) {
//         this.astFiles = astFiles
//     };
//
//
//     private astFiles: AstFile[];
//
//
//     public currentPrograms(): ProgramString[] {
//         let list: ProgramString[] = [];
//         this.astFiles.forEach((e) => {
//             list.push({
//                 program: generate(e.ast),
//                 name: e.filePath
//             })
//         });
//         return list;
//     };
//
//     public transformWithTypeReturn<T>(lVisitor: WrappedReturnVisitor<T>, mutator: Mutator<T>): void {
//
//         this.astFiles.forEach(
//             (astFile) => {
//                 let data: T = mutator.supplier();
//                 let theVisitor: Visitor = lVisitor(data)
//                 traverse(astFile.ast, theVisitor)
//                 mutator.mutator(data, astFile.ast.body)
//             }
//         );
//         // this.transformWithVisitors(lVisitor(data))
//     }
//
//     public transformWithListReturn<T>(lVisitor: ListWrappedVisitor<T>): T[] {
//         let list: T[] = [];
//         this.transformWithVisitors(lVisitor(list))
//         return list;
//     }
//
//     public transformWithVisitors(visitor: Visitor): void {
//         this.astFiles.forEach(
//             (astFile) => {
//                 traverse(astFile.ast, visitor)
//             }
//         );
//     }
//
//
//     public transformWrapped(visitor: WrappedVisitor): void {
//         this.astFiles.forEach(
//             (astFile) => {
//                 let theVisitor: Visitor = visitor(astFile)
//                 traverse(astFile.ast, theVisitor)
//             }
//         );
//     }
// }
//
