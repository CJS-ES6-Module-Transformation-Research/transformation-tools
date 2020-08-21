import {readFileSync} from 'fs';
 import {expect} from 'chai';
import {parseScript, Program} from "esprima";
import {generate} from "escodegen";
import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {ProjectManager } from "../../src/abstract_fs_v2/ProjectManager";
import {requireStringSanitizer} from '../../src/transformations/sanitizing/visitors';
import {project as PROJ_DIR} from '../../index'
import {mock_opts} from "../index";

const requireString = `${PROJ_DIR}/test/test_resources/sanitize/require_string`
const read =
    readFileSync(`${requireString}/tests.txt`)
        .toString()
        .trim()
        .split(`\n`);

// @ts-ignore
describe('Sanitize: 0 Require String Tests', () => {
    // @ts-ignore
    it(`Require Tests From ${requireString}/tests.txt`, () => {

        read.forEach( async (e) => {
            let expected: string, expectedFileString: string, expectedProgString: string, expectedAST: Program,
                jsf: JSFile,loadedJSFile,actual;
            let project: ProjectManager;
            project = new ProjectManager(`${requireString}/must_sanitize/${e}`,mock_opts);
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


