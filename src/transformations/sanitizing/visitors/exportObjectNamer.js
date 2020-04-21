Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var astTools_1 = require("../../../abstract_representation/es_tree_stuff/astTools");
var exportsTools_1 = require("../../../abstract_representation/es_tree_stuff/exportsTools");
function collectDefaultObjectAssignments(js) {
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
                                    if (e.type === "Property" && e.key.type === "Identifier" && astTools_1.isExpr(e.value.type)) {
                                        body_1.splice(indexOf_1, 0, exportsTools_1.createNamedAssignment(e.key.name, e.value));
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
}
exports.collectDefaultObjectAssignments = collectDefaultObjectAssignments;
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
                            var body_2 = parent.body;
                            var indexOf_2 = body_2.indexOf(node);
                            child.right.properties.reverse().forEach(function (e) {
                                if (e.type === "Property" && e.key.type === "Identifier" && astTools_1.isExpr(e.value.type)) {
                                    body_2.splice(indexOf_2, 0, exportsTools_1.createNamedAssignment(e.key.name, e.value));
                                }
                            });
                            indexOf_2 = body_2.indexOf(node);
                            body_2.splice(indexOf_2, 1);
                        }
                    }
                }
            }
        }
    }
};
// let ast = parseScript(      `
// module.exports = {hello:"world",jack:"sparrow",three:3}
// exports= {a:"b",c:"d",four:4}
// `);
//
// traverse(ast , internalVis)
//
//
//
//
// console.log((generate(ast)))
