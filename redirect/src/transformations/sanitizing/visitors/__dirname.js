Object.defineProperty(exports, "__esModule", { value: true });
exports.req_filler = exports.addLocationVariables = void 0;
exports.addLocationVariables = (js) => {
    if (js.namespaceContains('__dirname')
        && js.namespaceContains('__filename')) {
        console.log('dirname_+');
        addDirname(js);
    }
    else if (js.namespaceContains('__filename')) {
        addFilename(js);
        console.log('filename');
    }
    else if (js.namespaceContains('__dirname')) {
        addDirname(js);
        console.log('dirname+*');
    }
    else {
        console.log('n/a supposedly ');
        return;
    }
};
function addFilename(js) {
    let requireTracker = js.getRequireTracker();
    let url;
    let rdecl = requireTracker.getIfExists('url');
    if (rdecl) {
        url = rdecl.identifier.name;
    }
    else {
        url = js.getNamespace().generateBestName('url').name;
        requireTracker.insertBlind(url, 'url', true);
    }
    const temp_import_meta = js.getNamespace().generateBestName("IMPORT_META_URL").name;
    js.registerReplace(temp_import_meta, `import.meta.url`);
    let toAdd = create__filename(url, temp_import_meta);
    js.addToTop(toAdd);
    js.getNamespace().addToNamespace(url);
}
function addDirname(js) {
    addFilename(js);
    // let  pathId//  = js.getNamespace().generateBestName('dirname').name
    // js.getImportManager().createNamedWithAlias('path', 'dirname', path);
    let requireTracker = js.getRequireTracker();
    let _path = requireTracker.getIfExists('path');
    let varDecl;
    let pathId;
    if (_path) {
        pathId = _path.identifier.name;
    }
    else {
        pathId = js.getNamespace().generateBestName('path');
        requireTracker.insertBlind(pathId.name, 'path', true);
    }
    js.addToTop(create__dirname(pathId));
    js.getNamespace().addToNamespace(pathId);
    //
}
function create__filename(url, import_meta_url) {
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
    let callToURLModule = {
        arguments: [
            {
                "type": "Identifier",
                "name": import_meta_url
            }
        ],
        callee: {
            type: "MemberExpression",
            computed: false,
            object: {
                "type": "Identifier",
                "name": url
            },
            property: {
                "type": "Identifier",
                "name": 'fileURLToPath'
            }
        },
        type: "CallExpression"
    };
    let filename_decltr = {
        type: "VariableDeclarator",
        id: {
            type: "Identifier",
            name: "__filename"
        },
        init: callToURLModule
    };
    return {
        type: "VariableDeclaration",
        declarations: [
            filename_decltr
        ],
        "kind": "var"
    };
}
;
function create__dirname(_path) {
    let _init = {
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
        arguments: [{ type: "Identifier", name: "__filename" }]
    };
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
    };
}
exports.req_filler = (js) => {
    let _r = [];
    js.getRequireTracker().getList().forEach(e => _r.push(e));
    let body = js.getAST().body;
    _r.reverse().forEach(e => body.splice(0, 0, e));
};
// let x = {
//     "type": "VariableDeclarator",
//     "id": {
//     "type": "Identifier",
//         "name": "__filename"
// },
//     "init":
// }
