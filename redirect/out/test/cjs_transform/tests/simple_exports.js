Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const project_representation_1 = require("../../src/abstract_representation/project_representation");
const Transformer_1 = require("../../src/transformations/Transformer");
const exportTransformMain_1 = require("transformations/export_transformations/visitors/exportTransformMain");
let testPath = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/export/export_test_files/simple_suite`;
let testFiles = fs_1.readdirSync(testPath, { withFileTypes: true });
testFiles.forEach(e => {
    console.log();
    if (e.isDirectory()) {
        // readFileSync(`.js`)
        let projDir = `${testPath}/${e.name}`;
        let proj = project_representation_1.projectReader(projDir, 'script');
        let transformer = Transformer_1.Transformer.ofProject(proj);
        transformer.transform(exportTransformMain_1.transformBaseExports);
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
