
 import {expect} from "chai";
import {execSync} from "child_process";
import {readdirSync, readFileSync} from "fs";
import 'mocha';
import {join} from "path";
import {ProjectManager} from "../../src/control";
import {clean} from "../../src/refactoring";
import {betweenLines, copyTest} from '../TemplateTool';






let tmp;
let original;
let pm;


describe('runtime', () => {
    let test = '/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test_data/cleaning/runtime_states/test0';
    it(test, done => {
        original = join(test, 'original');
        tmp = join(test, 'tmp');
        copyTest(original, tmp);
        pm = pm = getPM(tmp);
        clean(pm);
        pm.writeOut().then(() => {
            let tmpRds = readdirSync(tmp);
            let actual = execSync('node ' + join(tmp, 'main.js')).toString('utf-8');
            expect(actual).to.be.eq(betweenLines(JSON.parse(readFileSync(join(original, 'expected'), 'utf-8'))['expected']));
        }).then(done);
    });
});


function getPM(tmp) {
    return new ProjectManager(tmp, {
        input: tmp,
        output: '',
        suffix: '',
        isNamed: true,
        report: false,
        operation_type: 'in-place'
    });
}