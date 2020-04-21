// import {FILE_TYPE} from "../../index";
// import {expect} from "chai";
// import {ProjectFS} from "../../src/Types";
// import {traverseProject} from "../../___DEPR___/fsys/walker";
// import {test_root} from "../../Utils/Dirs";
//
// const LOCAL_TEST = `res/fixtures/Project_VerySimple_dir`;
//
//
// describe("Proj Name",
//     () => {
//         it(`should be five files`, () => {
//             ;
//             const result = traverseProject(`${test_root}/${LOCAL_TEST}`).project;
//             expect(`${test_root}/${LOCAL_TEST}`).to.equal(result);
//         });
//     });
//
//
// describe("CountNumFiles",
//     () => {
//         it(`should be five files`, () => {
//             ;
//             const result: ProjectFS = traverseProject(`${test_root}/${LOCAL_TEST}`);
//             expect(5).to.equal(result.files.length);
//         });
//     });
//
//
// describe("CountDirs",
//     () => {
//         it(`should be 1 subdirectories `, () => {
//             ;
//             const result: ProjectFS = traverseProject(`${test_root}/${LOCAL_TEST}`);
//             expect(1).to.equal(result.dirs.length);
//         });
//     });
//
// describe("Count JS",
//     () => {
//         it(`should be 2 js file`, () => {
//             ;
//             const result: ProjectFS = traverseProject(`${test_root}/${LOCAL_TEST}`);
//             expect(result.files
//                 .filter((e) => e.ftype === FILE_TYPE.JS)
//                 .map((e) => 1)
//                 .reduce(
//                     (prev, curr) => {
//                         return prev + curr;
//                     }, 0))
//                 .to.equal(2);
//         });
//     });
//
//
// describe("Count JSON",
//     () => {
//         it(`should be 1 JSON file`, () => {
//             ;
//             const result: ProjectFS = traverseProject(`${test_root}/${LOCAL_TEST}`);
//
//
//
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
//     });
//
//
// describe("Count JSON",
//     () => {
//         it(`should be 1 JSON file`, () => {
//             ;
//             const result: ProjectFS = traverseProject(`${test_root}/${LOCAL_TEST}`);
//             expect(result.files
//                 .filter((e) => e.ftype === FILE_TYPE.JSON)
//                 .map((e) => 1)
//                 .reduce(
//                     (prev, curr) => {
//                         return prev + curr;
//                     }, 0))
//                 .to.equal(1);
//         });
//     });
//
//
// describe("Count Other files",
//     () => {
//         it(`should be 1 other file`, () => {
//             ;
//             const result: ProjectFS = traverseProject(`${test_root}/${LOCAL_TEST}`);
//             expect(result.files
//                 .filter((e) => e.ftype === FILE_TYPE.OTHER)
//                 .map((e) => 1)
//                 .reduce(
//                     (prev, curr) => {
//                         return prev + curr;
//                     }, 0))
//                 .to.equal(1);
//         });
//     });
//
//
// describe("Count symlinks files",
//     () => {
//         it(`should be 1 link`, () => {
//             ;
//             const result: ProjectFS = traverseProject(`${test_root}/${LOCAL_TEST}`);
//             expect(result.files
//                 .filter((e) => e.ftype === FILE_TYPE.OTHER)
//                 .map((e) => 1)
//                 .reduce(
//                     (prev, curr) => {
//                         return prev + curr;
//                     }, 0))
//                 .to.equal(1);
//         });
//     });