Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var path_1 = require("path");
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
                    // console.log(joinedJson)
                    // console.log(`getdir\t`+js.getDir())
                    // console.log(`getdir\t`+js.getRelative())
                    // console.log(joinedJson.replace(js.getDir(),''))
                    // console.log(relative(js.getDir(), joinedJson, null))
                    var json = joinedJson.replace(js.getDir(), '')
                        .substr(1); //relative(js.getDir(), joinedJson, null)
                    var jsonFile = void 0;
                    try {
                        jsonFile = project.getJSON(json);
                    }
                    catch (err) {
                        console.log("getJson threw ex : " + json);
                        console.log("error was " + err);
                        throw err;
                    }
                    var fileData = "module.exports = ";
                    try {
                        fileData += jsonFile.getText();
                        // let outfile = joinedJson + suffix;
                    }
                    catch (e4) {
                        console.log("JSON : " + json);
                        console.log('caught getText exception.');
                        console.log("has file data:  " + (fileData !== '') + '\n' + e4);
                        throw e4;
                    }
                    try {
                        project.addJS(json + suffix, fileData);
                        node.arguments[0].value = requireString + suffix;
                    }
                    catch (err) {
                        console.log("addJS of " + (json + suffix) + " threw exception...");
                        console.log(" ^ tried to create file but failed\nwith error " + err + "\n\n");
                        throw err;
                    }
                }
            }
        };
        estraverse_1.traverse(js.getAST(), visitor);
    };
};
