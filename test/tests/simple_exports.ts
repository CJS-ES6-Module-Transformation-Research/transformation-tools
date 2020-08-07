import {describe, it} from 'mocha'
import {expect} from 'chai'
import {ProjectManager} from "../../src/abstract_fs_v2/ProjectManager.js";
import {readdirSync, readFileSync} from "fs";
import {transformBaseExports} from "../../src/transformations/export_transformations/visitors/exportTransformMain";
import {mock_opts} from "../index";







let testPath = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/export/export_test_files/simple_suite`
let testFiles = readdirSync(testPath, {withFileTypes: true})
testFiles.forEach(e => {
    console.log()


    if (e.isDirectory()) {
        // readFileSync(`.js`)
        let projDir = `${testPath}/${e.name}`
        let proj = new ProjectManager(projDir,'script' ,mock_opts)
        proj.forEachSource(transformBaseExports)


        //  // console.log(e.name)
       //  // console.log(`${testPath}/${e.name}`)
       //  let currdir = `${testPath}/${e.name}`
       //  let fName = `${currdir}/${e.name}/${e.name}.js`
       //  console.log(fName)
       // let data = readFileSync(fName)
       //  console.log(data.toString())
    }
});

// describe('', () => {
//     it('', () => {
//     });
// });
