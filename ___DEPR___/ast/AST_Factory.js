Object.defineProperty(exports, "__esModule", { value: true });
// import {varLetConst} from "./transformationTools";
//
// export function createRequireDecl(varStr: string, importStr: string, kindStr: varLetConst): VariableDeclaration {
//     let varDecl: VariableDeclaration;
//     varDecl = {
//         type: "VariableDeclaration",
//         declarations: [
//             {
//                 type: "VariableDeclarator",
//                 id: {
//                     type: "Identifier",
//                     name: varStr
//                 }, init: {
//                     type: "CallExpression",
//                     callee: {
//                         type: "Identifier",
//                         name: "require"
//                     },
//                     arguments: [
//                         {
//                             type: "Literal",
//                             value: importStr,
//                             raw: `'${importStr}'`
//                         }
//                     ]
//                 },
//             }
//         ],
//         kind: kindStr
//     };
//     return varDecl;
// }