import {traverse, VisitorOption} from "estraverse";
import {Identifier, VariableDeclaration} from 'estree'
import {TransformFunction} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";

export const __FILENAME: Identifier = {type: "Identifier", name: "__filename"}
export const __DIRNAME: Identifier = {type: "Identifier", name: "__dirname"}
const variableDeclarations: { filename: (str: string) => VariableDeclaration, dirname: VariableDeclaration } = {
	filename: (str: string) => {
		return {
			"type":
				"VariableDeclaration",
			"declarations":
				[{
					"type": "VariableDeclarator",
					"id": __FILENAME,
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
			"id": __DIRNAME,
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
				"arguments": [__FILENAME]
			}
		}],
		"kind": "var"
	}

}

export const add__dirname: TransformFunction = (js: JSFile) => {
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

	let import_meta_url = js.getNamespace().getImportMeta()

	if (js.namespaceContains('__dirname') || seenDirname) {
		js.getAST().body.splice(0, 0, variableDeclarations.filename(import_meta_url.name), variableDeclarations.dirname)
		// addFilename(js)
		// refact(js, create__dirname, 'path');

		js.registerReplace(import_meta_url.name, `import.meta.url`)

	} else if (js.namespaceContains('__filename') || seenFilename) {

		js.getAST().body.splice(0, 0, variableDeclarations.filename(import_meta_url.name))

		// addFilename(js);
		js.registerReplace(import_meta_url.name, `import.meta.url`)


	}


}


