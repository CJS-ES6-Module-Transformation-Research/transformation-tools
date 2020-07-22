Object.defineProperty(exports, "__esModule", { value: true });
exports.requireStringSanitizer = void 0;
const requireStringTransformer_1 = require("../requireStringTransformer");
// import {JSFile} from "../../../abstract_representation/project_representation/javascript/JSFile";
const estraverse_1 = require("estraverse");
const path_1 = require("path");
/**
 * Require string sanitizer visitor. Type of TransformFunction.
 * @param js a JSFile
 */
exports.requireStringSanitizer = function (js) {
    let requireStringTF = new requireStringTransformer_1.RequireStringTransformer(path_1.dirname(js.getAbsolute()), js.getParent().getPackageJSON().getMain());
    let visitor = {
        enter: function (node) {
            if (node.type === "CallExpression"
                && node.callee.type === "Identifier"
                && node.callee.name === "require"
                && node.arguments[0].type === "Literal") {
                let literal = node.arguments[0];
                let requireString = requireStringTF.getTransformed(literal.value.toString());
                literal.value = requireString;
                literal.raw = `'${requireString}'`;
            }
        }
    };
    estraverse_1.traverse(js.getAST(), visitor);
};
