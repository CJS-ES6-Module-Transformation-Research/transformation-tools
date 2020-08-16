import {traverse, VisitorOption} from "estraverse";
import {CallExpression, Expression, Identifier, Program, VariableDeclaration, VariableDeclarator} from 'estree'
import {
	createRequireDec,
	id,
	RequireDeclaration,
	RequireExpression,
	TransformFunction
} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {Namespace} from "../../../abstract_fs_v2/Namespace";
import {InfoTracker} from "../../../InfoTracker";


const vals: { filename: (str: string) => VariableDeclaration, dirname: VariableDeclaration } = {
	filename: (str: string) => {
		return {
			"type":
				"VariableDeclaration",
			"declarations":
				[{
					"type": "VariableDeclarator",
					"id": {"type": "Identifier", "name": "__filename"},
					"init": {
						"type": "CallExpression",
						"callee": {
							"type": "MemberExpression",
							"computed": false,
							"object": {
								"type": "CallExpression",
								"callee": {"type": "Identifier", "name": "require"},
								"arguments": [{"type": "Literal", "value": "url", "raw": "'url'"}]
							},
							"property": {"type": "Identifier", "name": "fileURLToPath"}
						},
						"arguments": [{"type": "Identifier", "name": str}]
					}
				}],
			"kind":
				"var"
		}
	},
	dirname: {
		"type": "VariableDeclaration",
		"declarations": [{
			"type": "VariableDeclarator",
			"id": {"type": "Identifier", "name": "__dirname"},
			"init": {
				"type": "CallExpression",
				"callee": {
					"type": "MemberExpression",
					"computed": false,
					"object": {
						"type": "CallExpression",
						"callee": {"type": "Identifier", "name": "require"},
						"arguments": [{"type": "Literal", "value": "path", "raw": "'path'"}]
					},
					"property": {"type": "Identifier", "name": "dirname"}
				},
				"arguments": [{"type": "Identifier", "name": "__filename"}]
			}
		}],
		"kind": "var"
	}

}

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


		let import_meta_url =js.getNamespace().getImportMeta()


	if (js.namespaceContains('__dirname') || seenDirname) {
 		js.getAST().body.splice(0, 0, vals.filename(import_meta_url.name), vals.dirname)
		// addFilename(js)
		// refact(js, create__dirname, 'path');

		js.registerReplace(import_meta_url.name, `import.meta.url`)

	} else if (js.namespaceContains('__filename') || seenFilename) {

		js.getAST().body.splice(0, 0, vals.filename(import_meta_url.name))

		// addFilename(js);
		js.registerReplace(import_meta_url.name, `import.meta.url`)


	}



}


// function addFilename(js: JSFile) {
// 	refact(js, create__filename, 'url')
// 	// let requireTracker: InfoTracker = js.getInfoTracker();
// 	// let url: string;
// 	// let rdecl = requireTracker.getIfExists('url')
// 	// if (rdecl) {
// 	// 	url = rdecl.identifier.name;
// 	// } else {
// 	// 	url = js.getNamespace().generateBestName('url').name
// 	// 	// requireTracker.insertImportPair(url, 'url')
// 	// 	// requireTracker.insertImportPair(url, 'url')
// 	// 	let reqDecl:RequireDeclaration =createRequireDec(url,'url')
// 	// 	// requireTracker.insertRequireImport(reqDecl)
// 	//
// 	// }
//
// 	const import_meta_url: string = js.getNamespace().generateBestName("IMPORT_META_URL").name;
// 	js.getNamespace().addToNamespace(import_meta_url)
// 	// let toAdd = create__filename(url )
// 	// js.addToTop(toAdd);
// 	// js.getNamespace().addToNamespace(url)
// 	function create__filename(url: string): VariableDeclaration {
// 		let callToURLModule: CallExpression = {
// 			arguments: [
// 				{
// 					"type": "Identifier",
// 					"name": import_meta_url
// 				}
// 			],
// 			callee: {
// 				type: "MemberExpression",
// 				computed: false,
//
// 				object: {
// 					"type": "Identifier",
// 					"name": url
// 				},
// 				property: {
// 					"type": "Identifier",
// 					"name": 'fileURLToPath'
// 				}
//
// 			},
// 			type: "CallExpression"
// 		}
// 		let filename_decltr: VariableDeclarator = {
//
// 			type: "VariableDeclarator",
// 			id: {
// 				type: "Identifier",
// 				name: "__filename"
// 			},
// 			init: callToURLModule
// 		}
// 		return {
// 			type: "VariableDeclaration",
// 			declarations: [
// 				filename_decltr
// 			],
// 			"kind": "var"
// 		}
// 	};
//
// }

// function refact(js: JSFile, creator: (string) => VariableDeclaration, modSTR: string) {
// 	// addFilename(js);
// 	// let  pathId//  = js.getNamespace().generateBestName('dirname').name
// 	// js.getImportManager().createNamedWithAlias('path', 'dirname', path);
//
//
// 	let requireTracker: InfoTracker = js.getInfoTracker()
//
//
// 	// let _path = requireTracker.getIfExists(modSTR)
// 	let __thename = requireTracker.getFromDeMap(modSTR, "ms")
// 	if (!__thename) {
// 		__thename = js.getNamespace().generateBestName(modSTR).name;
// 		js.getNamespace().addToNamespace(__thename)
//
// 	}
// 	let __decl = createRequireDec(__thename, modSTR);
// 	js.addToTop(creator(__thename));
//
// 	//
// 	//
// 	// let varDecl: VariableDeclaration
// 	// let pathId
// 	// if (_path) {
// 	// 	pathId = _path.identifier.name;
// 	// } else {
// 	// 	pathId = js.getNamespace().generateBestName('path')
// 	// 	requireTracker.insertRequireImport(createRequireDec(pathId.name, 'path'))
// 	// 	// requireTracker.insertImportPair(pathId.name, 'path')
// 	//
// 	// }
// 	//
// 	// js.addToTop(create__dirname(pathId));
// 	// js.getNamespace().addToNamespace(pathId)
//
//
// 	//
//
// }
//
//
// function create__dirname(_path): VariableDeclaration {
// 	return {
// 		"type": "VariableDeclaration",
// 		"declarations": [
// 			{
// 				"type": "VariableDeclarator",
// 				"id": {
// 					"type": "Identifier",
// 					"name": "__dirname"
// 				},
// 				"init": {
// 					type: "CallExpression",
// 					callee: {
// 						type: "MemberExpression",
// 						object: {
// 							type: "Identifier",
// 							name: _path
// 						},
// 						property: {
// 							type: "Identifier",
// 							name: 'dirname'
// 						}, computed: false
// 					},
// 					arguments: [{type: "Identifier", name: "__filename"}]
// 				}
// 			}
// 		],
// 		"kind": "var"
// 	}
//
// }
//
// export let req_filler = (js: JSFile) => {
// 	let _r: (RequireExpression | RequireDeclaration)[] = []
// 	js.getInfoTracker().getDeclarations().forEach((e: RequireExpression | RequireDeclaration) => _r.push(e))
// 	let body = js.getAST().body
// 	_r.reverse().forEach(e => body.splice(0, 0, e))
// }
//
// export interface __dirnameInfo {
// 	fileUrlToPath: Identifier;
// 	dirname: Identifier;
// 	path: Identifier
// 	url: Identifier
// 	isNamed: boolean
// }
//
// type isDirname = "__dirname" | "__filename"
const __FILENAME: Identifier = {type: "Identifier", name: "__filename"}
const __DIRNAME: Identifier = {type: "Identifier", name: "__dirname"}

// export function __dirnameHandlerPlusPlus(js: JSFile, dirInfo: __dirnameInfo) {
// 	let vars: isDirname = hasLocationVar__(js.getAST())
// 	let ns: Namespace = js.getNamespace()
// 	let import_meta_url = ns.getImportMeta().name
// 	js.registerReplace(import_meta_url, `import.meta.url`)
// 	switch (vars) {
// 		case "__dirname":
// 			js.addToTop(filenameFrom())
// 			js.addToTop(dirnameFrom())
// 			break;
// 		case "__filename":
// 			js.addToTop(filenameFrom())
// 			break;
// 		default:
// 			return;
// 	}
// 	if (!vars) {
// 		return;
// 	}
//
//
// 	function dirnameFrom(): VariableDeclaration {
// 		return {
// 			"type": "VariableDeclaration",
// 			"declarations": [
// 				{
// 					"type": "VariableDeclarator",
// 					id: __DIRNAME,
// 					"init": {
// 						type: "CallExpression",
// 						callee: ({
// 							type: "MemberExpression",
// 							object: dirInfo.path,
// 							property: dirInfo.dirname,
// 							computed: false
// 						}),
// 						arguments: []
// 					}
// 				}
// 			],
// 			"kind": "var"
// 		}
// 	}
//
// 	function filenameFrom(): VariableDeclaration {
//
// 		return {
// 			type: "VariableDeclaration",
// 			declarations: [
// 				{
// 					type: "VariableDeclarator",
// 					id: __FILENAME,
// 					init: fileNameInit()
// 				}
// 			],
// 			"kind": "var"
// 		}
//
//
// 		function fileNameInit(): Expression {
// 			return {
// 				arguments: [
// 					id(import_meta_url)
//
// 				],
// 				callee: ({
// 					type: "MemberExpression",
// 					computed: false,
// 					object: dirInfo.url,
// 					property: dirInfo.fileUrlToPath
//
// 				}),
// 				type: "CallExpression"
// 			}
// 		}
// 	}
// }

//
// export function hasLocationVar__(ast: Program): isDirname {
// 	let seenDirname: boolean = false
// 	let seenFilename: boolean = false
// 	traverse(ast, {
// 		enter: (node, parentNode) => {
// 			if (node.type === "Identifier") {
// 				switch (node.name) {
// 					case "__dirname":
// 						seenDirname = true;
// 						seenFilename = true;
// 						return VisitorOption.Break
// 						break;
// 					case "__filename":
// 						seenFilename = true;
// 						break;
// 				}
//
// 			}
//
// 		}
// 	});
// 	if (seenDirname) {
// 		return "__dirname"
// 	} else if (seenFilename) {
// 		"__filename"
// 	} else {
// 		return null
// 	}
//
// }
//
// type z = ('a' | 'b' | 'c');
//
// function fff() {
// 	let xx = 2
// 	if (xx > 1) {
// 		return 'a'
// 	}
// 	if (xx === 1)
// 		return 'c'
// 	return 'b'
// }
