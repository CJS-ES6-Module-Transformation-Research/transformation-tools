import * as arg from "../control/utility/arg_parse";
import {ProjConstructionOpts, ProjectManager} from "../control/ProjectManager";
import {clean} from "../refactoring";
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


function createProj(input: string) {

	return new ProjectManager(input, {
			input,
			suffix: "",
			operation_type: "copy",
			copy_node_modules: false,
			isModule: false,
			output: '',
			ignored: [],
			isNamed: false, report: false, testing: true
		}
	)
}

let pmopts: ProjConstructionOpts

let opts: ProjConstructionOpts = arg.parse()
let {input, report} = opts
let pm: ProjectManager = new ProjectManager(input, opts);
clean(pm)
pm.writeOut();

// pm.report(report)