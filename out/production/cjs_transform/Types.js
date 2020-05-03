Object.defineProperty(exports, "__esModule", { value: true });
exports.isCallExpr = (function (e) { return true; }), exports.isIdentifier = (function (e) { return true; }), exports.isLiteral = (function (e) { return true; }), exports.isSimpleLiteral = (function (e) { return true; });
//
// export interface AstFile {
//     dir: string
//     filePath: string
//     shebang:string
//     ast: estree.Program
// }
//
//
// export interface ProjectFS {
//     project: string,
//     files: Array<FileDescript>,
//     dirs: Array<DirDescript>
// }
//
// export interface DirDescript {
//     dir: string,
//     relative: string
// }
//
// export interface FileDescript {
//     dir: string,
//     file: string,
//     full: string,
//     ftype: FILE_TYPE,
//     relative: string
// }
//
// export interface ProjectData {
//     project: ProjectFS
//     asts: AstFile[]
// }
//
//
// export type WrappedVisitor = (astFile: AstFile) => Visitor
