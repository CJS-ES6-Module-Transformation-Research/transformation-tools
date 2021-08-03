import {traverse, VisitorOption} from "estraverse";
import {
    AssignmentExpression, CallExpression,
    ExpressionStatement,
    Identifier,
    Literal,
    MemberExpression,
    Node,
    VariableDeclaration
} from "estree";
import {JSFile} from "../../filesystem";
import {declare, id, isModule_Dot_Exports} from "../../utility";
import {Intermediate} from "../../utility/Intermediate";
import {fileURLToPath} from "url";


export function readIn(js: JSFile) {
let _intermediate=  js.getIntermediate()
    let load_order: string[] = _intermediate.load_order
    let ms_to_id: { [str: string]: string } = _intermediate.ms_to_id
    let id_to_ms: { [str: string]: string } = _intermediate.id_to_ms

    let exportMap: { [str: string]: string } = {}


    let _body = js.getAST().body
    let indices: number[] = []

    _body.forEach((stmt , index, arr) => {

        switch (stmt.type) {


            case "VariableDeclaration":
                if (
                    stmt.declarations.length === 1
                    && stmt.declarations[0].init
                    && stmt.declarations[0].init.type === "CallExpression"
                    && stmt.declarations[0].init.callee.type === "Identifier"
                    && stmt.declarations[0].init.callee.name === "require"
                ) {
                    let _id = (stmt.declarations[0].id as Identifier).name
                    let rst = ((stmt.declarations[0].init.arguments[0] as Literal)).value.toString()
                    ms_to_id[rst] = _id
                    id_to_ms[_id] = rst
                    load_order.push(rst)
                    // import_decls.push(stmt)
                    indices.push(index)

                } else {
                }

                break;
            case "ExpressionStatement":
                let exp = stmt.expression


                if (exp.type === "AssignmentExpression") {
                    if (exp.left.type === "MemberExpression") {
                        if (isModule_Dot_Exports(exp.left)) {
                            exportMap['default'] = (exp.right as Identifier).name
                            // builder.addExport('default')
                            indices.push(index)
                        //
                        } else if (isModule_Dot_Exports(exp.left.object)) {
                            exp.left.object = exp.left.object as MemberExpression
                            let name = (exp.left.property as Identifier).name

                            let best = js.getNamespace().generateBestName(name)

                            exp.left = best;

                            exportMap[name] = exp.left.name

                        }
                    }
                } else if (exp.type === "CallExpression") {

                    if (exp.callee.type === "Identifier"
                        && exp.callee.name === "require"
                        && exp.arguments[0]
                        && exp.arguments[0].type === "Literal"
                    ) {
                        let rs = exp.arguments[0].value.toString()
                        ms_to_id[rs] = null
                        load_order.push(rs)
                        indices.push(index)
                    }
                }
                break;

        }
    })
    indices.reverse().forEach((i: number) =>
        _body.splice(i, 1)
    )



    // let __default = () => id(exportMap['default'])




    let vd:VariableDeclaration = js.getIntermediate().buildExports(js.getApi(), exportMap)

    if (vd.declarations.length > 0) {
        _body.splice(0, 0, vd);
    }

    /********** * Helper Functions * **********/




    function handleExports(exp: AssignmentExpression,exportMap:{[key:string]:string}): void {

    }

}


export function removeModuleDotExports(js: JSFile) {
   let exportMap =  js.getIntermediate().getExportMap()
    traverse(js.getAST(), {

        leave: (node: Node,parent:Node) => {
            if (node.type === "MemberExpression") {
                if (exportMap['default']) {
                    if (isModule_Dot_Exports(node.object)) {
                        node.object =  id(exportMap['default'])
                    } else if (isModule_Dot_Exports(node)) {
                        return  id(exportMap['default'])
                    }
                } else /* (!exportMap['default'])*/{
                    if (isModule_Dot_Exports(node.object)) {
                        let name = (node.property as Identifier).name
                        return id(exportMap[name])
                    }
                }
            }
            if(exportMap['default']
                && node.type === "ExpressionStatement"
                && node.expression.type ==="AssignmentExpression"
                && isModule_Dot_Exports(node.expression.left)
                && node.expression.right .type ==="Identifier"
                && node.expression.right .name ===  exportMap['default']
            ){
                return VisitorOption. Remove
            }
        }

    })

}