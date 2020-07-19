Object.defineProperty(exports, "__esModule", { value: true });
const ExportsBuilder_1 = require("../../src/transformations/export_transformations/ExportsBuilder");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const escodegen_1 = require("escodegen");
const esprima_1 = require("esprima");
let protoObjPt = function (props) {
    return { type: "ObjectPattern", properties: props };
};
function PROP(ident, ident2) {
    return {
        type: "Property",
        key: { type: "Identifier", name: ident },
        kind: "init",
        value: { type: "Identifier", name: ident2 },
        method: false,
        shorthand: false,
        computed: false
    };
}
function makeExpected(code, index = 0) {
    return escodegen_1.generate(esprima_1.parseModule(code).body[index]);
}
function createExNames(name, alias = name) {
    return { name: name, alias: alias };
}
function id(idString) {
    return { type: "Identifier", name: idString };
}
let builder = new ExportsBuilder_1.ExportBuilder();
let built; //:ModuleDeclaration[] = []
mocha_1.describe('ExportBuilder Testing Without Code', () => {
    mocha_1.it('no exports', () => {
        built = builder.build();
        chai_1.expect(built.default_exports).to.be.null;
        chai_1.expect(built.named_exports).to.be.null;
    });
    mocha_1.it('one named', () => {
        builder.registerName(createExNames('hello'), { type: "Identifier", name: "one named" });
        built = builder.build();
        chai_1.expect(built.default_exports.type).to.be.eq("ExportDefaultDeclaration");
        chai_1.expect(built.default_exports.declaration.type).to.be.eq("ObjectExpression");
        let gen = escodegen_1.generate(built.default_exports.declaration);
        chai_1.expect(gen).to.equal("{ hello }");
        chai_1.expect(built.named_exports.specifiers[0].local.name).to.be.equal("hello");
        chai_1.expect(built.named_exports.specifiers[0].exported.name).to.be.equal("hello");
    });
    mocha_1.it('one named with alias', () => {
        builder = new ExportsBuilder_1.ExportBuilder();
        builder.registerName(createExNames('hello', 'hello1'), { type: "Identifier", name: "one named" });
        built = builder.build();
        chai_1.expect(escodegen_1.generate(built.named_exports)).to.be.equal(makeExpected('export {hello1 as hello}'));
        chai_1.expect(escodegen_1.generate(built.default_exports)).to.be.equal(makeExpected('export default {hello:hello1 }'));
    });
    mocha_1.it('one namedwith one alias, one regular', () => {
        builder = new ExportsBuilder_1.ExportBuilder();
        builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        builder.registerName(createExNames('propname0'), id('2named'));
        built = builder.build();
        let defaultExport = built.default_exports;
        chai_1.expect(escodegen_1.generate(built.default_exports)).to.be.equal((makeExpected('export default {propname1:alias1, propname0}')));
    });
    mocha_1.it('one namedaliasMix', () => {
        builder = new ExportsBuilder_1.ExportBuilder();
        builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        builder.registerName(createExNames('propname0'), id('2named'));
        builder.registerName(createExNames('propname2'), id('3named'));
        built = builder.build();
        chai_1.expect(escodegen_1.generate(built.default_exports)).to.be.equal(makeExpected('export default {propname1:alias1, propname0, propname2}', 0));
        chai_1.expect(escodegen_1.generate(built.named_exports)).to.be.equal(makeExpected(`export { alias1 as propname1  , propname0, propname2}`));
    });
    mocha_1.it('one namedanon default', () => {
        builder = new ExportsBuilder_1.ExportBuilder();
        let bodyStmt = esprima_1.parseScript('let x =function(){}').body[0];
        // let init =
        // let         from = ini=t as
        let anonFunc = {
            params: [],
            async: false,
            generator: false,
            id: null,
            body: { body: [], type: "BlockStatement" },
            type: "FunctionDeclaration"
        };
        builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        builder.registerDefault(id('defaultExport'));
        built = builder.build();
        chai_1.expect(escodegen_1.generate(built.default_exports)).to.be.deep.equal((makeExpected(`export default defaultExport`)));
        chai_1.expect(escodegen_1.generate(built.named_exports)).to.be.deep.equal((makeExpected(`export {alias1 as propname1}`)));
    });
    mocha_1.it('one namedanondefaultAndNamedDefault', () => {
        builder = new ExportsBuilder_1.ExportBuilder();
        let bodyStmt = esprima_1.parseScript('let x =function(){}').body[0];
        // let init =
        // let         from = ini=t as
        let anonFunc = {
            params: [],
            async: false,
            generator: false,
            id: null,
            body: { body: [], type: "BlockStatement" },
            type: "FunctionDeclaration"
        };
        builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        builder.registerDefault(id('defaultExport'));
        built = builder.build();
        chai_1.expect(escodegen_1.generate(built.default_exports)).to.be.equal(makeExpected(`export default defaultExport`));
        chai_1.expect(escodegen_1.generate(built.named_exports)).to.be.equal(makeExpected(`export {   alias1 as propname1}`));
    });
    mocha_1.it('one default', () => {
        built = builder.build();
    });
    mocha_1.it('one default with alias', () => {
        built = builder.build();
    });
    mocha_1.it('one defaultwith one alias, one regular', () => {
        built = builder.build();
    });
    mocha_1.it('one defaultaliasMix', () => {
        built = builder.build();
    });
    mocha_1.it('one defaultanon default', () => {
        built = builder.build();
    });
    mocha_1.it('one defaultanondefaultAndNamedDefault', () => {
        built = builder.build();
    });
    mocha_1.it('one of each', () => {
        built = builder.build();
    });
    mocha_1.it('one of each with alias', () => {
        built = builder.build();
    });
    mocha_1.it('one of eachwith one alias, one regular', () => {
        built = builder.build();
    });
    mocha_1.it('one of eachaliasMix', () => {
        built = builder.build();
    });
    mocha_1.it('one of eachanon default', () => {
        builder = new ExportsBuilder_1.ExportBuilder();
        let anonFunc = {
            params: [],
            async: false,
            generator: false,
            id: null,
            body: { body: [], type: "BlockStatement" },
            type: "FunctionDeclaration"
        };
        builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        builder.registerDefault(id('defaultExport'));
        built = builder.build();
        chai_1.expect(escodegen_1.generate(built.default_exports)).to.be.equal(makeExpected(`export default  defaultExport`));
        chai_1.expect(escodegen_1.generate(built.named_exports)).to.be.equal(makeExpected(`export {alias1 as propname1  }`));
    });
    mocha_1.it('one of eachanondefaultAndNamedDefault', () => {
        built = builder.build();
    });
    mocha_1.it('two named', () => {
        built = builder.build();
    });
    mocha_1.it('two named with alias', () => {
        built = builder.build();
    });
    mocha_1.it('two namedwith one alias, one regular', () => {
        built = builder.build();
    });
    mocha_1.it('two namedaliasMix', () => {
        built = builder.build();
    });
    mocha_1.it('two namedanon default', () => {
        built = builder.build();
    });
    mocha_1.it('two namedanondefaultAndNamedDefault', () => {
        built = builder.build();
    });
    mocha_1.it('three named', () => {
        built = builder.build();
    });
    mocha_1.it('three named with alias', () => {
        built = builder.build();
    });
    mocha_1.it('three namedwith one alias, one regular', () => {
        built = builder.build();
    });
    mocha_1.it('three namedaliasMix', () => {
        built = builder.build();
    });
    mocha_1.it('three namedanon default', () => {
        built = builder.build();
    });
    mocha_1.it('three namedanondefaultAndNamedDefault', () => {
        built = builder.build();
    });
    //builder ordering
    mocha_1.it('add name add name expect na', () => {
        built = builder.build();
    });
    mocha_1.it('add name add name expect na with alias', () => {
        built = builder.build();
    });
    mocha_1.it('add name add name expect nawith one alias, one regular', () => {
        built = builder.build();
    });
    mocha_1.it('add name add name expect naaliasMix', () => {
        built = builder.build();
    });
    mocha_1.it('add name add name expect naanon default', () => {
        built = builder.build();
    });
    mocha_1.it('add name add name expect naanondefaultAndNamedDefault', () => {
        built = builder.build();
    });
    mocha_1.it('add default with two names', () => {
        built = builder.build();
    });
    mocha_1.it('add default with two names with alias', () => {
        built = builder.build();
    });
    mocha_1.it('add default with two nameswith one alias, one regular', () => {
        built = builder.build();
    });
    mocha_1.it('add default with two namesaliasMix', () => {
        built = builder.build();
    });
    mocha_1.it('add default with two namesanon default', () => {
        built = builder.build();
    });
    mocha_1.it('add default with two namesanondefaultAndNamedDefault', () => {
        built = builder.build();
    });
    //error
    mocha_1.it('one named one default', () => {
        built = builder.build();
    });
    mocha_1.it('one named one default with alias', () => {
        built = builder.build();
    });
    mocha_1.it('one named one defaultwith one alias, one regular', () => {
        built = builder.build();
    });
    mocha_1.it('one named one defaultaliasMix', () => {
        built = builder.build();
    });
    mocha_1.it('one named one defaultanon default', () => {
        built = builder.build();
    });
    mocha_1.it('one named one defaultanondefaultAndNamedDefault', () => {
        built = builder.build();
    });
    mocha_1.it('two named one default', () => {
        built = builder.build();
    });
    mocha_1.it('two named one default with alias', () => {
        built = builder.build();
    });
    mocha_1.it('two named one defaultwith one alias, one regular', () => {
        built = builder.build();
    });
    mocha_1.it('two named one defaultaliasMix', () => {
        built = builder.build();
    });
    mocha_1.it('two named one defaultanon default', () => {
        built = builder.build();
    });
    mocha_1.it('two named one defaultanondefaultAndNamedDefault', () => {
        built = builder.build();
    });
    mocha_1.it('two default', () => {
        built = builder.build();
    });
    mocha_1.it('two default with alias', () => {
        built = builder.build();
    });
    mocha_1.it('two defaultwith one alias, one regular', () => {
        built = builder.build();
    });
    mocha_1.it('two defaultaliasMix', () => {
        built = builder.build();
    });
    mocha_1.it('two defaultanon default', () => {
        built = builder.build();
    });
    mocha_1.it('two defaultanondefaultAndNamedDefault', () => {
        built = builder.build();
    });
});
