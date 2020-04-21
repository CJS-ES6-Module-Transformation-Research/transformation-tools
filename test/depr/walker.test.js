Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../../index");
var walker_1 = require("../../___DEPR___/fsys/walker");
var Dirs_1 = require("../../Utils/Dirs");
describe("Check Directory", function () {
    it("Expects " + Dirs_1.test_dir, function () {
        // const result = JSON.stringify(traverse(test_dir));
        var result = walker_1.traverseProject(Dirs_1.test_dir).project;
        chai_1.expect(result).to.equal("" + Dirs_1.test_dir);
    });
});
describe("Only js/json Files", function () {
    it("Expects to see only js/json files...", function () {
        // const result = JSON.stringify(traverse(test_dir));
        walker_1.traverseProject(Dirs_1.test_dir)
            .files
            .forEach(function (FD, i, arrE) {
            chai_1.expect(FD.ftype).to.not.equal(index_1.FILE_TYPE.OTHER);
        });
    });
});
describe("dirs", function () {
    it("Expects the correct number and name of the 'dir' properties of the FileDescript objects.", function () {
        var result = walker_1.traverseProject(Dirs_1.test_dir)
            .files
            .map(function (fd) { return fd.dir; })
            .sort();
        JSON.stringify(result);
        chai_1.expect([
            "" + Dirs_1.test_dir,
            "" + Dirs_1.test_dir,
            "" + Dirs_1.test_dir,
            Dirs_1.test_dir + "/lib",
            Dirs_1.test_dir + "/src",
            Dirs_1.test_dir + "/test"
        ]).to.deep.equal(result);
        // })
    });
});
describe("fnames", function () {
    it("Expects the correct number and name of the 'file' properties of the FileDescript objects.", function () {
        var result = walker_1.traverseProject(Dirs_1.test_dir)
            .files
            .map(function (fd) { return fd.file; })
            .sort();
        JSON.stringify(result);
        chai_1.expect([
            "default.test.js",
            "index.js",
            "index.js",
            "index.js",
            "lib.js",
            "package.json"
        ]).to.deep.equal(result);
        // })
    });
});
describe("Absolute path FD", function () {
    it("Expects the correct number and name of the 'full' properties (absolute paths) of the FileDescript objects.", function () {
        var result = walker_1.traverseProject(Dirs_1.test_dir)
            .files
            .map(function (fd) { return fd.full; })
            .sort();
        JSON.stringify(result);
        chai_1.expect([
            Dirs_1.test_dir + "/index.js",
            Dirs_1.test_dir + "/lib.js",
            Dirs_1.test_dir + "/lib/index.js",
            Dirs_1.test_dir + "/package.json",
            Dirs_1.test_dir + "/src/index.js",
            Dirs_1.test_dir + "/test/default.test.js"
        ]).to.deep.equal(result);
        // })
    });
});
