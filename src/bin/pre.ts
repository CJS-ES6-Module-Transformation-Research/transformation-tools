import {ProjConstructionOpts, ProjectManager} from "../control";
import {clean} from "../refactoring";
process.argv.shift()
process.argv.shift()

let input = process.argv.shift() || '.'
let _opts: ProjConstructionOpts = {
    operation_type: 'copy',
    suffix: '',
    isNamed: true,
    ignored:['dist'],
    testing: true,
    input: input,            //  input from process.argv
    report: false,
    output: ''
}
let pm: ProjectManager = ProjectManager.init(_opts)
clean(pm) // from janitor
pm.writeOut();