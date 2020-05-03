import {readFileSync, lstatSync, readdirSync} from "fs";
import {describe, it} from 'mocha'
import {expect} from 'chai'
// import {generate} from "escodegen";
// import {parseScript} from "esprima";
import {projectReader, JSFile} from "../../../src/abstract_representation/project_representation";
import {flattenDecls} from "../../../src/transformations/sanitizing/visitors";

const TEST_DIR: string[] = readdirSync('./decl_flatten');

const BASE_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'standard');
const FOR_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'for');
const IF_TEST_DATA = TEST_DIR.filter(e => e.split('_')[0] === 'if');


console.log(BASE_TEST_DATA.length + FOR_TEST_DATA.length + IF_TEST_DATA.length)
console.log(TEST_DIR.length)
console.log()
let i: number = 0;



function extracted(testDataDirString: string) {
    let actualFile = `${testDataDirString}.actual`, expectedFile = `${testDataDirString}.expected`;
    const project = projectReader(`./decl_flatten/${testDataDirString}`)
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
    IF_TEST_DATA.forEach(testDataDirString => {
        console.log(i)

        extracted(testDataDirString);

        i++
        })
    });
});