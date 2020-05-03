Object.defineProperty(exports, "__esModule", { value: true });
var ImportManager_1 = require("../src/transformations/import_transformations/ImportManager");
var chai_1 = require("chai");
var escodegen_1 = require("escodegen");
var esprima_1 = require("esprima");
var mocha_1 = require("mocha");
var path = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/importManager_test_files";
var project;
var manager = new ImportManager_1.ImportManager();
mocha_1.describe('testing for ImportManager', function () {
    mocha_1.beforeEach('before each', function () {
        manager = new ImportManager_1.ImportManager();
    });
    var actual, expected;
    mocha_1.it('add one default', function () {
        manager.createDefault('path', '_path');
        var actualList = manager.buildDeclList()[0];
        actual = escodegen_1.generate(actualList);
        expected = "import _path from 'path';";
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add one named', function () {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        var actualList = manager.buildDeclList()[0];
        var actual = escodegen_1.generate(actualList);
        var expected = "import { dirname as path_dirname } from 'path';";
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add one with two named same call', function () {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        manager.createNamedWithAlias('path', 'join');
        var actualList = manager.buildDeclList()[0];
        var actual = escodegen_1.generate(actualList);
        var expected = escodegen_1.generate(esprima_1.parseModule("import { dirname as path_dirname, join } from 'path';"));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add one with two named different call', function () {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        manager.createNamedWithAlias('path', 'join');
        var actualList = manager.buildDeclList()[0];
        var actual = escodegen_1.generate(actualList);
        var expected = escodegen_1.generate(esprima_1.parseModule("import { dirname as path_dirname, join } from 'path';"));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add one side effect', function () {
        manager.createSideEffect('path');
        var actualList = manager.buildDeclList()[0];
        var actual = escodegen_1.generate(actualList);
        var expected = escodegen_1.generate(esprima_1.parseModule("import   'path';"));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add default+named', function () {
        manager.createDefault('url', 'url');
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        var program = esprima_1.parseModule('');
        manager.buildDeclList().forEach(function (e) { return program.body.push(e); });
        var actual = escodegen_1.generate(program);
        var expected = escodegen_1.generate(esprima_1.parseModule("import url from 'url';import { dirname as path_dirname  } from 'path';"));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add default+side effect', function () {
        manager.createDefault('url', 'url');
        manager.createSideEffect('path');
        var program = esprima_1.parseModule('');
        manager.buildDeclList().forEach(function (e) { return program.body.push(e); });
        var actual = escodegen_1.generate(program);
        var expected = escodegen_1.generate(esprima_1.parseModule("import url from 'url';import  'path';"));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add named+side effect', function () {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        manager.createSideEffect('chai');
        var program = esprima_1.parseModule('');
        manager.buildDeclList().forEach(function (e) { return program.body.push(e); });
        var actual = escodegen_1.generate(program);
        var expected = escodegen_1.generate(esprima_1.parseModule("import {dirname as path_dirname} from 'path';import  'chai';"));
        chai_1.expect(actual).to.eq(expected);
    });
});
// new JSFile(path,)
// let jsf: JSFile;
// jsf = new JSFile(path, null, `default_SE.js`)
// jsf = new JSFile(path, null, `default_named.js`)
// jsf = new JSFile(path, null, `multi_named.js`)
// jsf = new JSFile(path, null, `multi_named_2xSTMT.js`)
// jsf = new JSFile(path, null, `named_SE.js`)
// jsf = new JSFile(path, null, `single_SE.js`)
// jsf = new JSFile(path, null, `single_default.js`)
// jsf = new JSFile(path, null, `single_named.js`);
// describe('testing for ImportManager', () => {
//     beforeEach('before each', () => {
//         project = projectReader(path, 'script');
//     })
//
//     it('', () => {
//         let data = project.getJS('')
//         let importMan = data.getImports();
//         // expect( importMan.importsThis()).to.be.true
//         expect(false).to.be.true
//     })
// })
