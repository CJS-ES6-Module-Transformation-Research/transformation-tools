import {ProjectManager} from "../abstract_fs_v2/ProjectManager";
import {PM_Opts} from "../args/args";
import * as arg from "../args/arrgs3";
import {clean} from "./janitor";
// import pt1 from './pass0'
// function run(cwd:string , transformJS){
// let opts = getOptionData(cwd)
// 	let opts:PM_Opts  = arg.parse()
// 	let {input, report , goal} = 	opts
// 	let pm:ProjectManager = new ProjectManager(input,opts);
// 	transformJS(pm)
// 	pm.writeOut()
// 	pm.report(report)
// }
// run(process.cwd(),
// 	function janitor(projectManager: ProjectManager) {
// 		projectManager.forEachSource(pt1);
//
// 	})


function createProj(target: string) {

	return new ProjectManager(target, {
			suffix: "",
			operation_type: "copy" ,
			copy_node_modules: false,
			isModule: false,
			output: '',
			ignored: [],
			isNamed: false, report: false, testing: true
		}
	)
}
let pmopts: PM_Opts

let opts: PM_Opts = arg.parse()
let {input, report, goal} = opts
let pm: ProjectManager = new ProjectManager(input, opts);
clean(pm)
pm.writeOut();

// pm.report(report)