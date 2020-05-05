var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var shebang_regex_1 = __importDefault(require("shebang-regex"));
var Transformer_1 = require("../../src/transformations/Transformer");
var src_1 = require("../../src");
var index_1 = require("../../index");
var index_2 = require("../index");
var import_replacement_1 = require("../../src/transformations/import_transformations/visitors/import_replacement");
var project;
var projstr = index_1.project + "/test/res/fixtures/test_dir";
project = src_1.projectReader(projstr);
var jsIndex = project.getJS('index.js');
var libIndex = project.getJS('lib/index.js');
function wipeShebang(text) {
    if (shebang_regex_1.default.test(text)) {
        var shebang = shebang_regex_1.default.exec(this.text)[0].toString();
        return text.replace(shebang, '');
    }
    return text;
}
//
describe('Testing various sanitize procedures', function () {
    //
    mocha_1.it('Require String Tests', function () {
        var actual = src_1.projectReader(index_2.project_test_dirs['untouched']);
        // let expected: TransformableProject = projectReader(`${EXPECTED}/requireString/`);
        var expected = src_1.projectReader(index_2.project_test_dirs['requireString']);
        var listOfFiles = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js'];
        var transformer = Transformer_1.Transformer.ofProject(actual);
        transformer.transform(src_1.requireStringSanitizer);
        listOfFiles.forEach(function (file) {
            var actualFile = actual.getJS(file);
            var expectedFile = expected.getJS(file);
            chai_1.expect(expectedFile.makeString()).to.be.equal(actualFile.makeString());
        });
    });
    //
    mocha_1.it('JSON Require Transforming', function () {
        //jsonRequire
        // let inputProjectDir = `${PROJ_DIR}/test/res/actual/flattenActual/`
        // let expectedProjDir = `${EXPECTED}/flattener`;
        var actual = src_1.projectReader(index_2.project_test_dirs['requireString']);
        var expected = src_1.projectReader(index_2.project_test_dirs['jsonRequireCreate']);
        var listOfFiles = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js'];
        var transformer = Transformer_1.Transformer.ofProject(actual);
        transformer.transformWithProject(src_1.jsonRequire);
        listOfFiles.forEach(function (file) {
            var actualFile = actual.getJS(file);
            var expectedFile = expected.getJS(file);
            chai_1.expect(expectedFile.makeString()).to.be.equal(actualFile.makeString(), " " + actualFile.getAbsolute());
        });
    });
    mocha_1.it('VariableDeclaration Flattening', function () {
        //flattenDecls
        // let inputProjectDir = `${PROJ_DIR}/test/res/actual/flattenActual/`
        // let expectedProjDir = `${EXPECTED}/flattener`;
        var actual = src_1.projectReader(index_2.project_test_dirs['jsonRequireCreate']);
        var expected = src_1.projectReader(index_2.project_test_dirs['declFlatten']);
        var listOfFiles = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ];
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
        //AccessReplace${
        var actualProj = src_1.projectReader(index_2.project_test_dirs['declFlatten']);
        var expectedProj = src_1.projectReader(index_2.project_test_dirs['accessReplace']);
        var listOfFiles = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ];
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
    mocha_1.it('exports flatten', function () {
        //AccessReplace${
        var actualProj = src_1.projectReader(index_2.project_test_dirs['accessReplace']);
        var expectedProj = src_1.projectReader(index_2.project_test_dirs['module_exports_flatten']);
        var listOfFiles = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ];
        var transformer = Transformer_1.Transformer.ofProject(actualProj);
        transformer.transform(src_1.collectDefaultObjectAssignments);
        listOfFiles.forEach(function (file) {
            var expected, actual;
            var actualFile = actualProj.getJS(file);
            var expectedFile = expectedProj.getJS(file);
            if (expectedFile === undefined) {
                console.log(file);
            }
            expected = expectedFile.makeString();
            actual = actualFile.makeString();
            chai_1.expect(actual)
                .to.be.equal(expected, "in file " + actualFile.getAbsolute());
        });
    });
    //
    mocha_1.it('Import Transformations', function () {
        //AccessReplace
        var actualProj = src_1.projectReader(index_2.project_test_dirs['module_exports_flatten']);
        var expectedProj = src_1.projectReader(index_2.project_test_dirs['import_main'], 'module');
        var listOfFiles = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ];
        var transformer = Transformer_1.Transformer.ofProject(actualProj);
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
                .to.be.equal(expected, "in file " + file + " ");
        });
    });
});
describe('Misc', function () {
    mocha_1.it('Test Write-Out for shebangs', function () {
        src_1.projectReader(index_2.project_test_dirs['untouched']).forEachSource(function (e) {
            if (e.getSheBang()) {
                var out = e.makeString();
                var shebang = shebang_regex_1.default.test(out);
                chai_1.expect(shebang_regex_1.default.test(out)).to.be.true;
                chai_1.expect(e.getSheBang().trim()).to.be.equal(shebang_regex_1.default.exec(out)[0].toString().trim());
            }
        });
    });
});
