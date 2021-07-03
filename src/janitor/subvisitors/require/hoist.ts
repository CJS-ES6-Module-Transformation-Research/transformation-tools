import {replace, VisitorOption} from "estraverse";
import {CallExpression, Literal, Node, Statement} from "estree";
import {createRequireDecl, id} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {requireData} from "../../pass0";
import {cleanMS, cleanRequire, isARequire} from "../../utilities/helpers";

export function requireCleanAndHoist(js: JSFile, rd: { [k: string]: requireData }): Statement[] {
	let ordering: string[] = []

	// let vis: Visitor =
	replace(js.getAST(), {
			leave: (node: Node, parent: Node) => {
				let clean: string, raw: string, _id: string

				function update(): void {
					if (!ordering.includes(raw)) {
						ordering.push(raw)
					}
					rd[raw] = rd[raw] || {clean, raw, id: _id}
				}

				if (node.type === "CallExpression" && isARequire(node)) {
					raw = (node.arguments[0] as Literal).value.toString()
					clean = cleanRequire(node, js)
					{
						/*if (parent &&
							&& parent.id.type === "Identifier"
						) {

							update()



						} else
							*/{
							let $id=cleanMS(raw)
							_id = js.getNamespace().generateBestName($id).name
							update()
							return id(_id)
						}

					}


				}else if(node.type ==="VariableDeclaration"
					&& node.declarations[0].init.type ==="CallExpression"
				&& isARequire( node.declarations[0].init)
				&& node.declarations[0].id.type === "Identifier"){
					raw = (node.declarations[0].init.arguments[0] as Literal).value.toString()

					clean = cleanRequire(node.declarations[0].init, js)

					// _id =cleanMS(raw)
					// _id = js.getNamespace().generateBestName(_id).name
					update()
					return VisitorOption.Remove
				}
			}
		}
	)
	return ordering.filter(e=>rd[e].id).map(r =>   createRequireDecl(rd[r].id, rd[r].clean, 'var'))
}
