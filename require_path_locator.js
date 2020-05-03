var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var chai_1 = require("chai");
var relative_1 = __importDefault(require("relative"));
var mocha_1 = require("mocha");
function computeRelativeToFile(file, require, projectDirectory) {
    var curr = projectDirectory + '/' + file;
    var allrelativetorequire = relative_1.default(curr, require, null);
    // let anABS = (`${projectDirectory}/${allrelativetorequire}`)
    var anABS = path_1.default.relative("" + projectDirectory, "" + allrelativetorequire);
    // console.log(anABS);
    // projectDirectory+'/'+
    var norm = path_1.default.normalize(anABS);
    return norm;
}
var project = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform";
var test = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform";
var abs = test; //`/absolute/project/path`
console.log(computeRelativeToFile("./src/index.ts", "../index.ts", abs));
// actual = computeRelativeToFile(``,``,root);
mocha_1.describe('relative path tests', function () {
    var root = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform";
    var expected, actual;
    mocha_1.it('both top level', function () {
        expected = "package.json";
        actual = computeRelativeToFile("index.js", "./package.json", root);
        chai_1.expect(actual).to.be.equal(project + "/" + expected);
    });
    mocha_1.it('js top level, json one below', function () {
        expected = "lib/package.json";
        actual = computeRelativeToFile("index.js", "./lib/package.json", root);
        chai_1.expect(actual).to.be.equal(project + "/" + expected);
    });
    mocha_1.it('js one below, json top level', function () {
        expected = "package.json";
        actual = computeRelativeToFile("lib/index.js", "../package.json", root);
        chai_1.expect(actual).to.be.equal(project + "/" + expected);
    });
    mocha_1.it('both one below', function () {
        expected = "lib/package.json";
        actual = computeRelativeToFile("lib/index.js", "./package.json", root);
        chai_1.expect(actual).to.be.equal(project + "/" + expected);
    });
    mocha_1.it('js one below, json two', function () {
        expected = "lib/util/package.json";
        actual = computeRelativeToFile("lib/index.json", "./util/package.json", root);
        chai_1.expect(actual).to.be.equal(project + "/" + expected);
    });
    mocha_1.it('js two below, json one', function () {
        expected = "lib/package.json";
        actual = computeRelativeToFile("./lib/util/index.js", "../package.json", root);
        chai_1.expect(actual).to.be.equal(project + "/" + expected);
    });
    mocha_1.it('js two below, json one', function () {
        expected = "lib/package.json";
        actual = computeRelativeToFile("lib/util/index.js", "../package.json", root);
        chai_1.expect(actual).to.be.equal(project + "/" + expected);
    });
    mocha_1.it('both two below', function () {
        expected = "lib/util/package.json";
        actual = computeRelativeToFile("lib/util/index.js", "./package.json", root);
        chai_1.expect(actual).to.be.equal(project + "/" + expected);
    });
});
