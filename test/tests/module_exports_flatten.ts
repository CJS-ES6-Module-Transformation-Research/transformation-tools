import {expect} from 'chai';
import {describe, it} from "mocha";
import {readdirSync} from 'fs'
import {projectReader, TransformableProject} from "../../src/abstract_representation/project_representation";
import {Transformer} from "../../src/transformations/Transformer";
import {accessReplace, collectDefaultObjectAssignments} from "../../src/transformations/sanitizing/visitors";

const testFile_dir = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test//sanitize/module_exports_obj_assign";
const actualDir = `${testFile_dir}/actual`
const expectedDir = `${testFile_dir}/expected`
// let filename: string,expectedName: string;

let files_in_dir = readdirSync(`${testFile_dir}/actual`)


describe('module.exports Flattener Test Files', () => {
    it('Test Files', () => {
        files_in_dir.forEach(
            (proj: string) => {
                let eProj: TransformableProject = projectReader(`${expectedDir}/${proj}`)
                let aProj: TransformableProject = projectReader(`${actualDir}/${proj}`)
                let transformer: Transformer = Transformer.ofProject(aProj);
                transformer.transform(collectDefaultObjectAssignments);

                aProj.forEachSource((e) => {
                    let actual = e.makeString();
                    let expected = eProj.getJS(e.getRelative()).makeString();
                    expect(actual).to.be.equal(expected);
                });
            });
    });
});