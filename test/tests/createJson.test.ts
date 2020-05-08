import {describe, it} from "mocha";
import {expect} from 'chai'
import {projectReader, TransformableProject} from "../../src/abstract_representation/project_representation";
import {test_root} from "../index";
import {Transformer} from "../../src/transformations/Transformer";
import {jsonRequire} from "../../src/transformations/sanitizing/visitors";
import {existsSync, rmdirSync} from "fs";
import exp from "constants";

const data_dir = `${test_root}/sanitize/json_creator/`;
describe(`JSON Require Creation Testing`, () => {
    it('', () => {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                let fName = `js-${i}_json-${j}`;
                try {
                    // console.log((`${data_dir}${fName}`))
                    let transformer: Transformer
                    let actualProj: TransformableProject
                    let expectedProj: TransformableProject
                    try {

                        actualProj = projectReader(`${data_dir}${fName}_actual`)
                        expectedProj = projectReader(`${data_dir}${fName}_expected`)
                        transformer = Transformer.ofProject(actualProj);
                    } catch (e2) {
                        console.log('e2')
                        console.log(e2)
                        throw e2
                    }

                    transformer.transformWithProject(jsonRequire);
                    let actFiles:string[] = actualProj.getJSNames().sort();
                    let expFiles:string[] = expectedProj.getJSNames().sort();
                    console.log(fName)
                   console.log("a" + actFiles.length)
                   console.log("e" + expFiles.length)

                    console.log(actualProj.getJSNames().sort())
                    console.log(expectedProj.getJSNames().sort())
                    console.log('expecting sizes')
                    expect(actFiles).to.be.deep.equal(expFiles, actFiles.length+' '+expFiles.length +" file: " +fName)

                    expectedProj.forEachSource(e=> console.log(e.getRelative()))
                    actualProj.forEachSource(e=> console.log(e.getRelative()))
                    actFiles.forEach(f => {
                        let expected = expectedProj.getJS(f).makeString();
                        let actual = actualProj.getJS(f).makeString();
                        expect(actual).to.be.equal(expected)
                    });
                    // if (existsSync(out)) {
                    //     rmdirSync(out, {recursive: true});
                     // }
                    // try {
                    //     actualProj.writeOutNewDir(out)
                    // } catch (e3) {
                    //     console.log('e3')
                    //     console.log(e3)
                    //     throw e3;
                    // }
                    // const expectedProj = projectReader(`${data_dir}fname_expected`)
                } catch (err) {
                    console.log(`error in project ${data_dir}${fName}
            ERROR IS ${err}\n\n\n`)
                    throw err
                }

console.log(`\n\tend of ${fName}\n\n\n\n\n--------------------------------------------------------------------------------\n\n\n\n\n`)

            }
        }
    });
});