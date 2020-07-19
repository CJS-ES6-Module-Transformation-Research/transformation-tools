Object.defineProperty(exports, "__esModule", { value: true });
exports.transformImport = exports.ImportType = void 0;
const estraverse_1 = require("estraverse");
var ImportType;
(function (ImportType) {
    ImportType[ImportType["defaultI"] = 0] = "defaultI";
    ImportType[ImportType["named"] = 1] = "named";
    ImportType[ImportType["sideEffect"] = 2] = "sideEffect";
    ImportType[ImportType["both"] = 3] = "both";
})(ImportType = exports.ImportType || (exports.ImportType = {}));
// export class ImportTransformer extends Walker<ImportData[]> {
//     constructor() {
//         super(true);
//     }
//
//     private nodes: Set<Node> = new Set<Node>()
//
//     enter = (node: Node, parent: Node) => {
//         if (node.type === "VariableDeclaration" && node.declarations[0] !== undefined && node.declarations[0].init) {
//             if (node.declarations[0].init.type === "CallExpression") {
//                 if (node.declarations[0].init.callee.type === "Identifier" && node.declarations[0].init.callee.name === "require") {
//                     let namePattern: Pattern = node.declarations[0].id
//                     this.nodes.add(node)
//
//                     let is = (node.declarations[0].init.arguments[0] as Literal).value.toString()
//                     let tmpData: ImportData;
//                     switch (namePattern.type) {
//                         case "Identifier":
//                             tmpData = {importString: is, importNames: [], iType: ImportType.defaultI}
//                             tmpData.importNames.push(namePattern.name);
//                             break;
//                         case "ObjectPattern":
//                             tmpData = {importString: is, importNames: [], iType: ImportType.named}
//                             namePattern.properties.forEach((e) => {
//                                 if (e.type === "Property") {
//                                     let x
//                                         = e.value
//                                     tmpData.importNames.push((e.value as Identifier).name)
//                                 } else {
//                                     tmpData.importNames.push((e.argument as Identifier).name)
//                                 }
//                             })
//                             break;
//                         default:
//                             throw new Error("state error???")
//                     }
//
//                     let stmt = (node.declarations[0].init.arguments[0] as Literal).value
//                     tmpData.importString = stmt.toString();
//                     this.data.push(tmpData)
//
//                     return VisitorOption.Skip;
//                 }
//             }
//         } else if (node.type === "ExpressionStatement") {
//             if (node.expression.type === "CallExpression" && node.expression.callee.type === "Identifier") {
//                 if (node.expression.callee.name === 'require' && node.expression.arguments) {
//                     if (node.expression.arguments[0] && node.expression.arguments[0].type === "Literal") {
//
//                         let tmpData: ImportData = {
//                             iType: ImportType.sideEffect,
//                             importNames: [],
//                             importString: node.expression.arguments[0].value.toString()
//                         }
//                         this.data.push(tmpData)
//                         this.nodes.add(node)
//                         return VisitorOption.Skip;
//                     }
//
//                 }
//             }
//         }
//     }
//
//     leave = (node: Node, parent: Node) => {
//         if (this.nodes.has(node)) {
//             this.nodes.delete(node)
//             return VisitorOption.Remove;
//         }
//     }
//
//     postTraversal = () => {
//     };
// }
function transformImport(js) {
    let nodes = new Set();
    let visitor = {
        enter: (node) => {
            if (node.type === "VariableDeclaration" && node.declarations.length > 0 && node.declarations[0].init) {
                if (node.declarations[0].init.type === "CallExpression") {
                    if (node.declarations[0].init.callee.type === "Identifier" && node.declarations[0].init.callee.name === "require") {
                        let namePattern = node.declarations[0].id;
                        nodes.add(node);
                        let is = node.declarations[0].init.arguments[0].value.toString();
                        let tmpData;
                        switch (namePattern.type) {
                            case "Identifier":
                                tmpData = { importString: is, importNames: [], iType: ImportType.defaultI };
                                tmpData.importNames.push(namePattern.name);
                                break;
                            // case "ObjectPattern":
                            //     tmpData = {importString: is, importNames: [], iType: ImportType.named}
                            //     namePattern.properties.forEach((e) => {
                            //         if (e.type === "Property") {
                            //             let x
                            //                 = e.value
                            //             tmpData.importNames.push((e.value as Identifier).name)
                            //         } else {
                            //             tmpData.importNames.push((e.argument as Identifier).name)
                            //         }
                            //     })
                            //     break;
                            case "ObjectPattern":
                                return;
                            default:
                                throw new Error("state error???");
                        }
                        let stmt = node.declarations[0].init.arguments[0].value.toString();
                        if (tmpData === undefined) {
                            console.log(stmt + `
                            ${namePattern.type}`);
                        }
                        tmpData.importString = stmt;
                        if (tmpData.iType === ImportType.defaultI) {
                            js.getImportManager().createDefault(stmt, tmpData.importNames[0]);
                        }
                        // if (tmpData.iType === ImportType.named) {
                        //     tmpData.importNames.forEach(e => {
                        //
                        //     })
                        // }
                        // data.push(tmpData)
                        nodes.add(node);
                        return estraverse_1.VisitorOption.Remove;
                    }
                }
            }
            else if (node.type === "ExpressionStatement") {
                if (node.expression.type === "CallExpression" && node.expression.callee.type === "Identifier") {
                    if (node.expression.callee.name === 'require' && node.expression.arguments) {
                        if (node.expression.arguments[0] && node.expression.arguments[0].type === "Literal") {
                            // node.expression.arguments[0].value.toString()
                            // data.push(tmpData)
                            js.getImportManager().createSideEffect(node.expression.arguments[0].value.toString());
                            console.log('created ' + node.expression.arguments[0].value.toString());
                            nodes.add(node);
                            return estraverse_1.VisitorOption.Remove;
                        }
                    }
                }
            }
        },
    };
    estraverse_1.replace(js.getAST(), visitor);
}
exports.transformImport = transformImport;
