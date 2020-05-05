var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var path_1 = require("path");
var relative_1 = __importDefault(require("relative"));
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
                    // const file = join(js.getDir(), js.getRelative());
                    // const dir = ;
                    var joinedJson = path_1.join(path_1.dirname(js.getAbsolute()), requireString);
                    var suffix = ".export.js";
                    var json = relative_1.default(js.getDir(), joinedJson, null);
                    var jsonFile = project.getJSON(json);
                    var fileData = "module.exports = " + jsonFile.getText();
                    // let outfile = joinedJson + suffix;
                    project.addJS(json + suffix, fileData);
                    node.arguments[0].value = requireString + suffix;
                }
            }
        };
        estraverse_1.traverse(js.getAST(), visitor);
    };
};
