import {ProjectManager} from "../src/abstract_fs_v2/ProjectManager";
import {getOptionData, PM_Opts} from "../src/args";


type TransformJS=(pmgr:ProjectManager)=>void


function extractData(_cwd:string){
	let opts:PM_Opts  = getOptionData(_cwd)
	let {input,report } = opts
	return {input,report,opts}
}

export function run(cwd:string , transformJS:TransformJS){
	let {input, report,opts} = extractData(cwd)
	let pm:ProjectManager = new ProjectManager(input,opts);
	transformJS(pm)
	pm.writeOut()
	pm.report(report)
}