import {expect} from 'chai';
// test_resources.import {describe, it} from "mocha";
import {readdirSync} from 'fs'
import {project} from "../../index";
import {ProjConstructionOpts, ProjectManager} from "../../src/abstract_fs_v2/ProjectManager";

import {accessReplace} from "../../src/transformations/sanitizing/visitors";
import {createProject, mock_opts} from "../index";
import { join } from 'path';
console.log(`projecjt: ${project}`)
const testFile_dir =join(project ,"test/test_resources/sanitize/qccess_replace")
console.log(`projecjt2: ${testFile_dir}`)
    // "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/test_resources/projectsanitize/qccess_replace";
const actualDir = `${testFile_dir}/js_files`
const expectedDir = `${testFile_dir}/expected`
// let filename: string,expectedName: string;

let files_in_dir = readdirSync(`${testFile_dir}/js_files`)





// @ts-ignore
describe('Sanitize: 3 Access Replace Test Files', () => {


    // @ts-ignore
    it('Test Files', () => {
        files_in_dir.forEach((proj: string) => {
            let eProj =  createProject( join(expectedDir,proj) ,false)
            let aProj =   createProject(join(actualDir,proj) ,false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
                try {
                    expect(actual).to.be.equal(expected, e.getRelative());
                }catch(e){
                    throw e;
                }
            });
        });


    });
});
