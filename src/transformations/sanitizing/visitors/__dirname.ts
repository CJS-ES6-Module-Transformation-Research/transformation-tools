import {CallExpression, MemberExpression, VariableDeclaration, VariableDeclarator} from 'estree'
import {TransformFunction} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {RequireTracker} from "../../../RequireTracker";


export const addLocationVariables: TransformFunction = (js: JSFile) => {

    if (js.namespaceContains('__dirname')
        && js.namespaceContains('__filename')) {
        console.log('dirname_+')
        addDirname(js);
    } else if (js.namespaceContains('__filename')) {
        addFilename(js);
        console.log('filename')

    } else if (js.namespaceContains('__dirname')) {
        addDirname(js)
        console.log('dirname+*')

    } else {

        return;
    }


}


function addFilename(js: JSFile) {
    let requireTracker: RequireTracker = js.getRequireTracker();
    let url: string;
    let rdecl = requireTracker.getIfExists('url')
    if (rdecl) {
        url = rdecl.identifier.name;
    } else {
        url = js.getNamespace().generateBestName('url').name
        requireTracker.insertBlind(url, 'url', true)

    }

    const temp_import_meta: string = js.getNamespace().generateBestName("IMPORT_META_URL").name;
    js.registerReplace(temp_import_meta, `import.meta.url`)
    let toAdd = create__filename(url, temp_import_meta)
    js.addToTop(toAdd);
    js.getNamespace().addToNamespace(url)

}

function addDirname(js: JSFile) {
    addFilename(js);
    // let  pathId//  = js.getNamespace().generateBestName('dirname').name
    // js.getImportManager().createNamedWithAlias('path', 'dirname', path);


    let requireTracker: RequireTracker = js.getRequireTracker()


    let _path = requireTracker.getIfExists('path')
    let varDecl: VariableDeclaration
    let pathId
    if (_path) {
        pathId = _path.identifier.name;
    } else {
        pathId = js.getNamespace().generateBestName('path')
        requireTracker.insertBlind(pathId.name, 'path', true)

    }

    js.addToTop(create__dirname(pathId));
    js.getNamespace().addToNamespace(pathId)


    //
}

function create__filename(url: string, import_meta_url: string): VariableDeclaration {

    // let callToURLModule: MemberExpression = {
    //     computed: false,
    //
    //     object: {
    //         type: "Identifier",
    //         name: url
    //     },
    //     type: "MemberExpression", property: {
    //         "type": "CallExpression",
    //         "callee": {
    //             "type": "Identifier",
    //             "name": 'fileURLToPath'
    //         },
    //         "arguments": [
    //             {
    //                 "type": "Identifier",
    //                 "name": import_meta_url
    //             }
    //         ]
    //     }
    // }

    let callToURLModule:CallExpression= {
        arguments: [
        {
            "type": "Identifier",
            "name": import_meta_url
        }
    ],
        callee:{
            type:"MemberExpression",
        computed:false,
            
            object : {
                "type": "Identifier",
                "name": url
            },
             property:   {
                 "type": "Identifier",
                 "name": 'fileURLToPath'
             }
            
        },
        type:"CallExpression"
    }


    let filename_decltr: VariableDeclarator = {

        type: "VariableDeclarator",
        id: {
            type: "Identifier",
            name: "__filename"
        },
        init: callToURLModule
    }
    return {
        type: "VariableDeclaration",
        declarations: [
            filename_decltr
        ],
        "kind": "var"
    }
};


function create__dirname(_path): VariableDeclaration {
    let _init: CallExpression =

        {
            type: "CallExpression",
            callee: {
                type: "MemberExpression",
                object: {
                    type: "Identifier",
                    name: _path
                },
                property: {
                    type: "Identifier",
                    name: 'dirname'
                }, computed: false
            },
            arguments:[{type:"Identifier",name:"__filename"}]
        }
    //     type: "CallExpression",
    //         callee:
    // }
    // computed: false,
    //
    //     object: {
    //     type: "Identifier",
    //         name: _path


    //     property: {
    //     "type": "MemberExpression",
    //         "type": "Identifier",
    //         "name": 'dirname'
    //     "arguments": [
    //         {
    //             "type": "Identifier",
    //             "name": "__filename"
    //         }]
    // }


    return {
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "__dirname"
                },
                "init": _init
            }
        ],


        "kind": "var"
    }

}

export let req_filler = (js: JSFile) => {
    let _r: VariableDeclaration[] = []
    js.getRequireTracker().getList().forEach(e => _r.push(e))
    let body = js.getAST().body
    _r.reverse().forEach(e => body.splice(0, 0, e))
}

// let x = {
//     "type": "VariableDeclarator",
//     "id": {
//     "type": "Identifier",
//         "name": "__filename"
// },
//     "init":
// }
