Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestDir = exports.TEST_FILES_ROOT = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const index_1 = require("../../index");
exports.TEST_FILES_ROOT = path_1.join(index_1.TEST_DIR, `test_data`);
function getTestDir(name) {
    let dir = path_1.join(exports.TEST_FILES_ROOT, name);
    return {
        test_dir: dir,
        tests: fs_1.readdirSync(dir)
    };
}
exports.getTestDir = getTestDir;
// let it = parseScript(`it(${name}, ()=>{})`).body[0] as ExpressionStatement
// let test_input = ''
let category = '';
let operation = 'MANY';
let testFile = path_1.join(index_1.TEST_DIR, `test_resources/templates/lists`, category);
let dir = path_1.join(index_1.TEST_DIR, `test_data`, category);
let arrayOfTests = fs_1.readFileSync(testFile, 'utf-8').split('\n');
let target = '/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/tests/' +
    `${category}.ts`;
// let arrayOfTests = ['parallel_json_require',
// 	'up_one_json_require',
// 	'down_one_json_require',
// 	'multi_json_require_same_mid',
// 	'js_has_priority']
let ex = `function MANY(js:JSFile){throw new Error('IMPLEMENT THE API_BUILD TESTS THING ')}
	 `
    +
        `describe('${category}', ()=>{
${(arrayOfTests)
            .map(e => {
            return createIT(e, e.includes('__named'));
        })
            .reduce((prev, curr) => {
            return prev + '\n' + curr;
        }, '')}
	});`;
function createIT(test_name, isNamed) {
    let str = path_1.join(`test_data`, category, test_name);
    return `it('${test_name}', ()=>{ 
	const project =  createProject(join(TEST_DIR,'${str}'), ${isNamed}) 
	let actualJS: JSFile = project.getJS(  '${test_name}.actual.js');
	${operation}(actualJS)
	let prjS = project.getJS('${test_name}.expected.js')

	let expected = prjS.makeSerializable().fileData
	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ${test_name}');
});`;
}
fs_1.writeFileSync(target, `

import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {createProject} from "../index";
import {TEST_DIR} from "../index";
import {join} from "path";
import { expect } from "chai";
`
    + ex);
//# sourceMappingURL=basic.js.map