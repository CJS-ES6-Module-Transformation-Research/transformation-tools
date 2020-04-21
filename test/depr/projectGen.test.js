Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
var chai_1 = require("chai");
var walker_1 = require("../../___DEPR___/fsys/walker");
var Dirs_1 = require("../../Utils/Dirs");
var LOCAL_TEST = "res/fixtures/Project_VerySimple_dir";
describe("Proj Name", function () {
    it("should be five files", function () {
        ;
        var result = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST).project;
        chai_1.expect(Dirs_1.test_root + "/" + LOCAL_TEST).to.equal(result);
    });
});
describe("CountNumFiles", function () {
    it("should be five files", function () {
        ;
        var result = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST);
        chai_1.expect(5).to.equal(result.files.length);
    });
});
describe("CountDirs", function () {
    it("should be 1 subdirectories ", function () {
        ;
        var result = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST);
        chai_1.expect(1).to.equal(result.dirs.length);
    });
});
describe("Count JS", function () {
    it("should be 2 js file", function () {
        ;
        var result = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST);
        chai_1.expect(result.files
            .filter(function (e) { return e.ftype === index_1.FILE_TYPE.JS; })
            .map(function (e) { return 1; })
            .reduce(function (prev, curr) {
            return prev + curr;
        }, 0))
            .to.equal(2);
    });
});
describe("Count JSON", function () {
    it("should be 1 JSON file", function () {
        ;
        var result = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST);
        chai_1.expect(result.files
            .filter(function (e) { return e.ftype === index_1.FILE_TYPE.JSON; })
            .map(function (e) { return 1; })
            .reduce(function (prev, curr) {
            return prev + curr;
        }, 0))
            .to.equal(1);
    });
});
describe("Count JSON", function () {
    it("should be 1 JSON file", function () {
        ;
        var result = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST);
        chai_1.expect(result.files
            .filter(function (e) { return e.ftype === index_1.FILE_TYPE.JSON; })
            .map(function (e) { return 1; })
            .reduce(function (prev, curr) {
            return prev + curr;
        }, 0))
            .to.equal(1);
    });
});
describe("Count Other files", function () {
    it("should be 1 other file", function () {
        ;
        var result = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST);
        chai_1.expect(result.files
            .filter(function (e) { return e.ftype === index_1.FILE_TYPE.OTHER; })
            .map(function (e) { return 1; })
            .reduce(function (prev, curr) {
            return prev + curr;
        }, 0))
            .to.equal(1);
    });
});
describe("Count symlinks files", function () {
    it("should be 1 link", function () {
        ;
        var result = walker_1.traverseProject(Dirs_1.test_root + "/" + LOCAL_TEST);
        chai_1.expect(result.files
            .filter(function (e) { return e.ftype === index_1.FILE_TYPE.OTHER; })
            .map(function (e) { return 1; })
            .reduce(function (prev, curr) {
            return prev + curr;
        }, 0))
            .to.equal(1);
    });
});
