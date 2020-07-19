Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const fs_1 = require("fs");
const project_representation_1 = require("../../src/abstract_representation/project_representation");
const chai_1 = require("chai");
const esprima_1 = require("esprima");
const escodegen_1 = require("escodegen");
const visitors_1 = require("../../src/transformations/sanitizing/visitors");
const index_1 = require("../../index");
const requireString = `${index_1.project}/test/sanitize/require_string`;
const read = fs_1.readFileSync(`${requireString}/tests.txt`)
    .toString()
    .trim()
    .split(`\n`);
let project;
mocha_1.describe('Sanitize: 0 Require String Tests', () => {
    mocha_1.it(`Require Tests From ${requireString}/tests.txt`, () => {
        let expected, expectedFileString, expectedProgString, expectedAST, jsf, loadedJSFile, actual;
        read.forEach((e) => {
            project = project_representation_1.projectReader(`${requireString}/must_sanitize/${e}`);
            expectedFileString = `${requireString}/expected/${e}.expected.js`;
            expectedProgString = fs_1.readFileSync(expectedFileString).toString();
            expectedAST = esprima_1.parseScript(expectedProgString);
            expected = escodegen_1.generate(expectedAST);
            loadedJSFile = `${e}.js`;
            jsf = project.getJS(loadedJSFile);
            visitors_1.requireStringSanitizer(jsf);
            actual = escodegen_1.generate(jsf.getAST());
            chai_1.expect(expected).to.equal(actual, `${index_1.project}/test/sanitize/require_string/expected/${e}.expected.js`);
        });
    });
});
