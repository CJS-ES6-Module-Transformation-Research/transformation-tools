Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var index_1 = require("../../../index");
// test_resources.import {generate} from "escodegen";
// test_resources.import {parseScript} from "esprima";
var project_representation_1 = require("../../../src/abstract_representation/project_representation");
var visitors_1 = require("../../../src/transformations/sanitizing/visitors");
var DECL_FLATTEN = index_1.project + "/test/test_resources.sanitize/declarator_flattener/decl_flatten";
var TEST_DIR = fs_1.readdirSync(DECL_FLATTEN);
var BASE_TEST_DATA = TEST_DIR.filter(function (e) { return e.split('_')[0] === 'standard'; });
var FOR_TEST_DATA = TEST_DIR.filter(function (e) { return e.split('_')[0] === 'for'; });
var IF_TEST_DATA = TEST_DIR.filter(function (e) { return e.split('_')[0] === 'if'; });
function extracted(testDataDirString) {
    var actualFile = testDataDirString + ".actual", expectedFile = testDataDirString + ".expected";
    var project = project_representation_1.projectReader(DECL_FLATTEN + "/" + testDataDirString);
    var actualJS = project.getJS(testDataDirString + ".actual.js");
    visitors_1.flattenDecls(actualJS);
    var prjS = project.getJS(testDataDirString + ".expected.js");
    var expected = prjS.makeSerializable().fileData;
    chai_1.expect(expected).to.be.equal(actualJS.makeSerializable().fileData, "error in " + testDataDirString);
}
mocha_1.describe('Testing of declarator flattening', function () {
    mocha_1.it('Base Declarator Flattening Tests', function () {
        BASE_TEST_DATA.forEach(extracted);
    });
    mocha_1.it('For-Loop Declarator Flattening Tests', function () {
        FOR_TEST_DATA.forEach(extracted);
    });
    mocha_1.it('If-Statement-Encapsulated Declarator Flattening Tests', function () {
        IF_TEST_DATA.forEach(extracted);
    });
});
