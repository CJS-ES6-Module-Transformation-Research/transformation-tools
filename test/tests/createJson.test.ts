// import {describe, it} from "mocha";
import {expect} from 'chai'
import {project} from "../../index";
import {ProjectManager} from "../../src/abstract_fs_v2/ProjectManager";
 import {mock_opts, test_root} from "../index";
 import {jsonRequire} from "../../src/transformations/sanitizing/visitors";


// const data_dir = `${test_root}/sanitize/json_creator/`;
const data_dir = `${project}/test/test_resources/sanitize/json_creator/`;



describe(`Sanitize: 1 JSON Require Creation Testing`, () => {
    it('Different Level JSON Requires', () => {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                let fName = `js-${i}_json-${j}`;

                let actualProj: ProjectManager
                let expectedProj: ProjectManager


                actualProj = new ProjectManager(`${data_dir}${fName}_actual`,mock_opts)
                expectedProj = new ProjectManager(`${data_dir}${fName}_expected`,mock_opts)


                actualProj.forEachSource(jsonRequire);
                // actualProj.writeOut()
                // throw new Error()
                let actFiles: string[] = actualProj.getJSNames(true).map(e=>e.getRelative());
                let expFiles: string[] = expectedProj.getJSNames(true).map(e=>e.getRelative());
let msg:string = `err in ${actualProj.getJSNames()[0].getParent().getRootDirPath()}`;
                expect(actFiles).to.be.deep.equal(expFiles,msg+  (actFiles.length + ' ' + expFiles.length + " file: "  + fName));

                actFiles.forEach(f => {
                    let expected = expectedProj.getJS(f).makeSerializable().fileData;
                    let actual = actualProj.getJS(f).makeSerializable().fileData;
                    expect(actual).to.be.equal(expected)
                });


            }
        }
    });
});