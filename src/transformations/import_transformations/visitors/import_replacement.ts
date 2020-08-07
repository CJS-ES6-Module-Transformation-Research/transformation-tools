import {Literal, Node, Pattern} from "estree";
import {replace, Visitor, VisitorOption} from "estraverse";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
// test_resources.import {JSFile} from "../../../abstract_representation/project_representation/javascript/JSFile";


export interface ImportData {
    importString: string
    importNames: string[]
    iType: ImportType
}


export enum ImportType {
    defaultI,
    named,
    sideEffect,
    both
}


export function transformImport(js: JSFile) {

    let nodes: Set<Node> = new Set<Node>()
    let visitor: Visitor = {
        enter: (node: Node) => {

            if (node.type === "VariableDeclaration" && node.declarations.length > 0 && node.declarations[0].init) {
                if (node.declarations[0].init.type === "CallExpression") {
                    if (node.declarations[0].init.callee.type === "Identifier" && node.declarations[0].init.callee.name === "require") {
                        let namePattern: Pattern = node.declarations[0].id
                        nodes.add(node)

                         let is = (node.declarations[0].init.arguments[0] as Literal).value.toString()
                        let tmpData: ImportData;
                        switch (namePattern.type) {
                            case "Identifier":
                                tmpData = {importString: is, importNames: [], iType: ImportType.defaultI}
                                tmpData.importNames.push(namePattern.name);
                                break;
                            default:
                                throw new Error("state error???")
                        }
                        let stmt = (node.declarations[0].init.arguments[0] as Literal).value.toString()
                        if (tmpData === undefined){
                            console.log(stmt+`
                            ${namePattern.type}`)

                        }
                        tmpData.importString = stmt;
                        if (tmpData.iType === ImportType.defaultI) {
                            js.getImportManager().createDefault(stmt, tmpData.importNames[0])
                        }

                        nodes.add(node)

                        return VisitorOption.Remove;

                    }
                }
            } else  if (node.type === "ExpressionStatement") {
                if (node.expression.type === "CallExpression" && node.expression.callee.type === "Identifier") {
                    if (node.expression.callee.name === 'require' && node.expression.arguments) {
                        if (node.expression.arguments[0] && node.expression.arguments[0].type === "Literal") {

                            // node.expression.arguments[0].value.toString()
                            // data.push(tmpData)
                            js.getImportManager().createSideEffect(node.expression.arguments[0].value.toString())
                            // console.log('created '+ node.expression.arguments[0].value.toString())
                            nodes.add(node)
                            return VisitorOption.Remove;
                        }

                    }
                }
            }
        },
    }

    replace(js.getAST(), visitor);

}

