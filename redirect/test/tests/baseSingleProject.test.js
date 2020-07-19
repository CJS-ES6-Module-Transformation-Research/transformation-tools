var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const shebang_regex_1 = __importDefault(require("shebang-regex"));
const Transformer_1 = require("../../src/transformations/Transformer");
const src_1 = require("../../src");
const index_1 = require("../../index");
const index_2 = require("../index");
const import_replacement_1 = require("../../src/transformations/import_transformations/visitors/import_replacement");
let project;
let projstr = `${index_1.project}/test/res/fixtures/test_dir`;
project = src_1.projectReader(projstr);
let jsIndex = project.getJS('index.js');
let libIndex = project.getJS('lib/index.js');
function wipeShebang(text) {
    if (shebang_regex_1.default.test(text)) {
        let shebang = shebang_regex_1.default.exec(this.text)[0].toString();
        return text.replace(shebang, '');
    }
    return text;
}
//
describe('Testing various sanitize procedures within a project', () => {
    //
    mocha_1.it('Require String Tests', () => {
        let actual = src_1.projectReader(index_2.project_test_dirs['untouched']);
        // let expected: TransformableProject = projectReader(`${EXPECTED}/requireString/`);
        let expected = src_1.projectReader(index_2.project_test_dirs['requireString']);
        let listOfFiles = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js'];
        let transformer = Transformer_1.Transformer.ofProject(actual);
        transformer.transform(src_1.requireStringSanitizer);
        listOfFiles.forEach((file) => {
            let actualFile = actual.getJS(file);
            let expectedFile = expected.getJS(file);
            chai_1.expect(actualFile.makeString()).to.be.equal(expectedFile.makeString());
        });
    });
    //
    mocha_1.it('JSON Require Transforming', () => {
        //jsonRequire
        // let inputProjectDir = `${PROJ_DIR}/test/res/actual/flattenActual/`
        // let expectedProjDir = `${EXPECTED}/flattener`;
        let actual = src_1.projectReader(index_2.project_test_dirs['requireString']);
        let expected = src_1.projectReader(index_2.project_test_dirs['jsonRequireCreate']);
        let listOfFiles = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js'];
        let transformer = Transformer_1.Transformer.ofProject(actual);
        transformer.transformWithProject(src_1.jsonRequire);
        listOfFiles.forEach((file) => {
            let actualFile = actual.getJS(file);
            let expectedFile = expected.getJS(file);
            chai_1.expect(expectedFile.makeString()).to.be.equal(actualFile.makeString(), ` ${actualFile.getAbsolute()}`);
        });
    });
    mocha_1.it('VariableDeclaration Flattening', () => {
        //flattenDecls
        // let inputProjectDir = `${PROJ_DIR}/test/res/actual/flattenActual/`
        // let expectedProjDir = `${EXPECTED}/flattener`;
        let actual = src_1.projectReader(index_2.project_test_dirs['jsonRequireCreate']);
        let expected = src_1.projectReader(index_2.project_test_dirs['declFlatten']);
        let listOfFiles = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ];
        let transformer = Transformer_1.Transformer.ofProject(actual);
        transformer.transform(src_1.flattenDecls);
        listOfFiles.forEach((file) => {
            let actualFile = actual.getJS(file);
            let expectedFile = expected.getJS(file);
            chai_1.expect(expectedFile.makeString()).to.be.equal(actualFile.makeString(), `DECL FLATTEN ERR   ${actualFile.getAbsolute()}`);
        });
    });
    //
    mocha_1.it('Access Replacement', () => {
        //AccessReplace${
        let actualProj = src_1.projectReader(index_2.project_test_dirs['declFlatten']);
        let expectedProj = src_1.projectReader(index_2.project_test_dirs['accessReplace']);
        let listOfFiles = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ];
        let transformer = Transformer_1.Transformer.ofProject(actualProj);
        transformer.transform(src_1.accessReplace);
        listOfFiles.forEach((file) => {
            let expected, actual;
            let actualFile = actualProj.getJS(file);
            let expectedFile = expectedProj.getJS(file);
            expected = expectedFile.makeString();
            actual = actualFile.makeString();
            chai_1.expect(actual)
                .to.be.equal(expected, `in file ${actualFile.getAbsolute()}`);
        });
    });
    mocha_1.it('exports flatten', () => {
        let actualProj = src_1.projectReader(index_2.project_test_dirs['accessReplace']);
        let expectedProj = src_1.projectReader(index_2.project_test_dirs['module_exports_flatten']);
        let listOfFiles = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ];
        let transformer = Transformer_1.Transformer.ofProject(actualProj);
        transformer.transform(src_1.collectDefaultObjectAssignments);
        listOfFiles.forEach((file) => {
            let expected, actual;
            let actualFile = actualProj.getJS(file);
            let expectedFile = expectedProj.getJS(file);
            expected = expectedFile.makeString();
            actual = actualFile.makeString();
            chai_1.expect(actual)
                .to.be.equal(expected, `in file ${actualFile.getAbsolute()}`);
        });
    });
    //
    mocha_1.it('Import Transformations', () => {
        let actualProj = src_1.projectReader(index_2.project_test_dirs['module_exports_flatten']);
        let expectedProj = src_1.projectReader(index_2.project_test_dirs['import_main'], 'module');
        let listOfFiles = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ];
        let transformer = Transformer_1.Transformer.ofProject(actualProj);
        transformer.transform(import_replacement_1.transformImport);
        listOfFiles.forEach((file) => {
            let expected, actual;
            let actualFile = actualProj.getJS(file);
            let expectedFile = expectedProj.getJS(file);
            try {
                expected = expectedFile.makeString();
            }
            catch (e) {
                // console.log(e)
                // console.log(file)
                throw e;
            }
            actual = actualFile.makeString();
            chai_1.expect(actual)
                .to.be.equal(expected, `in file ${file} `);
        });
    });
});
describe('Misc', () => {
    mocha_1.it('Test Write-Out for shebangs', () => {
        src_1.projectReader(index_2.project_test_dirs['untouched']).forEachSource((e) => {
            if (e.getSheBang()) {
                console.log(`SHEBANG DETECTED: ${e.getSheBang()}`);
                let out = e.makeString();
                let shebang = shebang_regex_1.default.test(out);
                chai_1.expect(shebang).to.be.eq(true, e.getAbsolute());
                chai_1.expect(shebang_regex_1.default.test(out)).to.be.true;
                chai_1.expect(e.getSheBang().trim()).to.be.equal(shebang_regex_1.default.exec(out)[0].toString().trim());
            }
        });
    });
});
