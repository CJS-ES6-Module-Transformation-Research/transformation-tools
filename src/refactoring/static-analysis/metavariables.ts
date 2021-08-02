import {JSFile} from "../../filesystem";
import {Identifier, VariableDeclaration, VariableDeclarator} from "estree";
import {id} from "../../utility";

export function metavariables(js: JSFile) {
    let smv = js.getSeenMetaVariables()

    let urlID = addModule('url', js)


    let decls: VariableDeclaration[] = []


    if (!(smv.seenFilename || smv.seenDirname)) {
        return;
    }


    decls.push({
        type: "VariableDeclaration",
        kind: 'var',
        declarations: [get$filename(urlID, js.getNamespace().getImportMeta(js))]
    })

    if (smv.seenDirname) {
        let pathID = addModule('path', js)
        decls.push({
            type: "VariableDeclaration", kind: 'var', declarations: [{
                type: "VariableDeclarator",
                id: id('__dirname'),
                init: {
                    type: "CallExpression",
                    callee: {
                        type: "MemberExpression",
                        object: pathID,
                        property: id('dirname'),
                        computed: false
                    },
                    arguments: [id('__filename')]
                }
            }
            ]
        })
    }

    js.getBody().splice(0, 0, ...decls)
}

function addModule(ms: string, js: JSFile): Identifier {
    let inter = js.getIntermediate()
    let ms2id = inter.ms_to_id
    if (!ms2id[ms]) {
        let _id: Identifier = js.getNamespace().generateBestName(ms)
        let id2ms = inter.id_to_ms
        let order = inter.load_order

        ms2id[ms] = _id.name
        id2ms[_id.name] = ms
        if (!order.includes(ms)) {
            order.push(ms)
        }
    }
    return id(ms2id[ms])

}

function get$filename(urlID: Identifier, import_meta_url): VariableDeclarator {
    return {
        type: "VariableDeclarator",
        id: id('__filename'),
        init:
            {


                    type: "CallExpression",
                    callee: {
                        type: "MemberExpression",
                        computed: false,
                        object: urlID,
                        property: id("fileURLToPath"),
                    },
                    arguments: [import_meta_url]
                }

    }

}





