Object.defineProperty(exports, "__esModule", { value: true });
const ImportManager_1 = require("../../src/transformations/import_transformations/ImportManager");
const chai_1 = require("chai");
const escodegen_1 = require("escodegen");
const esprima_1 = require("esprima");
const mocha_1 = require("mocha");
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
let path = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/importManager_test_files`;
let project;
let manager = new ImportManager_1.ImportManager();
mocha_1.describe('Utility Testing for ImportManager', () => {
    mocha_1.beforeEach('before each', () => {
        manager = new ImportManager_1.ImportManager();
    });
    let actual, expected;
    mocha_1.it('add one default', () => {
        manager.createDefault('path', '_path');
        let actualList = manager.buildDeclList()[0];
        actual = escodegen_1.generate(actualList);
        expected = `import _path from 'path';`;
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add one named', () => {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        let actualList = manager.buildDeclList()[0];
        let actual = escodegen_1.generate(actualList);
        let expected = `import { dirname as path_dirname } from 'path';`;
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add one with two named same call', () => {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        manager.createNamedWithAlias('path', 'join');
        let actualList = manager.buildDeclList()[0];
        let actual = escodegen_1.generate(actualList);
        let expected = escodegen_1.generate(esprima_1.parseModule(`import { dirname as path_dirname, join } from 'path';`));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add one with two named different call', () => {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        manager.createNamedWithAlias('path', 'join');
        let actualList = manager.buildDeclList()[0];
        let actual = escodegen_1.generate(actualList);
        let expected = escodegen_1.generate(esprima_1.parseModule(`import { dirname as path_dirname, join } from 'path';`));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add one side effect', () => {
        manager.createSideEffect('path');
        let actualList = manager.buildDeclList()[0];
        let actual = escodegen_1.generate(actualList);
        let expected = escodegen_1.generate(esprima_1.parseModule(`import   'path';`));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add default+named', () => {
        manager.createDefault('url', 'url');
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        let program = esprima_1.parseModule('');
        manager.buildDeclList().forEach(e => program.body.push(e));
        let actual = escodegen_1.generate(program);
        let expected = escodegen_1.generate(esprima_1.parseModule(`import url from 'url';import { dirname as path_dirname  } from 'path';`));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add default+side effect', () => {
        manager.createDefault('url', 'url');
        manager.createSideEffect('path');
        let program = esprima_1.parseModule('');
        manager.buildDeclList().forEach(e => program.body.push(e));
        let actual = escodegen_1.generate(program);
        let expected = escodegen_1.generate(esprima_1.parseModule(`import url from 'url';import  'path';`));
        chai_1.expect(actual).to.eq(expected);
    });
    mocha_1.it('add named+side effect', () => {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname');
        manager.createSideEffect('chai');
        let program = esprima_1.parseModule('');
        manager.buildDeclList().forEach(e => program.body.push(e));
        let actual = escodegen_1.generate(program);
        let expected = escodegen_1.generate(esprima_1.parseModule(`import {dirname as path_dirname} from 'path';import  'chai';`));
        chai_1.expect(actual).to.eq(expected);
    });
});
