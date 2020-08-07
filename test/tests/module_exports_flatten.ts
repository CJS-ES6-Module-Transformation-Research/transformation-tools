import {expect} from 'chai';
 import {readdirSync} from 'fs'
import {ProjConstructionOpts, ProjectManager} from "../../src/abstract_fs_v2/ProjectManager.js";

import {accessReplace, objLiteralFlatten} from "../../src/transformations/sanitizing/visitors";
import exp = require("constants");

const testFile_dir = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/test_resources.sanitize/module_exports_obj_assign";
const actualDir = `${testFile_dir}/actual`
const expectedDir = `${testFile_dir}/expected`
// let filename: string,expectedName: string;

let files_in_dir = readdirSync(`${testFile_dir}/actual`)
let opts:ProjConstructionOpts = {write_status:"in-place",target_dir:"",suffix:"",isModule:false, copy_node_modules:false}


// @ts-ignore
describe('Sanitize: 4 module.exports Flattener Test Files', () => {
    // @ts-ignore
    it('Test Files', () => {
        files_in_dir.forEach(
          async  (proj: string) => {
                let eProj = new ProjectManager  (`${expectedDir}/${proj}`,opts)
                let aProj    =new ProjectManager(`${actualDir}/${proj}`,opts)
                aProj.forEachSource(objLiteralFlatten);

                aProj.forEachSource((e) => {
                    let actual:string
                    try {
                        actual = e.makeSerializable().fileData;
                    }catch (e) {
                        console.log(`error in project : ${proj} trying to serialize "actual" transformed`)
                    }
                    let expected:string
                    try {
                        expected = eProj.getJS(e.getRelative()).makeSerializable().fileData;
                    }catch (e) {
                        console.log(`error in project : ${proj} trying to serialize expected`)
                    }
                    expect(actual.trim()).to.be.equal(expected.trim(), `in file  ${e.getRelative() }`);
                });
            });
    });
});