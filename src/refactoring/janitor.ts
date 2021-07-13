import {Directive, ModuleDeclaration, Statement} from "estree";
import {ProjectManagerI} from "../control/ProjectManager";
import {JSFile} from "../filesystem/JSFile";
import {exportAndCopyPhase, hoistRequires, phase1, phase2} from "./janitor-phases";


export const clean = (pm: ProjectManagerI) => {
	pm.forEachSource(janitor);
};
// export {clean as default}


export type JSBody = Array<Directive | Statement | ModuleDeclaration>;


function janitor(js: JSFile) {
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
