import {
	Directive,
	Expression,
	Identifier,
	MemberExpression,
	ModuleDeclaration,
	Statement,
	VariableDeclarator
} from "estree";
import {id} from "../abstract_fs_v2/interfaces";
import {JSFileImpl} from "../abstract_fs_v2/JSv2";
import {ProjectManagerI} from "../abstract_fs_v2/ProjectManager";
import {exportAndCopyPhase, hoistRequires, phase1, phase2} from "./janitor-phases";

import {isModule_Dot_Exports} from "./utilities/helpers";


export const clean = (pm: ProjectManagerI) => {
	pm.forEachSource(janitor);
};
export {clean as default}


export type JSBody = Array<Directive | Statement | ModuleDeclaration>;


export function janitor(js: JSFileImpl) {
	const body: JSBody = js.getBody()

	phase1(js);
	phase2(js);

	exportAndCopyPhase(js)

	let imports = hoistRequires(js)


	//FINAL PHASE
	if (imports) {
		body.splice(0, 0, ... imports)
	}
}
