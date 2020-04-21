Object.defineProperty(exports, "__esModule", { value: true });
var initProjectFS_1 = require("../../___DEPR___/io/initProjectFS");
var index_1 = require("../../index");
var chai_1 = require("chai");
var fs_1 = require("fs");
var mocha_1 = require("mocha");
var LOCAL_TEST = "/res/fixtures/Project_VerySimple_dir";
var tmp = index_1.test_root + "/res/fixtures/tmp";
describe("Running tests on 'initProjectFS which builds new filesystem from project", function () {
    mocha_1.afterEach('after-remove-dir', function () {
        if (fs_1.existsSync(tmp)) {
            fs_1.rmdirSync(tmp, { recursive: true });
        }
    });
    it("should end in tmp", function () {
        var result = initProjectFS_1.initProjectFS(index_1.test_root + "/" + LOCAL_TEST, tmp).project;
        chai_1.expect(index_1.test_root + "/res/fixtures/tmp").to.equal(result);
    });
    it("should be five files", function () {
        var result = initProjectFS_1.initProjectFS(index_1.test_root + "/" + LOCAL_TEST, tmp);
        chai_1.expect(5).to.equal(result.files.length);
        if (fs_1.existsSync(tmp)) {
            fs_1.rmdirSync(tmp, { recursive: true });
        }
    });
    it("should be 1 subdirectories ", function () {
        var result = initProjectFS_1.initProjectFS(index_1.test_root + "/" + LOCAL_TEST, tmp);
        chai_1.expect(1).to.equal(result.dirs.length);
        if (fs_1.existsSync(tmp)) {
            fs_1.rmdirSync(tmp, { recursive: true });
        }
    });
    it("should be 2 js file", function () {
        var result = initProjectFS_1.initProjectFS(index_1.test_root + "/" + LOCAL_TEST, tmp);
        chai_1.expect(result.files
            .filter(function (e) { return e.ftype === index_1.FILE_TYPE.JS; })
            .map(function (e) { return 1; })
            .reduce(function (prev, curr) {
            return prev + curr;
        }, 0))
            .to.equal(2);
        if (fs_1.existsSync(tmp)) {
            fs_1.rmdirSync(tmp, { recursive: true });
        }
    });
    it("should be 1 JSON file", function () {
        ;
        var result = initProjectFS_1.initProjectFS(index_1.test_root + "/" + LOCAL_TEST, tmp);
        chai_1.expect(result.files
            .filter(function (e) { return e.ftype === index_1.FILE_TYPE.JSON; })
            .map(function (e) { return 1; })
            .reduce(function (prev, curr) {
            return prev + curr;
        }, 0))
            .to.equal(1);
    });
    it("should be 1 other file", function () {
        ;
        var result = initProjectFS_1.initProjectFS(index_1.test_root + "/" + LOCAL_TEST, tmp);
        chai_1.expect(result.files
            .filter(function (e) { return e.ftype === index_1.FILE_TYPE.OTHER; })
            .map(function (e) { return 1; })
            .reduce(function (prev, curr) {
            return prev + curr;
        }, 0))
            .to.equal(1);
        if (fs_1.existsSync(tmp)) {
            fs_1.rmdirSync(tmp, { recursive: true });
        }
    });
    it("should be 1 link", function () {
        ;
        var result = initProjectFS_1.initProjectFS(index_1.test_root + "/" + LOCAL_TEST, tmp);
        chai_1.expect(result.files
            .filter(function (e) { return e.ftype === index_1.FILE_TYPE.SYMLINK; })
            .map(function (e) { return 1; })
            .reduce(function (prev, curr) {
            return prev + curr;
        }, 0))
            .to.equal(1);
        if (fs_1.existsSync(tmp)) {
            fs_1.rmdirSync(tmp, { recursive: true });
        }
    });
});
