Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var esprima_1 = require("esprima");
var escodegen_1 = require("escodegen");
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
            // console.log(`NODE, PARENT`)
            // console.log(generate(node))
            console.log(escodegen_1.generate(parent));
            // console.log(``)
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
                    && ((node.object.name === "module" && node.property.name === "exports")
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
                    console.log("Detected: \n                    The Node: " + escodegen_1.generate(node) + "\n                    The Parent: " + escodegen_1.generate(parent) + "\n                             ");
                }
            }
        }
        else if (node.type === "Identifier" && node.name === "exports" && parent.type !== "MemberExpression") {
            count++;
            console.log("Detected: \n                    The Node: " + escodegen_1.generate(node) + "\n                    The Parent: " + escodegen_1.generate(parent) + "\n                             ");
        }
    }
};
var program = "\n//red herrings \nmodule.exports.hello = \"hello\"\nexports.world =  \"world\"\n\n//1,2\nmodule.exports = module.exports.hello+\" \"+exports.world\n//3\nexports.hello_world = module.exports +\"world\"\n\n//4\nif(module.exports){\n//5\nif(exports){\n//6\nmodule.exports.log(\"hello_world\");\n\n}else{\n//7\nlet u = module.exports\n//8\nlet v = exports\n//9\nlet w = module.exports.hello_world\n}\n}\n\n//10,11 \nmodule.exports.fun(module.exports.arg);\n\n";
var ast = esprima_1.parseScript(program);
estraverse_1.traverse(ast, metaVisitor);
console.log("count: " + count);
