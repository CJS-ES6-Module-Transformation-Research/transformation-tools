import {readFileSync, readdirSync} from "fs";
import {describe, it} from 'mocha'
import {expect} from 'chai'
import {project as PROJ_ROOT_DIR} from '../../index'
import {JSFile, projectReader} from "../../src/abstract_representation/project_representation";
import {flattenDecls} from "../../src/transformations/sanitizing/visitors";

const DECL_FLATTEN = `${PROJ_ROOT_DIR}/test/sanitize/declarator_flattener/decl_flatten`;
const TEST_DIR: string[] = readdirSync(DECL_FLATTEN);

const BASE_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'standard');
const FOR_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'for');
const IF_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'if');


function extracted(testDataDirString: string) {
    let actualFile = `${testDataDirString}.actual`, expectedFile = `${testDataDirString}.expected`;
    const project = projectReader(`${DECL_FLATTEN}/${testDataDirString}`)
    let actualJS: JSFile = project.getJS(`${testDataDirString}.actual.js`);
    flattenDecls(actualJS);
    let prjS = project.getJS(`${testDataDirString}.expected.js`)
    let expected = prjS.makeString()
    expect(expected).to.be.equal(actualJS.makeString(), `error in ${testDataDirString}`);
}


describe('Testing of declarator flattening', () => {
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