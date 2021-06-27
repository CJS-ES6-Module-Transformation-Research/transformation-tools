import {ProjectManager} from "../src/abstract_fs_v2/ProjectManager";
import {getOptionData, PM_Opts} from "./args/args";
import 'yargs'
import * as arg from './args/arrgs3'
type TransformJS=(pmgr:ProjectManager)=>void

export type ExecutionGoal = "format" | "clean" | "transform"
function extractData(_cwd:string){
	let opts:PM_Opts  = arg.parse()//getOptionData(_cwd)
	let {input,report, goal } = getOptionData(_cwd)
	return {input,report,opts}
}

export function run(cwd:string , transformJS:TransformJS){
// let opts = getOptionData(cwd)
	let opts:PM_Opts  = arg.parse()
	let {input, report , goal} = 	opts
	let pm:ProjectManager = new ProjectManager(input,opts);
	transformJS(pm)
	pm.writeOut()
	pm.report(report)
}