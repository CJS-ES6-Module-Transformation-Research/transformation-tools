
import {readFileSync} from 'fs'
import {project} from "../../index";
import {Namespace} from "../../src/abstract_fs_v2/Namespace";
import {test_root} from "../index";
import {parseScript, Program} from "esprima";
import { join } from "path";
import { expect } from 'chai';

const testDir = join(project, 'test', `test_resources/res/namespace_test_files`)

interface map {
    [key: string]: string;
}

const testData: map = {};
testData['singleVDecl'] = readFileSync(`${testDir}/singleVDecl.js`).toString()
testData ['multiVDecl'] = readFileSync(`${testDir}/multiVDecl.js`).toString()
testData ['singleDeconsDecl'] = readFileSync(`${testDir}/singleDeconsDecl.js`).toString()
testData ['multiDeconsDecl'] = readFileSync(`${testDir}/multiDeconsDecl.js`).toString()
testData ['moduleExports'] = readFileSync(`${testDir}/moduleExports.js`).toString()
testData ['funcDecl'] = readFileSync(`${testDir}/funcDecl.js`).toString()
testData ['classDecl'] = readFileSync(`${testDir}/classDecl.js`).toString()

//
// testData['singleVDecl']
// testData ['multiVDecl']
// testData ['singleDeconsDecl']
// testData ['multiDeconsDecl']
// testData ['moduleExports']
// testData ['funcDecl' ]
// testData ['classDecl']
// decl, assign in for
// not rhs of module.exports = {};
// @ts-ignore
describe('Utility: Basic Namespace Traversal Tests', () => {


    // @ts-ignore
    it('singleVDecl', () => {
        let data = Namespace.create(parseScript(testData['singleVDecl']));
        let size = 1;
        expect(data.containsName('x')).equal(true)
        expect(data.getAllNames().length).to.be.equal(size)
    });

    // @ts-ignore
    it('moduleExports', () => {
        let data = Namespace.create(parseScript(testData['moduleExports']));
        let size = 1;
        expect(data.containsName('module')).true
        expect(data.getAllNames().length).to.be.equal(size)
    });


// @ts-ignore
    it('funcDecl', () => {
        let data = Namespace.create(parseScript(testData['funcDecl']));
        let size = 3;
        expect(data.containsName('x'), 'x').true
        expect(data.containsName('a'), 'a').true
        expect(data.containsName('b'), 'b').true
        expect(data.getAllNames().length).to.be.equal(size)
    });


    // @ts-ignore
    it('classDecl', () => {
        let data = Namespace.create(parseScript(testData['classDecl']));
        let size = 1;
        expect(data.containsName('HelloWorld')).true
        expect(data.getAllNames().length).to.be.equal(size)
    });


})

// @ts-ignore
describe('namespace variable renaming', () => {


    // @ts-ignore
    it('singleVDecl', () => {
        let data = Namespace.create(parseScript(testData['singleVDecl']));
        expect(data.generateBestName('x').name).equal('x0', data.generateBestName('x').name)
    });


    // @ts-ignore
    it('singleDeconsDecl', () => {
        let data = Namespace.create(parseScript(testData['singleDeconsDecl']));
        expect(data.generateBestName('a').name).equal('a0')
    });


    // @ts-ignore
    it('multiDeconsDecl', () => {
        let data = Namespace.create(parseScript(testData['multiDeconsDecl']));
        expect(data.generateBestName('a').name).equal('a0')
        expect(data.generateBestName('b').name).equal('b0')
        expect(data.generateBestName('c').name).equal('c0')
    });


    // @ts-ignore
    it('moduleExports', () => {
        let data = Namespace.create(parseScript(testData['moduleExports']));
        expect(data.generateBestName('a').name).equal('a')
        expect(data.generateBestName('exports').name).equal('exports')
        expect(data.generateBestName('hello').name).equal('hello')
    });


    // @ts-ignore
    it('funcDecl', () => {
        let data = Namespace.create(parseScript(testData['funcDecl']));
        expect(data.generateBestName('a').name).equal('a0')
        expect(data.generateBestName('b').name).equal('b0')
        expect(data.generateBestName('x').name).equal('x0')
    });


    // @ts-ignore
    it('classDecl', () => {
        let data = Namespace.create(parseScript(testData['classDecl']));
        expect(data.generateBestName('HelloWorld').name).equal('HelloWorld0')

    });

})
