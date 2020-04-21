// import {initProjectFS} from "../../___DEPR___/io/initProjectFS";
// import {FILE_TYPE, test_root} from "../../index";
// import {expect} from "chai";
// import {ProjectFS} from "../../src/Types";
// import {existsSync, rmdirSync} from "fs";
// import {afterEach} from 'mocha'
//
// const LOCAL_TEST = `/res/fixtures/Project_VerySimple_dir`;
// let tmp = `${test_root}/res/fixtures/tmp`
//
// describe("Running tests on 'initProjectFS which builds new filesystem from project",
//     () => {
//         afterEach('after-remove-dir', () => {
//             if (existsSync(tmp)) {
//                 rmdirSync(tmp, {recursive: true})
//             }
//         })
//         it(`should end in tmp`, () => {
//
//             const result = initProjectFS(`${test_root}/${LOCAL_TEST}`, tmp).project;
//             expect(`${test_root}/res/fixtures/tmp`).to.equal(result);
//
//
//         });
//         it(`should be five files`, () => {
//
//             const result: ProjectFS = initProjectFS(`${test_root}/${LOCAL_TEST}`, tmp);
//             expect(5).to.equal(result.files.length);
//             if (existsSync(tmp)) {
//                 rmdirSync(tmp, {recursive: true})
//             }
//
//         });
//         it(`should be 1 subdirectories `, () => {
//
//             const result: ProjectFS = initProjectFS(`${test_root}/${LOCAL_TEST}`, tmp);
//             expect(1).to.equal(result.dirs.length);
//             if (existsSync(tmp)) {
//                 rmdirSync(tmp, {recursive: true})
//             }
//
//         });
//         it(`should be 2 js file`, () => {
//
//             const result: ProjectFS = initProjectFS(`${test_root}/${LOCAL_TEST}`, tmp);
//             expect(result.files
//                 .filter((e) => e.ftype === FILE_TYPE.JS)
//                 .map((e) => 1)
//                 .reduce(
//                     (prev, curr) => {
//                         return prev + curr;
//                     }, 0))
//                 .to.equal(2);
//             if (existsSync(tmp)) {
//                 rmdirSync(tmp, {recursive: true})
//             }
//
//         });
//         it(`should be 1 JSON file`, () => {
//             ;
//             const result: ProjectFS = initProjectFS(`${test_root}/${LOCAL_TEST}`, tmp);
//             expect(result.files
//                 .filter((e) => e.ftype === FILE_TYPE.JSON)
//                 .map((e) => 1)
//                 .reduce(
//                     (prev, curr) => {
//                         return prev + curr;
//                     }, 0))
//                 .to.equal(1);
//
//         });
//         it(`should be 1 other file`, () => {
//             ;
//             const result: ProjectFS = initProjectFS(`${test_root}/${LOCAL_TEST}`, tmp);
//             expect(result.files
//                 .filter((e) => e.ftype === FILE_TYPE.OTHER)
//                 .map((e) => 1)
//                 .reduce(
//                     (prev, curr) => {
//                         return prev + curr;
//                     }, 0))
//                 .to.equal(1);
//             if (existsSync(tmp)) {
//                 rmdirSync(tmp, {recursive: true})
//             }
//         });
//         it(`should be 1 link`, () => {
//             ;
//             const result: ProjectFS = initProjectFS(`${test_root}/${LOCAL_TEST}`, tmp);
//
//             expect(result.files
//                 .filter((e) => e.ftype === FILE_TYPE.SYMLINK)
//                 .map((e) => 1)
//                 .reduce(
//                     (prev, curr) => {
//                         return prev + curr;
//                     }, 0))
//                 .to.equal(1);
//             if (existsSync(tmp)) {
//                 rmdirSync(tmp, {recursive: true})
//             }
//         });
//
//
//     })
