import {ProjConstructionOpts, ProjectManager} from "../control";
import {clean, refactor} from "../refactoring";
process.argv.shift()
process.argv.shift()

let input = process.argv.shift() || '.'

let _opts: ProjConstructionOpts = {
    operation_type: 'copy',
    suffix: '',
    isNamed: false,
    ignored:['dist'],
    testing: true,
    input: input ,            //  input from process.argv
    report: false,
    output: ''
}
let pm: ProjectManager = ProjectManager.init(_opts)
refactor(pm) // from janitor
pm.writeOut();