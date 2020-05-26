import {TransformFunction} from "src/transformations/Transformer";
import {JSFile} from "../../../abstract_representation/project_representation";
import {parseModule, parseScript, Program} from "esprima";
import {traverse, Visitor} from "estraverse";
import {Identifier, Node, VariableDeclaration} from 'estree'
import {generate} from "escodegen";


export const dirname:TransformFunction= (js: JSFile)=> {
    js.rebuildNamespace();
    //todo seperate
    // if (!(js.namespaceContains('__dirname') && ! js.namespaceContains('__filename'))) {
    //     return;
    // }



    const ast: Program = js.getAST();
    let path: string, url: string;

     path = js.getNamespace().generateBestName('dirname').name
    url = js.getNamespace().generateBestName('fileURLToPath').name

     js.getImportManager().createNamedWithAlias('path', 'dirname', path);
    js.getImportManager().createNamedWithAlias('url', 'fileURLToPath', url);


    //desired final string
    const true_import_meta_url = `import.meta.url`

    //temp string because import.meta.url is invalid when using escodegen.generate()
    const temp_import_meta: string = js.getNamespace().generateBestName("IMPORT_META_URL").name;

    js.registerReplace(temp_import_meta, true_import_meta_url)

    js.addToTop(create__dirname(path));
     js.addToTop(create__filename(url, temp_import_meta));
    js.rebuildNamespace();




}





function create__filename(url:string, import_meta_url:string):VariableDeclaration{

   return{  "type": "VariableDeclaration",
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


function create__dirname(pathImportString:string):VariableDeclaration{
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



// let js = new JSFile('','','','script',`
// let x=  __filename
// let y =  __dirname
// `)
//
// dirname(js)

// ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                                                                                                                                                                                `                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````









//
// const __filename: VariableDeclaration =
//     {
//         "type": "VariableDeclaration",
//         "declarations": [
//             {
//                 "type": "VariableDeclarator",
//                 "id": {
//                     "type": "Identifier",
//                     "name": "__filename"
//                 },
//                 "init": {
//                     "type": "CallExpression",
//                     "callee": {
//                         "type": "Identifier",
//                         "name": url
//                     },
//                     "arguments": [
//                         {
//                             "type": "Identifier",
//                             "name": import_meta_url
//                         }
//                     ]
//                 }
//             }
//         ],
//         "kind": "var"
//     };
//
//
//
// const __dirname: VariableDeclaration = {
//     "type": "VariableDeclaration",
//     "declarations": [
//         {
//             "type": "VariableDeclarator",
//             "id": {
//                 "type": "Identifier",
//                 "name": "__dirname"
//             },
//             "init": {
//                 "type": "CallExpression",
//                 "callee": {
//                     "type": "Identifier",
//                     "name": path
//                 },
//                 "arguments": [
//                     {
//                         "type": "Identifier",
//                         "name": "__filename"
//                     }
//                 ]
//             }
//         }
//     ],
//     "kind": "var"
// }






// ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                                                                                                                                                                                `                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
let js = new JSFile('','','','module','');
js.getNamespace().addToNamespace('__filename')
js.getNamespace().addToNamespace('__dirname')
dirname(js);
console.log(js.makeString())





