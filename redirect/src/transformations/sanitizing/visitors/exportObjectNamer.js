Object.defineProperty(exports, "__esModule", { value: true });
exports.collectDefaultObjectAssignments = void 0;
const estraverse_1 = require("estraverse");
const astTools_1 = require("../../../abstract_representation/es_tree_stuff/astTools");
/**
 * TransformFunction for flattening object assignments to module.exports.
 * @param js the JSFile to transform
 */
exports.collectDefaultObjectAssignments = function (js) {
    let internalVis = {
        enter: (node, parent) => {
            if (node.type === "ExpressionStatement") {
                let child = node.expression;
                let grandChild;
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
                                let indexOf = body.indexOf(node);
                                child.right.properties.reverse().forEach((e) => {
                                    if (e.type === "Property" && (e.key.type === "Identifier" || e.key.type === "Literal") && astTools_1.isExpr(e.value.type)) {
                                        if (e.key.type === "Identifier") {
                                            body.splice(indexOf, 0, createNamedAssignment(e.key.name, e.value));
                                        }
                                        else if (e.key.type === "Literal") {
                                            body.splice(indexOf, 0, createNamedAssignment(e.key.value.toString(), e.value));
                                        }
                                        else {
                                            //nothing, placeholder in case another type comes sup.
                                            throw new Error("unreachable code. unexpected type of property key");
                                        }
                                    }
                                });
                                indexOf = body.indexOf(node);
                                body.splice(indexOf, 1);
                            }
                        }
                    }
                }
            }
        }
    };
    estraverse_1.traverse(js.getAST(), internalVis);
};
function createNamedAssignment(named, assignable, op = "=") {
    return {
        type: "ExpressionStatement",
        expression: {
            type: "AssignmentExpression",
            operator: op,
            left: {
                type: "MemberExpression",
                computed: false,
                object: {
                    type: "MemberExpression",
                    computed: false,
                    object: {
                        type: "Identifier",
                        name: "module"
                    },
                    property: {
                        type: "Identifier",
                        name: "exports"
                    }
                },
                property: {
                    type: "Identifier",
                    name: named
                }
            },
            right: assignable
        }
    };
}
