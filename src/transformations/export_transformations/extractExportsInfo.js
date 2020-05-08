Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var esprima_1 = require("esprima");
function getModuleExportsAccesses() {
}
exports.getModuleExportsAccesses = getModuleExportsAccesses;
var count = 0;
var exportAccessGetter = function (node, parent) {
    if (node.type === "MemberExpression") { //&& parent.type !=="AssignmentExpression"
        if (node.object.type === "Identifier"
            && node.property.type === "Identifier"
            && ((node.object.name === "module" && node.property.name === "exports")
                || node.object.name === "exports")) {
            count++;
            // console.log(generate(parent))
        }
    }
};
var visitor = {
    enter: exportAccessGetter
};
function hasIt(testNode) {
    var hasModEx = false;
    estraverse_1.traverse(testNode, {
        enter: function (node, parent) {
            if (node.type === "MemberExpression") { //&& parent.type !=="AssignmentExpression"
                if (node.object.type === "Identifier"
                    && node.property.type === "Identifier"
                    && ((node.object.name === "module"
                        && node.property.name === "exports")
                        || node.object.name === "exports")) {
                    hasModEx = true;
                }
            }
        }
    });
    return hasModEx;
}
var metaVisitor = {
    enter: function (node, parent) {
        if (node.type === "MemberExpression" && parent.type !== "MemberExpression") {
            if (hasIt(node)) {
                if (parent.type !== "AssignmentExpression" || (parent.type === "AssignmentExpression" && parent.left !== node)) {
                    count++;
                    // console.log(`Detected:
                    // The Node: ${generate(node)}
                    // The Parent: ${generate(parent)}
                    //          `)
                }
            }
        }
        else if (node.type === "Identifier" && node.name === "exports" && parent.type !== "MemberExpression") {
            count++;
            // console.log(`Detected:
            //         The Node: ${generate(node)}
            //         The Parent: ${generate(parent)}
            //                  `)
        }
    }
};
var program = "\n//red herrings \nmodule.exports.hello = \"hello\"\nexports.world =  \"world\"\n\n//1,2\nmodule.exports = module.exports.hello+\" \"+exports.world\n//3\nexports.hello_world = module.exports +\"world\"\n\n//4\nif(module.exports){\n//5\nif(exports){\n//6\nmodule.exports.log(\"hello_world\");\n\n}else{\n//7\nlet u = module.exports\n//8\nlet v = exports\n//9\nlet w = module.exports.hello_world\n}\n}\n\n//10,11 \nmodule.exports.fun(module.exports.arg);\n\n";
var ast = esprima_1.parseScript(program);
function hasDefaultExport(js) {
    var hasDefault = false;
    // js.getAST()
    estraverse_1.traverse(ast, {
        enter: function (node, parent) {
            var child;
            if (parent
                && parent.type === "ExpressionStatement"
                && node.type === "AssignmentExpression"
                && node.left.type === "MemberExpression") {
                child = node.left;
                if (child.object.type === "Identifier"
                    && child.property.type === "Identifier"
                    && (child.object.name === "module"
                        && child.property.name === "exports")) {
                    hasDefault = true;
                }
            }
        }
    });
    return hasDefault;
}
// traverse(ast, {
//         enter: (node: Node, parent: Node) => {
//             let child: MemberExpression
//
//             if (parent.type === "ExpressionStatement"
//                 && node.type === "AssignmentExpression"
//                 && node.left.type === "MemberExpression") {
//                 child = node.left;
//
//                 if (
//                     child.object.type === "Identifier"
//                     && child.property.type === "Identifier"
//                     && (child.object.name === "module"
//                     && child.property.name === "exports")
//                 ) {
//
//                     //true
//
//                 }
//
//             }
//
//         }
//     }
// );
// console.log("  "+hasDefaultExport(null))
ast = esprima_1.parseScript("\nmodule.exports = 32\n");
console.log(" true: " + hasDefaultExport(null));
ast = esprima_1.parseScript("\nmodule.exports = {a:\"\",b:3}\n");
console.log(" true: " + hasDefaultExport(null));
ast = esprima_1.parseScript("\nmodule.exports.val = 32\nmodule.exports.d = \"x\"\nmodule.exports.v.x = {a:\"\",b:3}\n");
console.log(" false: " + hasDefaultExport(null));
ast = esprima_1.parseScript("\nlet x = module.exports\nx = module.exports\n");
console.log(" false: " + hasDefaultExport(null));
ast = esprima_1.parseScript("\nlet x = module.exports\nx = module.exports\nmodule.exports\n");
console.log(" false:  " + hasDefaultExport(null));
