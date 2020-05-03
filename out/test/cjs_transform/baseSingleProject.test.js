var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var index_1 = require("../index");
var esprima_1 = require("esprima");
var fs_1 = require("fs");
var shebang_regex_1 = __importDefault(require("shebang-regex"));
var Transformer_1 = require("../src/transformations/Transformer");
var import_replacement_1 = require("../src/transformations/import_transformations/visitors/import_replacement");
var src_1 = require("../src");
var project;
var projstr = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/fixtures/test_dir";
project = src_1.projectReader(projstr);
var jsIndex = project.getJS('index.js');
var libIndex = project.getJS('lib/index.js');
describe('Testing OO version ', function () {
    mocha_1.it('Test AST read-in correctly', function () {
        project = src_1.projectReader(index_1.test_dir);
        project.forEachSource(function (e) {
            if (e.isSource()) {
                var file = fs_1.readFileSync(e.getAbsolute()).toString();
                file = shebang_regex_1.default.test(file)
                    ? file.replace(shebang_regex_1.default.exec(file)[0], '')
                    : file;
                var ast = void 0;
                try {
                    ast = esprima_1.parseScript(file);
                }
                catch (e) {
                    console.log("ERROR IN FILE file: " + e.getAbsolute + " could not parse :" + e);
                }
                chai_1.expect(ast)
                    .to.be.deep.equal(e.getAST());
            }
        });
    });
    mocha_1.it('Test Write-Out for shebangs', function () {
        project.forEachSource(function (e) {
            if (e.getSheBang()) {
                var out = e.makeString();
                var shebang = shebang_regex_1.default.test(out);
                chai_1.expect(shebang_regex_1.default.test(out)).to.be.true;
                chai_1.expect(e.getSheBang().trim()).to.be.equal(shebang_regex_1.default.exec(out)[0].toString().trim());
            }
        });
    });
});
function wipeShebang(text) {
    if (shebang_regex_1.default.test(text)) {
        var shebang = shebang_regex_1.default.exec(this.text)[0].toString();
        return text.replace(shebang, '');
    }
    return text;
}
describe('Testing various sanitize procedures', function () {
    mocha_1.it('Require String Tests', function () {
        var actual = src_1.projectReader(index_1.test_dir);
        var expected = src_1.projectReader(index_1.EXPECTED + "/requireString/");
        var listOfFiles = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js'];
        var transformer = Transformer_1.Transformer.ofProject(actual);
        transformer.transform(src_1.requireStringSanitizer);
        listOfFiles.forEach(function (file) {
            var actualFile = actual.getJS(file);
            var expectedFile = expected.getJS(file);
            chai_1.expect(expectedFile.makeString()).to.be.equal(actualFile.makeString());
        });
    });
    mocha_1.it('VariableDeclaration Flattening', function () {
        //flattenDecls
        var inputProjectDir = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/actual/flattenActual/";
        var expectedProjDir = index_1.EXPECTED + "/flattener";
        var actual = src_1.projectReader(inputProjectDir);
        var expected = src_1.projectReader(expectedProjDir);
        var listOfFiles = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js'];
        var transformer = Transformer_1.Transformer.ofProject(actual);
        transformer.transform(src_1.flattenDecls);
        listOfFiles.forEach(function (file) {
            var actualFile = actual.getJS(file);
            var expectedFile = expected.getJS(file);
            chai_1.expect(expectedFile.makeString()).to.be.equal(actualFile.makeString(), "DECL FLATTEN ERR   " + actualFile.getAbsolute());
        });
    });
    //
    mocha_1.it('Access Replacement', function () {
        //AccessReplace
        var actualProj = src_1.projectReader("/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/actual/accessReplace");
        var expectedProj = src_1.projectReader(index_1.EXPECTED + "/accessReplace/");
        var listOfFiles = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js'];
        var transformer = Transformer_1.Transformer.ofProject(actualProj);
        transformer.transform(src_1.accessReplace);
        listOfFiles.forEach(function (file) {
            var expected, actual;
            var actualFile = actualProj.getJS(file);
            var expectedFile = expectedProj.getJS(file);
            expected = expectedFile.makeString();
            actual = actualFile.makeString();
            chai_1.expect(actual)
                .to.be.equal(expected, "in file " + actualFile.getAbsolute());
        });
    });
    mocha_1.it('Import Transformations', function () {
        //AccessReplace
        var actualProj = src_1.projectReader("/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/actual/importTransform");
        var expectedProj = src_1.projectReader("/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/expected/imports", 'module');
        var listOfFiles = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js'];
        var transformer = Transformer_1.Transformer.ofProject(actualProj);
        transformer.transform(src_1.accessReplace);
        transformer.transform(import_replacement_1.transformImport);
        listOfFiles.forEach(function (file) {
            var expected, actual;
            var actualFile = actualProj.getJS(file);
            var expectedFile = expectedProj.getJS(file);
            try {
                expected = expectedFile.makeString();
            }
            catch (e) {
                console.log(e);
                console.log(file);
                throw e;
            }
            actual = actualFile.makeString();
            chai_1.expect(actual)
                .to.be.equal(expected, "in file " + file);
        });
    });
});
