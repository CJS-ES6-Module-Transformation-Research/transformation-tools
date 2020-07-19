Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const project_representation_1 = require("../../src/abstract_representation/project_representation");
const index_1 = require("../index");
const Transformer_1 = require("../../src/transformations/Transformer");
const visitors_1 = require("../../src/transformations/sanitizing/visitors");
const data_dir = `${index_1.test_root}/sanitize/json_creator/`;
mocha_1.describe(`Sanitize: 1 JSON Require Creation Testing`, () => {
    mocha_1.it('Different Level JSON Requires', () => {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                let fName = `js-${i}_json-${j}`;
                let transformer;
                let actualProj;
                let expectedProj;
                actualProj = project_representation_1.projectReader(`${data_dir}${fName}_actual`);
                expectedProj = project_representation_1.projectReader(`${data_dir}${fName}_expected`);
                transformer = Transformer_1.Transformer.ofProject(actualProj);
                transformer.transformWithProject(visitors_1.jsonRequire);
                let actFiles = actualProj.getJSNames().sort();
                let expFiles = expectedProj.getJSNames().sort();
                chai_1.expect(actFiles).to.be.deep.equal(expFiles, actFiles.length + ' ' + expFiles.length + " file: " + fName);
                actFiles.forEach(f => {
                    let expected = expectedProj.getJS(f).makeString();
                    let actual = actualProj.getJS(f).makeString();
                    chai_1.expect(actual).to.be.equal(expected);
                });
            }
        }
    });
});
