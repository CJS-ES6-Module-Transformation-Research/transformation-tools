import {readFileSync, readdirSync} from "fs";
// test_resources.import {describe, it} from 'mocha'
import {expect} from 'chai'
import {project as PROJ_ROOT_DIR} from '../../index'
import {JSFile} from "../../src/filesystem/JSFile";
import {ProjectManager,ProjConstructionOpts} from "../../src/control/ProjectManager";
 import {flattenDecls} from "../../src/transformations/sanitizing/visitors";
import {write_status} from "../../src/utility/types";

const DECL_FLATTEN = `${PROJ_ROOT_DIR}/test/test_resources/sanitize/declarator_flattener/decl_flatten`;
const TEST_DIR: string[] = readdirSync(DECL_FLATTEN);

const BASE_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'standard');
const FOR_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'for');
const IF_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'if');


function createOptions(input:string,dest:string='') :ProjConstructionOpts {
 return {input,
     suffix: "",
     operation_type: dest? "copy":"in-place",
     copy_node_modules: false,
     isModule: false,
     output: dest? dest:'',ignored:[],
     isNamed:false,report:false,testing:true
 }
}


function createProj(input:string , dest:string=''){
    return new ProjectManager(input, createOptions(input,dest) )
}


function extracted(testDataDirString: string) {
    let actualFile = `${testDataDirString}.actual`, expectedFile = `${testDataDirString}.expected`;

    // const project = projectReader(`${DECL_FLATTEN}/${testDataDirString}`)
    const project = createProj(`${DECL_FLATTEN}/${testDataDirString}`)
        // ProjectManager(`${DECL_FLATTEN}/${testDataDirString}`)


    let actualJS: JSFile = project.getJS(`${testDataDirString}.actual.js`);
    flattenDecls(actualJS);
    let prjS = project.getJS(`${testDataDirString}.expected.js`)
    let expected = prjS.makeSerializable().fileData
    expect(expected).to.be.equal(actualJS.makeSerializable().fileData, `error in ${testDataDirString}`);
}


// @ts-ignore
describe('Sanitize: 2 Testing of Declarator Flattening', () => {
// @ts-ignore
    it('Base Declarator Flattening Tests', () => {
        BASE_TEST_DATA.forEach(extracted);
    });
// @ts-ignore
    it('For-Loop Declarator Flattening Tests', () => {
        FOR_TEST_DATA.forEach(extracted);
    });
// @ts-ignore
    it('If-Statement-Encapsulated Declarator Flattening Tests', () => {
        IF_TEST_DATA.forEach(extracted);
    });
});