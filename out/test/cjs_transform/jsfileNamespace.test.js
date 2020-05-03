Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var fs_1 = require("fs");
var index_1 = require("../index");
var esprima_1 = require("esprima");
var Namespace_1 = require("../src/abstract_representation/project_representation/javascript/Namespace");
var testDir = index_1.test_root + "/res/namespace_test_files";
var testData = {};
testData['singleVDecl'] = fs_1.readFileSync(testDir + "/singleVDecl.js").toString();
testData['multiVDecl'] = fs_1.readFileSync(testDir + "/multiVDecl.js").toString();
testData['singleDeconsDecl'] = fs_1.readFileSync(testDir + "/singleDeconsDecl.js").toString();
testData['multiDeconsDecl'] = fs_1.readFileSync(testDir + "/multiDeconsDecl.js").toString();
testData['moduleExports'] = fs_1.readFileSync(testDir + "/moduleExports.js").toString();
testData['funcDecl'] = fs_1.readFileSync(testDir + "/funcDecl.js").toString();
testData['classDecl'] = fs_1.readFileSync(testDir + "/classDecl.js").toString();
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
describe('basic namespace traversal tests', function () {
    mocha_1.it('singleVDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['singleVDecl']));
        var size = 1;
        chai_1.expect(data.containsName('x')).equal(true);
        chai_1.expect(data.getAllNames().length).to.be.equal(size);
    });
    mocha_1.it('singleDeconsDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['singleDeconsDecl']));
        var size = 1;
        chai_1.expect(data.containsName('a')).true;
        chai_1.expect(data.getAllNames().length).to.be.equal(size);
    });
    mocha_1.it('multiDeconsDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['multiDeconsDecl']));
        var size = 3;
        chai_1.expect(data.containsName('a')).true;
        chai_1.expect(data.containsName('b')).true;
        chai_1.expect(data.containsName('c')).true;
        chai_1.expect(data.getAllNames().length).to.be.equal(size);
    });
    mocha_1.it('moduleExports', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['moduleExports']));
        var size = 1;
        chai_1.expect(data.containsName('module')).true;
        chai_1.expect(data.getAllNames().length).to.be.equal(size);
    });
    mocha_1.it('funcDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['funcDecl']));
        var size = 3;
        chai_1.expect(data.containsName('x'), 'x').true;
        chai_1.expect(data.containsName('a'), 'a').true;
        chai_1.expect(data.containsName('b'), 'b').true;
        chai_1.expect(data.getAllNames().length).to.be.equal(size);
    });
    mocha_1.it('classDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['classDecl']));
        var size = 1;
        chai_1.expect(data.containsName('HelloWorld')).true;
        chai_1.expect(data.getAllNames().length).to.be.equal(size);
    });
});
describe('namespace variable renaming', function () {
    mocha_1.it('singleVDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['singleVDecl']));
        chai_1.expect(data.generateBestName('x').name).equal('x0', data.generateBestName('x').name);
    });
    mocha_1.it('singleDeconsDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['singleDeconsDecl']));
        chai_1.expect(data.generateBestName('a').name).equal('a0');
    });
    mocha_1.it('multiDeconsDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['multiDeconsDecl']));
        chai_1.expect(data.generateBestName('a').name).equal('a0');
        chai_1.expect(data.generateBestName('b').name).equal('b0');
        chai_1.expect(data.generateBestName('c').name).equal('c0');
    });
    mocha_1.it('moduleExports', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['moduleExports']));
        chai_1.expect(data.generateBestName('a').name).equal('a');
        chai_1.expect(data.generateBestName('exports').name).equal('exports');
        chai_1.expect(data.generateBestName('hello').name).equal('hello');
    });
    mocha_1.it('funcDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['funcDecl']));
        chai_1.expect(data.generateBestName('a').name).equal('a0');
        chai_1.expect(data.generateBestName('b').name).equal('b0');
        chai_1.expect(data.generateBestName('x').name).equal('x0');
    });
    mocha_1.it('classDecl', function () {
        var data = Namespace_1.Namespace.create(esprima_1.parseScript(testData['classDecl']));
        chai_1.expect(data.generateBestName('HelloWorld').name).equal('HelloWorld0');
    });
});
