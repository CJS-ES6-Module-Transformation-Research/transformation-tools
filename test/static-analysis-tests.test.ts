import {join} from "path";
import {readdirSync, readFileSync} from "fs";
import {createProject} from "./index";
import {ProjectManager} from "../src/control";
import {runAnalyses} from "../src/refactoring/static-analysis";
import {JSFile} from "../src/filesystem";
import {expect} from 'chai'

let base_dir = join('/Users/sam/Documents/module_research/CJS_Transform/test_data/static_analysis/data-compare')

let all_tests = readdirSync(base_dir)

let shadow = join(base_dir, 'shadow_vars/shadow_vars')
let expected = JSON.parse(readFileSync(join(shadow, 'expected.json'), 'utf-8'))
Object.keys(expected).forEach((proj:string)=> {
    let pm :ProjectManager= createProject(proj, true)
    runAnalyses(pm)
    let projJS = `${proj}.js`
    let js:JSFile = pm.getJS(projJS)
    let inter =js.getIntermediate()
    let expectedProps:string[] = expected[proj].props as string[]
    expect(expectedProps.sort()).to.eql((inter.getPropReads()[projJS]).sort())
})

