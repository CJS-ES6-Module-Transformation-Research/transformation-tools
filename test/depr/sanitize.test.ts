import {traverseProject} from "../../___DEPR___/fsys/walker";
import {FILE_TYPE} from "../../index";
import {FileDescript} from "../../src/Types";
import {expect} from "chai";
import {existsSync, mkdirSync, unlinkSync, writeFileSync} from "fs";

import sanitizeTests from '../res/lib/sanitizeTests'
import {test_dir} from "../../Utils/Dirs";

let js = sanitizeTests.js;
const tmpName = './depr.sanitize/temp.js';

describe(`Test Suite for sanitization.`, () => {
    before('create directory structure', () => {
        sanitizeTests.dirs.forEach((e) => {
            if (!existsSync(e)) {
                mkdirSync(`${test_dir}/${e}`, {recursive: true})
            }
        });
        sanitizeTests.files.forEach((e) => {
            if (!existsSync(e)) {
                writeFileSync(`${test_dir}/${e}`, 'export const a = 3;\n'
                    + 'export default function(a="hello"){console.log(a)};\n')
            }
        });
    });
    afterEach(`remove {$tmpName}`, () => {
        if (existsSync(tmpName)) {
            unlinkSync(tmpName);
        }
    })

    it(`Top level `, () => {
        writeFileSync(tmpName, js.topLevelRequire)
        // const result = JSON.stringify(traverse(test_dir));
        traverseProject('./depr.sanitize/')
            .files.filter((fd)=>{fd.ftype===FILE_TYPE.JS && fd.relative/*TODO add .XXX = file */})
            .forEach((FD: FileDescript, i, arrE) => {
                expect(FD.ftype).to.not.equal(FILE_TYPE.OTHER);
            })
    });
});