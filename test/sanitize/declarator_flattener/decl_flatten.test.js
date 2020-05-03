Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var mocha_1 = require("mocha");
var chai_1 = require("chai");
// import {generate} from "escodegen";
// import {parseScript} from "esprima";
var project_representation_1 = require("../../../src/abstract_representation/project_representation");
var visitors_1 = require("../../../src/transformations/sanitizing/visitors");
var TEST_DIR = fs_1.readdirSync('./decl_flatten');
var BASE_TEST_DATA = TEST_DIR.filter(function (e) { return e.split('_')[0] === 'standard'; });
var FOR_TEST_DATA = TEST_DIR.filter(function (e) { return e.split('_')[0] === 'for'; });
var IF_TEST_DATA = TEST_DIR.filter(function (e) { return e.split('_')[0] === 'if'; });
console.log(BASE_TEST_DATA.length + FOR_TEST_DATA.length + IF_TEST_DATA.length);
console.log(TEST_DIR.length);
console.log();
var i = 0;
function extracted(testDataDirString) {
    var actualFile = testDataDirString + ".actual", expectedFile = testDataDirString + ".expected";
    var project = project_representation_1.projectReader("./decl_flatten/" + testDataDirString);
    var actualJS = project.getJS(testDataDirString + ".actual.js");
    visitors_1.flattenDecls(actualJS);
    var prjS = project.getJS(testDataDirString + ".expected.js");
    var expected = prjS.makeString();
    chai_1.expect(expected).to.be.equal(actualJS.makeString(), "error in " + testDataDirString);
}
mocha_1.describe('Testing of declarator flattening', function () {
    mocha_1.it('Base Declarator Flattening Tests', function () {
        BASE_TEST_DATA.forEach(extracted);
    });
    mocha_1.it('For-Loop Declarator Flattening Tests', function () {
        FOR_TEST_DATA.forEach(extracted);
    });
    mocha_1.it('If-Statement-Encapsulated Declarator Flattening Tests', function () {
        IF_TEST_DATA.forEach(function (testDataDirString) {
            console.log(i);
            extracted(testDataDirString);
            i++;
        });
    });
});
