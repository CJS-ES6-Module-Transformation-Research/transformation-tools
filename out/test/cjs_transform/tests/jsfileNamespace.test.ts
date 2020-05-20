import {it} from "mocha";
import {expect} from "chai";
import {readFileSync} from 'fs'
import {test_root} from "../index";
import {parseScript, Program} from "esprima";
import {Namespace} from "../../src/abstract_representation/project_representation/javascript/Namespace";

const testDir = `${test_root}/res/namespace_test_files`

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
describe('Utility: Basic Namespace Traversal Tests', () => {


    it('singleVDecl', () => {
        let data = Namespace.create(parseScript(testData['singleVDecl']));
        let size = 1;
        expect(data.containsName('x')).equal(true)
        expect(data.getAllNames().length).to.be.equal(size)
    });


    it('singleDeconsDecl', () => {
        let data = Namespace.create(parseScript(testData['singleDeconsDecl']));
        let size = 1;
        expect(data.containsName('a')).true
        expect(data.getAllNames().length).to.be.equal(size)
    });


    it('multiDeconsDecl', () => {
        let data = Namespace.create(parseScript(testData['multiDeconsDecl']));
        let size = 3;
        expect(data.containsName('a')).true
        expect(data.containsName('b')).true
        expect(data.containsName('c')).true
        expect(data.getAllNames().length).to.be.equal(size)
    });


    it('moduleExports', () => {
        let data = Namespace.create(parseScript(testData['moduleExports']));
        let size = 1;
        expect(data.containsName('module')).true
        expect(data.getAllNames().length).to.be.equal(size)
    });


    it('funcDecl', () => {
        let data = Namespace.create(parseScript(testData['funcDecl']));
        let size = 3;
        expect(data.containsName('x'), 'x').true
        expect(data.containsName('a'), 'a').true
        expect(data.containsName('b'), 'b').true
        expect(data.getAllNames().length).to.be.equal(size)
    });


    it('classDecl', () => {
        let data = Namespace.create(parseScript(testData['classDecl']));
        let size = 1;
        expect(data.containsName('HelloWorld')).true
        expect(data.getAllNames().length).to.be.equal(size)
    });


})

describe('namespace variable renaming', () => {


    it('singleVDecl', () => {
        let data = Namespace.create(parseScript(testData['singleVDecl']));
        expect(data.generateBestName('x').name).equal('x0', data.generateBestName('x').name)
    });


    it('singleDeconsDecl', () => {
        let data = Namespace.create(parseScript(testData['singleDeconsDecl']));
        expect(data.generateBestName('a').name).equal('a0')
    });


    it('multiDeconsDecl', () => {
        let data = Namespace.create(parseScript(testData['multiDeconsDecl']));
        expect(data.generateBestName('a').name).equal('a0')
        expect(data.generateBestName('b').name).equal('b0')
        expect(data.generateBestName('c').name).equal('c0')
    });


    it('moduleExports', () => {
        let data = Namespace.create(parseScript(testData['moduleExports']));
        expect(data.generateBestName('a').name).equal('a')
        expect(data.generateBestName('exports').name).equal('exports')
        expect(data.generateBestName('hello').name).equal('hello')
    });


    it('funcDecl', () => {
        let data = Namespace.create(parseScript(testData['funcDecl']));
        expect(data.generateBestName('a').name).equal('a0')
        expect(data.generateBestName('b').name).equal('b0')
        expect(data.generateBestName('x').name).equal('x0')
    });


    it('classDecl', () => {
        let data = Namespace.create(parseScript(testData['classDecl']));
        expect(data.generateBestName('HelloWorld').name).equal('HelloWorld0')

    });

})
