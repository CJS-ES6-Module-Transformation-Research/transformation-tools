Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var path_1 = require("path");
var fs_1 = require("fs");
exports.jsonRequire = function (project) {
    return function (js) {
        var re = new RegExp('.+\.json$');
        var visitor = {
            enter: function (node, parent) {
                if (node.type === "CallExpression"
                    && node.callee.type === "Identifier"
                    && node.callee.name === "require"
                    && node.arguments[0].type === "Literal"
                    && re.test(node.arguments[0].value.toString())) {
                    var requireString = node.arguments[0].value.toString();
                    var joinedJson = path_1.join(path_1.dirname(js.getAbsolute()), requireString);
                    var suffix = ".export.js";
                    var regex = void 0;
                    regex = new RegExp('.+\.json[0-9]+');
                    var json = joinedJson.replace(js.getDir(), '')
                        .substr(1); //relative(js.getDir(), joinedJson, null)
                    var i = -1;
                    while (fs_1.existsSync(js.getDir() + "/" + json + i + suffix)) {
                        i++;
                    }
                    var infix = i > -1 ? "" + i : '';
                    if (project.getJS(json + infix + suffix) === undefined) {
                        var fileData = "module.exports = "
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
