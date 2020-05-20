import {describe, it} from "mocha";
import {expect} from 'chai'
import {projectReader, TransformableProject} from "../../src/abstract_representation/project_representation";
import {test_root} from "../index";
import {Transformer} from "../../src/transformations/Transformer";
import {jsonRequire} from "../../src/transformations/sanitizing/visitors";


const data_dir = `${test_root}/sanitize/json_creator/`;



describe(`Sanitize: 1 JSON Require Creation Testing`, () => {
    it('Different Level JSON Requires', () => {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                let fName = `js-${i}_json-${j}`;

                let transformer: Transformer
                let actualProj: TransformableProject
                let expectedProj: TransformableProject


                actualProj = projectReader(`${data_dir}${fName}_actual`)
                expectedProj = projectReader(`${data_dir}${fName}_expected`)
                transformer = Transformer.ofProject(actualProj);

                transformer.transformWithProject(jsonRequire);
                let actFiles: string[] = actualProj.getJSNames().sort();
                let expFiles: string[] = expectedProj.getJSNames().sort();

                expect(actFiles).to.be.deep.equal(expFiles, actFiles.length + ' ' + expFiles.length + " file: " + fName)

                actFiles.forEach(f => {
                    let expected = expectedProj.getJS(f).makeString();
                    let actual = actualProj.getJS(f).makeString();
                    expect(actual).to.be.equal(expected)
                });


            }
        }
    });
});