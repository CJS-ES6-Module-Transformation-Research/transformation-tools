import {traverse, VisitorOption} from "estraverse";
import {CallExpression, VariableDeclaration, VariableDeclarator} from 'estree'
import {
	createRequireDec,
	RequireDeclaration,
	RequireExpression,
	TransformFunction
} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {createRequireDecl} from "../../../abstract_representation/es_tree_stuff/astTools";
import {InfoTracker} from "../../../InfoTracker";


export const add__dirname: TransformFunction = (js: JSFile) => {
	let i = 0;
 	let seenDirname: boolean = false
	let seenFilename: boolean = false
	traverse(js.getAST(), {
		enter: (node, parentNode) => {
			if (node.type === "Identifier") {
				switch (node.name) {
					case "__dirname":
						seenDirname = true;
						seenFilename = true;
						return VisitorOption.Break
						break;
					case "__filename":
						seenFilename = true;
						break;
				}

			}
		}
	})


	if (js.namespaceContains('__dirname')|| seenDirname) {


		addDirname(js);


	} else if (js.namespaceContains('__filename')|| seenFilename) {


		addFilename(js);


	} else {


		return;
	}



}


function addFilename(js: JSFile) {
	let requireTracker: InfoTracker = js.getInfoTracker();
	let url: string;
	let rdecl = requireTracker.getIfExists('url')
	if (rdecl) {
		url = rdecl.identifier.name;
	} else {
		url = js.getNamespace().generateBestName('url').name
		// requireTracker.insertImportPair(url, 'url')
		// requireTracker.insertImportPair(url, 'url')
		let reqDecl:RequireDeclaration =createRequireDec(url,'url')
		// requireTracker.insertRequireImport(reqDecl)

	}

	const temp_import_meta: string = js.getNamespace().generateBestName("IMPORT_META_URL").name;
	js.registerReplace(temp_import_meta, `import.meta.url`)
	js.getNamespace().addToNamespace(temp_import_meta)
	let toAdd = create__filename(url, temp_import_meta)
	js.addToTop(toAdd);
	js.getNamespace().addToNamespace(url)

}

function addDirname(js: JSFile) {
	addFilename(js);
	// let  pathId//  = js.getNamespace().generateBestName('dirname').name
	// js.getImportManager().createNamedWithAlias('path', 'dirname', path);


	let requireTracker: InfoTracker = js.getInfoTracker()


	let _path = requireTracker.getIfExists('path')
	let varDecl: VariableDeclaration
	let pathId
	if (_path) {
		pathId = _path.identifier.name;
	} else {
		pathId = js.getNamespace().generateBestName('path')
		requireTracker.insertRequireImport(createRequireDec(pathId.name, 'path'))
		// requireTracker.insertImportPair(pathId.name, 'path')

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

	let callToURLModule: CallExpression = {
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
			arguments: [{type: "Identifier", name: "__filename"}]
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
	let _r: (RequireExpression|RequireDeclaration)[] = []
	js.getInfoTracker().getDeclarations().forEach((e:RequireExpression|RequireDeclaration) => _r.push(e))
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
