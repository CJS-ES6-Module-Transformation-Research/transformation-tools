import 'yargs'
import {ProjConstructionOpts, ProjectManager, ProjectManagerI} from "./control/ProjectManager";
import {parse} from "./control/utility/arg_parse";

type TransformJS=(pmgr:ProjectManagerI)=>void

//

export function run(cwd:string , transformJS:TransformJS){
// let opts = getOptionData(cwd)
	let opts:ProjConstructionOpts  = parse()
	let {input, report } = 	opts
	let pm:ProjectManager = new ProjectManager(input,opts);
	transformJS(pm)
	pm.writeOut()
	pm.report(report)
}