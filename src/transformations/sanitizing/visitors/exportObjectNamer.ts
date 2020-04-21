import {Expression, Node} from "estree";
import {parseScript, Program} from "esprima";
import {traverse, Visitor} from "estraverse";
import {isExpr} from "../../../abstract_representation/es_tree_stuff/astTools";
import {createNamedAssignment} from "../../../abstract_representation/es_tree_stuff/exportsTools";
import {JSFile} from "../../../abstract_representation/project_representation/JS";
import {generate} from "escodegen";

export function collectDefaultObjectAssignments(js:JSFile):void {
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

                                child.right.properties.reverse().forEach((e) => {
                                    if (e.type === "Property" && e.key.type === "Identifier" && isExpr(e.value.type)) {
                                        body.splice(indexOf, 0, createNamedAssignment(e.key.name, (e.value as Expression)))
                                    }
                                })
                                indexOf = body.indexOf(node)
                                body.splice(indexOf, 1);
                            }

                        }
                    }
                }
            }
        }
    }
    traverse(js.getAST() , internalVis)
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

                            child.right.properties.reverse().forEach((e) => {
                                if (e.type === "Property" && e.key.type === "Identifier" && isExpr(e.value.type)) {
                                    body.splice(indexOf, 0, createNamedAssignment(e.key.name, (e.value as Expression)))
                                }
                            })
                            indexOf = body.indexOf(node)
                            body.splice(indexOf, 1);
                        }

                    }
                }
            }
        }
    }
}






