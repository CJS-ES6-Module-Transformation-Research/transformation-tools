Object.defineProperty(exports, "__esModule", { value: true });
var esprima_1 = require("esprima");
function dirname(js) {
    js.rebuildNamespace();
    if (!js.namespaceContains('__dirname')) {
        return;
    }
    var ast = js.getAST();
    var path, url;
    path = js.getNamespace().generateBestName('dirname').name;
    url = js.getNamespace().generateBestName('fileURLToPath').name;
    js.getImportManager().createNamedWithAlias('path', 'dirname', path);
    js.getImportManager().createNamedWithAlias('url', 'fileURLToPath', url);
    var importMetaUrl = "import.meta.url";
    var replace = js.getNamespace().generateBestName("IMPORT_META_URL").name;
    js.registerReplace(replace, importMetaUrl);
    var __filename = {
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "__filename"
                },
                "init": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": url
                    },
                    "arguments": [
                        {
                            "type": "Identifier",
                            "name": replace
                        }
                    ]
                }
            }
        ],
        "kind": "const"
    };
    var __dirname = {
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "__dirname"
                },
                "init": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": path
                    },
                    "arguments": [
                        {
                            "type": "Identifier",
                            "name": "__filename"
                        }
                    ]
                }
            }
        ],
        "kind": "const"
    };
    js.addToTop(__filename);
    js.addToTop(__dirname);
}
exports.dirname = dirname;
var theMod = esprima_1.parseModule("\nimport path from 'path'\nimport url from 'url'\nconst __filename = url.fileURLToPath(IMPORTMETAURL);\nconst __dirname = path.dirname(__filename);\n").body.filter(function (e) { return e.type === "VariableDeclaration"; });
// theMod.forEach(e => console.log(JSON.stringify(e, null, 3)))
// ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                                                                                                                                                                                `                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
