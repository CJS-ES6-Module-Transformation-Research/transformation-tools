import {generate} from "escodegen";
import {traverse, Visitor} from "estraverse";
import {
    AssignmentOperator,
    Expression,
    Identifier,
    Node,
    Property,
    SpreadElement,
    Statement,
    VariableDeclarator
} from "estree";
import {FileType, MetaData, TransformFunction} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {isExpr} from "../../../abstract_representation/es_tree_stuff/astTools";


/**
 * TransformFunction for flattening object assignments to module.exports.
 * @param js the JSFile to transform
 */
export const objLiteralFlatten: TransformFunction = function (js: JSFile): void {
    const namespace = js.getNamespace()
    function createNamedDecl(prop_varname: string, value: Expression, property:Property):VariableDeclarator {
        let best = namespace.generateBestName(prop_varname)
        namespace.addToNamespace(best.name)
        let _id:Identifier = {type:"Identifier", name:prop_varname};
        property.value = best
        return {
            type:"VariableDeclarator",
            id:best,
            init:value
        }
    }

    let internalVis: Visitor = {
        enter: (node: Node, parent: Node) => {
            if (node.type === "ExpressionStatement") {
                let child: Expression = node.expression
                let grandChild: Node
                if (child.type === "AssignmentExpression") {
                    grandChild = child.left;
                    if (grandChild.type === "MemberExpression"
                        && grandChild.object.type === "Identifier"
                        && grandChild.property.type === "Identifier"
                        && grandChild.object.name
                        && grandChild.object.name === 'module'
                        && grandChild.property.name === 'exports') {
                        if (child.right.type === "ObjectExpression") {
                            if (parent.type === "Program" || parent.type === "BlockStatement") {
                                let body = parent.body;
                                let indexOf = body.indexOf(node)
                                let properties:(Property|SpreadElement)[] = []
                                let declarators:VariableDeclarator[] =[]
                                child.right.properties.forEach((_prop) => {
                                    properties.push (_prop)

                                    if (_prop.type === "Property" && (_prop.key.type === "Identifier" || _prop.key.type === "Literal") && isExpr(_prop.value.type)) {
                                        if (_prop.key.type ==="Identifier"){
                                                declarators.push( createNamedDecl(_prop.key.name, (_prop.value as Expression), _prop))
                                        }else  if (_prop.key.type ==="Literal"){
                                            declarators.push(createNamedDecl(_prop.key.value.toString(), (_prop.value as Expression),_prop ))

                                        }else{
                                            //nothing, placeholder in case another type comes sup.
                                            throw new Error("unreachable code. unexpected type of property key")
                                        }

                                    }else{
                                        throw new Error('found non literal/identifier property type or expression not the case: '+generate(_prop))
                                    }
                                })
                                body.splice(indexOf, 0,{
                                    type:"VariableDeclaration",
                                    declarations:declarators,
                                    kind:"var"
                                }
                                )

                                // indexOf = body.indexOf(node)
                                // body.splice(indexOf, 1);
                            }
                        }
                    }
                }
            }
        }
    }
traverse(js.getAST(), internalVis)
}













// function createNamedAssignment(named: string, assignable: Expression, op: AssignmentOperator = "="): Statement {
//     return {
//         type: "ExpressionStatement",
//         expression: {
//             type: "AssignmentExpression",
//             operator: op,
//             left: {
//                 type: "MemberExpression",
//                 computed: false,
//                 object: {
//                     type: "MemberExpression",
//                     computed: false,
//                     object: {
//                         type: "Identifier",
//                         name: "module"
//                     },
//                     property: {
//                         type: "Identifier",
//                         name: "exports"
//                     }
//                 },
//                 property: {
//                     type: "Identifier",
//                     name: named
//                 }
//             },
//             right: assignable
//         }
//     };
// }

// let programString:string=`
// var a = ';'
// module.exports = {a:3, b:z, c:"x", d:{obj:'literal'},e:function(a){} }
//
//
// `
// let js = new JSFile('./',JSFile.mockedMeta,null,false, programString)
// console.log(generate(js.getAST()))
//
// collectDefaultObjectAssignments(js )
// console.log(generate(js.getAST()))
//
//


