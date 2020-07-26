import {readFileSync, readdirSync} from "fs";
// import {describe, it} from 'mocha'
import {expect} from 'chai'
import {project as PROJ_ROOT_DIR} from '../../index'
import {write_status} from "../../src/abstract_fs_v2/interfaces";
import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {ProjectManager,ProjConstructionOpts} from "../../src/abstract_fs_v2/ProjectManager";
 import {flattenDecls} from "../../src/transformations/sanitizing/visitors";

const DECL_FLATTEN = `${PROJ_ROOT_DIR}/test/sanitize/declarator_flattener/decl_flatten`;
const TEST_DIR: string[] = readdirSync(DECL_FLATTEN);

const BASE_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'standard');
const FOR_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'for');
const IF_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'if');


function createOptions(dest:string='') :ProjConstructionOpts {
 return {
     suffix: "",
     write_status: dest? "copy":"in-place",
     copy_node_modules: false,
     isModule: false,
     target_dir: dest? dest:''
 }
}


function createProj(src:string , dest:string=''){
    return new ProjectManager(src, createOptions(dest) )
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


describe('Sanitize: 2 Testing of Declarator Flattening', () => {
    it('Base Declarator Flattening Tests', () => {
        BASE_TEST_DATA.forEach(extracted);
    });
    it('For-Loop Declarator Flattening Tests', () => {
        FOR_TEST_DATA.forEach(extracted);
    });
    it('If-Statement-Encapsulated Declarator Flattening Tests', () => {
        IF_TEST_DATA.forEach(extracted);
    });
});