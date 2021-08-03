import {Directive, ModuleDeclaration, Statement} from "estree";
import {ProjectManagerI} from "../control/ProjectManager";
import {JSFile} from "../filesystem/JSFile";
import {exportAndCopyPhase, hoistRequires, phase1, phase2} from "./janitor-phases";
import { tagScopes } from "./janitor-phases/tagScopes";


export const clean = (pm: ProjectManagerI) => {
	pm.forEachSource(phase1);
	pm.forEachSource(phase2);
	pm.forEachSource(exportAndCopyPhase);
	pm.forEachSource(finalPhase);

};
// export {clean as default}


export type JSBody = Array<Directive | Statement | ModuleDeclaration>;


function janitor(js: JSFile) {


	tagScopes(js);
	phase1(js);
	phase2(js);

	exportAndCopyPhase(js)



	//FINAL PHASE

}
function finalPhase(js:JSFile) {
		let imports = hoistRequires(js)

		if (imports) {
			js.getBody().splice(0, 0, ... imports)
		}
}
