Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../../Types");
var requireStringTransformer_1 = require("../../../src/tools/sanitize_tools/requireStringTransformer");
exports.requireStringSanitizer = function (astFile) {
    console.log('called');
    return {
        enter: function (node) {
            var requireStringTF = new requireStringTransformer_1.RequireStringTransformer(astFile.dir);
            var callExpr;
            var callee;
            if (Types_1.isCallExpr(node)) {
                callExpr = node;
                if (Types_1.isIdentifier(callExpr.callee)) {
                    callee = callExpr.callee;
                    if (callee && Types_1.isIdentifier(callee) && callee.alias === "require") {
                        if (Types_1.isLiteral(callExpr.arguments[0])) {
                            var literal = callExpr.arguments[0];
                            var requireString = void 0;
                            if (literal.value) { //TODO remove? Type changed from Literal to SimpleLiteral -- verify works
                                // all literals of this type should have a value field
                                var tmp = literal.value;
                                requireString = requireStringTF.getTransformed("" + literal.value);
                                literal.value = requireString;
                                literal.raw = "'" + requireString + "'";
                            }
                        }
                    }
                }
            }
        }
    };
};
