Object.defineProperty(exports, "__esModule", { value: true });
var requireStringTransformer_1 = require("../requireStringTransformer");
var estraverse_1 = require("estraverse");
exports.requireStringSanitizer = function (js) {
    var requireStringTF = new requireStringTransformer_1.RequireStringTransformer(js.getDir());
    var visitor = {
        enter: function (node) {
            if (node.type === "CallExpression"
                && node.callee.type === "Identifier"
                && node.callee.name === "require"
                && node.arguments[0].type === "Literal") {
                var literal = node.arguments[0];
                var requireString = requireStringTF.getTransformed(literal.value.toString());
                literal.value = requireString;
                literal.raw = "'" + requireString + "'";
            }
        }
        // {
        //     let requireStringTF: RequireStringTransformer = new RequireStringTransformer(js.getDir())
        //     let callExpr: CallExpression
        //     let callee:Identifier
        //     if (isCallExpr(node)) {
        //         callExpr = node
        //         if (isIdentifier(callExpr.callee)) {
        //             callee = callExpr.callee
        //             if (callee && isIdentifier(callee) && (callee as Identifier).name === "require") {
        //                 if (isLiteral(callExpr.arguments[0])) {
        //                     let literal = callExpr.arguments[0]
        //                     let requireString: string
        //                     if (literal.value) {//TODO remove? Type changed from Literal to SimpleLiteral -- verify works
        //                         // all literals of this type should have a value field
        //                         requireString = requireStringTF.getTransformed(`${literal.value}`)
        //                         literal.value = requireString
        //                         literal.raw = `'${requireString}'`
        //                     }
        //                 }
        //             }
        //         }
        //
        //     }
        // }
    };
    estraverse_1.traverse(js.getAST(), visitor);
};
