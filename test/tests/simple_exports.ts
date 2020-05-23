import {describe, it} from 'mocha'
import {expect} from 'chai'
 import {ExportBuilder} from '../../src/transformations/export_transformations/ExportsBuilder'
import {readdirSync, readFileSync} from "fs";


import {projectReader, TransformableProject} from "../../src/abstract_representation/project_representation";
import {Transformer} from "../../src/transformations/Transformer";
 import {transformBaseExports} from "transformations/export_transformations/visitors/exportTransformMain";





let testPath = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/export/export_test_files/simple_suite`
let testFiles = readdirSync(testPath, {withFileTypes: true})
testFiles.forEach(e => {
    console.log()


    if (e.isDirectory()) {
        // readFileSync(`.js`)
        let projDir = `${testPath}/${e.name}`
        let proj = projectReader(projDir,'script' )
        let transformer =   Transformer.ofProject(proj);
        transformer.transform(transformBaseExports)


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
