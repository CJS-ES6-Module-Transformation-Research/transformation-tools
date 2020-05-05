import {ImportManager} from "../../src/transformations/import_transformations/ImportManager";
import {expect} from 'chai'
import {generate} from "escodegen";
import {parseModule} from "esprima";
import {beforeEach, it, describe} from 'mocha'
import {
    TransformableProject,
} from '../../src/abstract_representation/project_representation'


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
let path = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/importManager_test_files`
let project: TransformableProject;
let manager = new ImportManager();


describe('testing for ImportManager', () => {
    beforeEach('before each', () => {
        manager = new ImportManager()
    })
    let actual, expected
    it('add one default', () => {

        manager.createDefault('path', '_path')
        let actualList = manager.buildDeclList()[0]
        actual = generate(actualList)
        expected = `import _path from 'path';`
        expect(actual).to.eq(expected)

    })

    it('add one named', () => {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname')
        let actualList = manager.buildDeclList()[0]
        let actual = generate(actualList)
        let expected = `import { dirname as path_dirname } from 'path';`
        expect(actual).to.eq(expected)
    })
    it('add one with two named same call', () => {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname')
        manager.createNamedWithAlias('path', 'join')
        let actualList = manager.buildDeclList()[0]
        let actual = generate(actualList)
        let expected = generate(parseModule(`import { dirname as path_dirname, join } from 'path';`))
        expect(actual).to.eq(expected)
    })

    it('add one with two named different call', () => {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname')
        manager.createNamedWithAlias('path', 'join')
        let actualList = manager.buildDeclList()[0]
        let actual = generate(actualList)
        let expected = generate(parseModule(`import { dirname as path_dirname, join } from 'path';`))
        expect(actual).to.eq(expected)
    })

    it('add one side effect', () => {
        manager.createSideEffect('path')
        let actualList = manager.buildDeclList()[0]
        let actual = generate(actualList)
        let expected = generate(parseModule(`import   'path';`))
        expect(actual).to.eq(expected)
    })

    it('add default+named', () => {
        manager.createDefault('url', 'url')
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname')
        let program = parseModule('')
        manager.buildDeclList().forEach(e => program.body.push(e))
        let actual = generate(program)
        let expected = generate(parseModule(`import url from 'url';import { dirname as path_dirname  } from 'path';`))
        expect(actual).to.eq(expected)
    })


    it('add default+side effect', () => {
        manager.createDefault('url', 'url')
        manager.createSideEffect('path')
        let program = parseModule('')
        manager.buildDeclList().forEach(e => program.body.push(e))
        let actual = generate(program)
        let expected = generate(parseModule(`import url from 'url';import  'path';`))
        expect(actual).to.eq(expected)
    })


    it('add named+side effect', () => {
        manager.createNamedWithAlias('path', 'dirname', 'path_dirname')
        manager.createSideEffect('chai')
        let program = parseModule('')
        manager.buildDeclList().forEach(e => program.body.push(e))
        let actual = generate(program)
        let expected = generate(parseModule(`import {dirname as path_dirname} from 'path';import  'chai';`))
        expect(actual).to.eq(expected)
    })


})
