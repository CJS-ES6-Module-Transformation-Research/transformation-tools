Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var astTools_1 = require("../../../abstract_representation/es_tree_stuff/astTools");
var exportsTools_1 = require("../../../abstract_representation/es_tree_stuff/exportsTools");
exports.collectDefaultObjectAssignments = function (js) {
    var internalVis = {
        enter: function (node, parent) {
            if (node.type === "ExpressionStatement") {
                var child = node.expression;
                var grandChild = void 0;
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
                                var body_1 = parent.body;
                                var indexOf_1 = body_1.indexOf(node);
                                child.right.properties.reverse().forEach(function (e) {
                                    if (e.type === "Property" && (e.key.type === "Identifier" || e.key.type === "Literal") && astTools_1.isExpr(e.value.type)) {
                                        if (e.key.type === "Identifier") {
                                            body_1.splice(indexOf_1, 0, exportsTools_1.createNamedAssignment(e.key.name, e.value));
                                        }
                                        else if (e.key.type === "Literal") {
                                            body_1.splice(indexOf_1, 0, exportsTools_1.createNamedAssignment(e.key.value.toString(), e.value));
                                        }
                                        else {
                                            //nothing, placeholder in case another type comes sup.
                                            throw new Error("unreachable code. unexpected type of property key");
                                        }
                                    }
                                });
                                indexOf_1 = body_1.indexOf(node);
                                body_1.splice(indexOf_1, 1);
                            }
                        }
                    }
                }
            }
        }
    };
    estraverse_1.traverse(js.getAST(), internalVis);
};
