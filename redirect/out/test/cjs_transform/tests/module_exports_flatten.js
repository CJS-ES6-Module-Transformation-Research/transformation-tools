Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const fs_1 = require("fs");
const project_representation_1 = require("../../src/abstract_representation/project_representation");
const Transformer_1 = require("../../src/transformations/Transformer");
const visitors_1 = require("../../src/transformations/sanitizing/visitors");
const testFile_dir = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/sanitize/module_exports_obj_assign";
const actualDir = `${testFile_dir}/actual`;
const expectedDir = `${testFile_dir}/expected`;
// let filename: string,expectedName: string;
let files_in_dir = fs_1.readdirSync(`${testFile_dir}/actual`);
mocha_1.describe('Sanitize: 4 module.exports Flattener Test Files', () => {
    mocha_1.it('Test Files', () => {
        files_in_dir.forEach((proj) => {
            let eProj = project_representation_1.projectReader(`${expectedDir}/${proj}`);
            let aProj = project_representation_1.projectReader(`${actualDir}/${proj}`);
            let transformer = Transformer_1.Transformer.ofProject(aProj);
            transformer.transform(visitors_1.collectDefaultObjectAssignments);
            aProj.forEachSource((e) => {
                let actual = e.makeString();
                let expected = eProj.getJS(e.getRelative()).makeString();
                chai_1.expect(actual.trim()).to.be.equal(expected.trim(), `in file  ${e.getRelative()}`);
            });
        });
    });
});
