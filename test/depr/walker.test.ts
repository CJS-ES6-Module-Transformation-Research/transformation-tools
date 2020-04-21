import {expect} from 'chai'
import {FILE_TYPE} from "../../index";
import {FileDescript} from "../../src/Types";
import {traverseProject} from "../../___DEPR___/fsys/walker";
import {test_dir} from "../../Utils/Dirs";

describe("Check Directory",
    () => {
        it(`Expects ${test_dir}`, () => {
            // const result = JSON.stringify(traverse(test_dir));
            const result = traverseProject(test_dir).project;
            expect(result).to.equal(`${test_dir}`);
        });
    });


describe("Only js/json Files",
    () => {
        it(`Expects to see only js/json files...`, () => {
            // const result = JSON.stringify(traverse(test_dir));
            traverseProject(test_dir)
                .files
                .forEach((FD: FileDescript, i, arrE) => {
                    expect(FD.ftype).to.not.equal(FILE_TYPE.OTHER);
                })
        });
    });



describe("dirs",
    () => {
        it(`Expects the correct number and name of the 'dir' properties of the FileDescript objects.`,
            () => {
                let result = traverseProject(test_dir)
                    .files
                    .map((fd) => fd.dir)
                    .sort()
                JSON.stringify(result)
                expect([
                    `${test_dir}`
                    , `${test_dir}`
                    , `${test_dir}`
                    , `${test_dir}/lib`
                    , `${test_dir}/src`
                    , `${test_dir}/test`
                ]).to.deep.equal(result);
                // })
            });
    });


describe("fnames",
    () => {
        it(`Expects the correct number and name of the 'file' properties of the FileDescript objects.`,
            () => {
                let result = traverseProject(test_dir)
                    .files
                    .map((fd) => fd.file)
                    .sort()
                JSON.stringify(result)
                expect([
                    `default.test.js`
                    , `index.js`
                    , `index.js`
                    , `index.js`
                    , `lib.js`
                    , `package.json`
                ]).to.deep.equal(result);
                // })
            });
    });


describe("Absolute path FD",
    () => {
        it(`Expects the correct number and name of the 'full' properties (absolute paths) of the FileDescript objects.`,
            () => {
                let result = traverseProject(test_dir)
                    .files
                    .map((fd) => fd.full)
                    .sort()
                JSON.stringify(result)
                expect([
                    `${test_dir}/index.js`,
                    `${test_dir}/lib.js`,
                    `${test_dir}/lib/index.js`,
                    `${test_dir}/package.json`,
                    `${test_dir}/src/index.js`,
                    `${test_dir}/test/default.test.js`

                ]).to.deep.equal(result);
                // })
            });
    });