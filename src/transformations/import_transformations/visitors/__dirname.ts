
import {Identifier, Node, VariableDeclaration} from 'estree'
import {TransformFunction} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";


export const dirname: TransformFunction = (js: JSFile) => {

    if (js.namespaceContains('__dirname')
        && js.namespaceContains('__filename')) {
        addDirname(js);
    } else if (js.namespaceContains('__filename')) {
        addFilename(js);
    } else if (js.namespaceContains('__dirname')) {
        addDirname(js)
    } else {
        return;
    }


    js.rebuildNamespace();


}


function addFilename(js:JSFile){
    let  url = js.getNamespace().generateBestName('fileURLToPath').name
    js.getImportManager().createNamedWithAlias('url', 'fileURLToPath', url);

    //desired final string
    const true_import_meta_url = `import.meta.url`

    //temp string because import.meta.url is invalid when using escodegen.generate()
    const temp_import_meta: string = js.getNamespace().generateBestName("IMPORT_META_URL").name;
    js.registerReplace(temp_import_meta, true_import_meta_url)
    js.addToTop(create__filename(url, temp_import_meta));

}
function addDirname(js:JSFile){
    addFilename(js);
    let  path = js.getNamespace().generateBestName('dirname').name
    js.getImportManager().createNamedWithAlias('path', 'dirname', path);
    js.addToTop(create__dirname(path));
    //
}
function create__filename(url: string, import_meta_url: string): VariableDeclaration {

    return {
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
        "kind": "var"
    };
}


function create__dirname(pathImportString: string): VariableDeclaration {
    return {
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
                        "name": pathImportString
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
        "kind": "var"
    }

}



