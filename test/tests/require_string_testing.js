Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var fs_1 = require("fs");
var project_representation_1 = require("../../src/abstract_representation/project_representation");
var chai_1 = require("chai");
var esprima_1 = require("esprima");
var escodegen_1 = require("escodegen");
var visitors_1 = require("../../src/transformations/sanitizing/visitors");
var index_1 = require("../../index");
var requireString = index_1.project + "/test/sanitize/require_string";
var read = fs_1.readFileSync(requireString + "/tests.txt")
    .toString()
    .trim()
    .split("\n");
var project;
mocha_1.describe('Require String Tests', function () {
    mocha_1.it("Require Tests From " + requireString + "/tests.txt", function () {
        var expected, expectedFileString, expectedProgString, expectedAST, jsf, loadedJSFile, actual;
        read.forEach(function (e) {
            project = project_representation_1.projectReader(requireString + "/must_sanitize/" + e);
            expectedFileString = requireString + "/expected/" + e + ".expected.js";
            expectedProgString = fs_1.readFileSync(expectedFileString).toString();
            expectedAST = esprima_1.parseScript(expectedProgString);
            expected = escodegen_1.generate(expectedAST);
            loadedJSFile = e + ".js";
            jsf = project.getJS(loadedJSFile);
            visitors_1.requireStringSanitizer(jsf);
            actual = escodegen_1.generate(jsf.getAST());
            chai_1.expect(expected).to.equal(actual, index_1.project + "/test/sanitize/require_string/expected/" + e + ".expected.js");
        });
    });
});
