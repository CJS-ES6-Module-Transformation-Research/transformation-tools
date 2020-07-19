Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const index_1 = require("../../index");
const project_representation_1 = require("../../src/abstract_representation/project_representation");
const visitors_1 = require("../../src/transformations/sanitizing/visitors");
const DECL_FLATTEN = `${index_1.project}/test/sanitize/declarator_flattener/decl_flatten`;
const TEST_DIR = fs_1.readdirSync(DECL_FLATTEN);
const BASE_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'standard');
const FOR_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'for');
const IF_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'if');
function extracted(testDataDirString) {
    let actualFile = `${testDataDirString}.actual`, expectedFile = `${testDataDirString}.expected`;
    const project = project_representation_1.projectReader(`${DECL_FLATTEN}/${testDataDirString}`);
    let actualJS = project.getJS(`${testDataDirString}.actual.js`);
    visitors_1.flattenDecls(actualJS);
    let prjS = project.getJS(`${testDataDirString}.expected.js`);
    let expected = prjS.makeString();
    chai_1.expect(expected).to.be.equal(actualJS.makeString(), `error in ${testDataDirString}`);
}
mocha_1.describe('Sanitize: 2 Testing of Declarator Flattening', () => {
    mocha_1.it('Base Declarator Flattening Tests', () => {
        BASE_TEST_DATA.forEach(extracted);
    });
    mocha_1.it('For-Loop Declarator Flattening Tests', () => {
        FOR_TEST_DATA.forEach(extracted);
    });
    mocha_1.it('If-Statement-Encapsulated Declarator Flattening Tests', () => {
        IF_TEST_DATA.forEach(extracted);
    });
});
