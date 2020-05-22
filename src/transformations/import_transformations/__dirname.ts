import {TransformFunction} from "../Transformer";
import {JSFile} from "../../abstract_representation/project_representation";
import {parseModule, parseScript, Program} from "esprima";
import {traverse, Visitor} from "estraverse";
import {Identifier, Node, VariableDeclaration} from 'estree'
import {generate} from "escodegen";


export function dirname(js: JSFile): TransformFunction {
    js.rebuildNamespace();
    if (!(js.namespaceContains('__dirname') || js.namespaceContains('__filename'))) {
        return;
    }
    const ast: Program = js.getAST();
    let path: string, url: string;

    path = js.getNamespace().generateBestName('dirname').name
    url = js.getNamespace().generateBestName('fileURLToPath').name

    js.getImportManager().createNamedWithAlias('path', 'dirname', path);
    js.getImportManager().createNamedWithAlias('url', 'fileURLToPath', url);

    const importMetaUrl = `import.meta.url`
    const import_meta_url: string = js.getNamespace().generateBestName("IMPORT_META_URL").name;
    js.registerReplace(import_meta_url, importMetaUrl)
    const __filename: VariableDeclaration =
        {
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
                                "name": import_meta_url
                            }
                        ]
                    }
                }
            ],
            "kind": "const"
        };
    const __dirname: VariableDeclaration = {
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
    }

    js.addToTop(__filename);
    js.addToTop(__dirname);


}


let theMod = parseModule(`
import path from 'path'
import url from 'url'
const __filename = url.fileURLToPath(IMPORTMETAURL);
const __dirname = path.dirname(__filename);
`).body.filter(e => e.type === "VariableDeclaration")
// theMod.forEach(e => console.log(JSON.stringify(e, null, 3)))


// ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                                                                                                                                                                                `                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

