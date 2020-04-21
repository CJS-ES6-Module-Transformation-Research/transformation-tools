var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var walker_1 = require("../../___DEPR___/fsys/walker");
var index_1 = require("../../index");
var chai_1 = require("chai");
var fs_1 = require("fs");
var sanitizeTests_1 = __importDefault(require("../res/lib/sanitizeTests"));
var Dirs_1 = require("../../Utils/Dirs");
var js = sanitizeTests_1.default.js;
var tmpName = './depr.sanitize/temp.js';
describe("Test Suite for sanitization.", function () {
    before('create directory structure', function () {
        sanitizeTests_1.default.dirs.forEach(function (e) {
            if (!fs_1.existsSync(e)) {
                fs_1.mkdirSync(Dirs_1.test_dir + "/" + e, { recursive: true });
            }
        });
        sanitizeTests_1.default.files.forEach(function (e) {
            if (!fs_1.existsSync(e)) {
                fs_1.writeFileSync(Dirs_1.test_dir + "/" + e, 'export const a = 3;\n'
                    + 'export default function(a="hello"){console.log(a)};\n');
            }
        });
    });
    afterEach("remove {$tmpName}", function () {
        if (fs_1.existsSync(tmpName)) {
            fs_1.unlinkSync(tmpName);
        }
    });
    it("Top level ", function () {
        fs_1.writeFileSync(tmpName, js.topLevelRequire);
        // const result = JSON.stringify(traverse(test_dir));
        walker_1.traverseProject('./depr.sanitize/')
            .files.filter(function (fd) { fd.ftype === index_1.FILE_TYPE.JS && fd.relative; /*TODO add .XXX = file */ })
            .forEach(function (FD, i, arrE) {
            chai_1.expect(FD.ftype).to.not.equal(index_1.FILE_TYPE.OTHER);
        });
    });
});
