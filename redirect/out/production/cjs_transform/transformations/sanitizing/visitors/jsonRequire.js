Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonRequire = void 0;
const estraverse_1 = require("estraverse");
const path_1 = require("path");
const fs_1 = require("fs");
/**
 * TransformFunction for creating a JSONFile from a require string of the form '*.json'.
 * @param project the TransformableProject.
 */
exports.jsonRequire = function (project) {
    return function (js) {
        let re = new RegExp('.+\.json$');
        let visitor = {
            enter: (node, parent) => {
                if (node.type === "CallExpression"
                    && node.callee.type === "Identifier"
                    && node.callee.name === "require"
                    && node.arguments[0].type === "Literal"
                    && re.test(node.arguments[0].value.toString())) {
                    const requireString = node.arguments[0].value.toString();
                    const joinedJson = path_1.join(path_1.dirname(js.getAbsolute()), requireString);
                    const suffix = ".export.js";
                    let regex;
                    regex = new RegExp('.+\.json[0-9]+');
                    let json = joinedJson.replace(js.getDir(), '')
                        .substr(1); //relative(js.getDir(), joinedJson, null)
                    let i = -1;
                    while (fs_1.existsSync(`${js.getDir()}/${json}${i}${suffix}`)) {
                        i++;
                    }
                    let infix = i > -1 ? `${i}` : '';
                    if (project.getJS(json + infix + suffix) === undefined) {
                        const fileData = "module.exports = "
                            + project
                                .getJSON(json)
                                .getText();
                        project.addJS(json + infix + suffix, fileData);
                    }
                    node.arguments[0].value = requireString + infix + suffix;
                }
            }
        };
        estraverse_1.traverse(js.getAST(), visitor);
    };
};
