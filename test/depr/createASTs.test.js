Object.defineProperty(exports, "__esModule", { value: true });
var CreateASTs_1 = require("../../___DEPR___/ast/CreateASTs");
var chai_1 = require("chai");
var walker_1 = require("../../___DEPR___/fsys/walker");
var Dirs_1 = require("../../Utils/Dirs");
var LOCAL_TEST = "/res/fixtures/Project_VerySimple_dir";
var tmp = Dirs_1.test_root + "/res/fixtures/tmp";
describe("Running tests on 'initProjectFS which builds new filesystem from project", function () {
    // beforeEach('before',()=>{console.log("hello")})
    it("Should be two ASTs", function () {
        var projFS;
        var astFiles;
        try {
            projFS = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST);
        }
        catch (err) {
            chai_1.expect.fail("first call failed" + err.toString());
        }
        try {
            astFiles = CreateASTs_1.createASTs(projFS);
        }
        catch (err) {
            chai_1.expect.fail("second call failed");
        }
        var result = astFiles.length;
        chai_1.expect(2).to.equal(result, "" + result);
        console.log("2," + result);
    });
    it("should be a variable declaration with body length 1", function () {
        var projFS;
        var astFiles;
        projFS = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST);
        astFiles = CreateASTs_1.createASTs(projFS);
        var result = astFiles.sort();
        // @ts-ignore
        chai_1.expect('VariableDeclaration').to.equal(result[0].ast.body[0].type);
        console.log("VariableDeclaration {(result[0].ast as Program | BlockStatement).body[0].type}");
        chai_1.expect(1).to.equal(result[0].ast.body.length);
    });
});
