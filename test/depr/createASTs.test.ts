// import {createASTs} from "../../___DEPR___/ast/CreateASTs";
// import {expect} from "chai";
// import {AstFile, ProjectFS} from "../../src/Types";
// import {traverseProject} from '../../___DEPR___/fsys/walker'
// import {Program, BlockStatement} from 'estree'
// import {test_root} from "../../Utils/Dirs";
//
// const LOCAL_TEST = `/res/fixtures/Project_VerySimple_dir`;
// let tmp = `${test_root}/res/fixtures/tmp`
//
//
// describe("Running tests on 'initProjectFS which builds new filesystem from project",
//     () => {
//         // beforeEach('before',()=>{console.log("hello")})
//         it(`Should be two ASTs`, () => {
//             let projFS
//             let astFiles
//             try {
//                 projFS = traverseProject(`${test_root}/${LOCAL_TEST}`);
//             } catch (err) {
//                 expect.fail("first call failed"+err.toString() )
//             }
//             try {
//                 astFiles = createASTs(projFS)
//             } catch (err) {
//                 expect.fail("second call failed")
//             }
//             const result: number = astFiles.length;
//             expect(2).to.equal(result,`${result}`);
//             console.log(`2,${result}`)
//         });
//         it(`should be a variable declaration with body length 1`, () => {
//             let projFS: ProjectFS;
//             let astFiles: AstFile[];
//             projFS = traverseProject(`${test_root}/${LOCAL_TEST}`);
//             astFiles = createASTs(projFS)
//             const result = astFiles.sort()
//
//             // @ts-ignore
//             expect('VariableDeclaration').to.equal(result[0].ast.body[0].type);
//             console.log(`VariableDeclaration {(result[0].ast as Program | BlockStatement).body[0].type}`)
//
//             expect(1).to.equal((result[0].ast as Program).body.length);
//          })
//     });