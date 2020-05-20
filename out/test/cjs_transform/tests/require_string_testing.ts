import {describe, it} from 'mocha';
import {readFileSync} from 'fs';
import {TransformableProject, projectReader, JSFile} from "../../src/abstract_representation/project_representation";
import {expect} from 'chai';
import {parseScript, Program} from "esprima";
import {generate} from "escodegen";
import {requireStringSanitizer} from '../../src/transformations/sanitizing/visitors';
import {project as PROJ_DIR} from '../../index'

const requireString = `${PROJ_DIR}/test/sanitize/require_string`
const read =
    readFileSync(`${requireString}/tests.txt`)
        .toString()
        .trim()
        .split(`\n`);

let project: TransformableProject;
describe('Sanitize: 0 Require String Tests', () => {
    it(`Require Tests From ${requireString}/tests.txt`, () => {
        let expected: string, expectedFileString: string, expectedProgString: string, expectedAST: Program,
            jsf: JSFile,loadedJSFile,actual;
        read.forEach( (e) => {
            project = projectReader(`${requireString}/must_sanitize/${e}`);
              expectedFileString = `${requireString}/expected/${e}.expected.js`;
              expectedProgString = readFileSync(expectedFileString).toString();
              expectedAST = parseScript(expectedProgString);
              expected = generate(expectedAST);
              loadedJSFile = `${e}.js`;


              jsf = project.getJS(loadedJSFile)
            requireStringSanitizer(jsf)
              actual = generate(jsf.getAST())
            expect(expected).to.equal(actual, `${PROJ_DIR}/test/sanitize/require_string/expected/${e}.expected.js`);

        });
    });
});


