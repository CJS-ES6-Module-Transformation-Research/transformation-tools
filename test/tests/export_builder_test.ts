import {ExportBuilder, ExportTypes, exportNaming} from '../../src/transformations/export_transformations/ExportsBuilder'
// import {describe, it} from "mocha";
import {expect} from 'chai'
import {
    AssignmentProperty, BlockStatement, Declaration, Directive, EmptyStatement, Expression, FunctionDeclaration,
    FunctionExpression, Identifier,
    ModuleDeclaration,
    ObjectPattern,
    Property,
    RestElement, Statement,
    VariableDeclaration
} from "estree";
import exp from "constants";
import {generate} from "escodegen";
import {parseModule, parseScript} from "esprima";

let protoObjPt = function (props: Property[]): ObjectPattern {
    return {type: "ObjectPattern", properties: props as (AssignmentProperty | RestElement)[]}
}

function PROP(ident: string, ident2: string): Property {
    return {
        type: "Property"
        , key: {type: "Identifier", name: ident}
        , kind: "init",
        value: {type: "Identifier", name: ident2},
        method: false,
        shorthand: false,
        computed: false
    }
}

function makeExpected(code: string, index: number = 0): string {
    return generate(parseModule(code).body[index])
}

function createExNames(name: string, alias: string = name): exportNaming {
    return {exported_name: name, local_alias: alias}
}

function id(idString: string): Identifier {
    return {type: "Identifier", name: idString}
}

let builder = new ExportBuilder();
let built: ExportTypes;//:ModuleDeclaration[] = []

describe('ExportBuilder Testing Without Code', () => {
    it('no exports', () => {
        built = builder.build()
        expect(built.default_exports).to.be.null;
        expect(built.named_exports).to.be.null;
    });

    it('one named', () => {
        let a:Identifier  = {type: "Identifier", name: "one named"}
        builder.registerName(createExNames('hello'), );
        built = builder.build()

        expect(built.default_exports.type).to.be.eq("ExportDefaultDeclaration")
        expect(built.default_exports.declaration.type).to.be.eq("ObjectExpression")


        let gen = generate(built.default_exports.declaration)
        expect(gen).to.equal("{ hello }")

        expect(built.named_exports.specifiers[0].local.name).to.be.equal("hello")
        expect(built.named_exports.specifiers[0].exported.name).to.be.equal("hello")

    });

    it('one named with alias', () => {
        builder = new ExportBuilder()
        builder.registerName(createExNames('hello', 'hello1'));//, {type: "Identifier", name: "one named"}
        built = builder.build()


        expect(generate(built.named_exports)).to.be.equal(makeExpected('export {hello1 as hello}'))
        expect(generate(built.default_exports)).to.be.equal(makeExpected('export default {hello:hello1 }'))


    });
    it('one namedwith one alias, one regular', () => {
        builder = new ExportBuilder()
        // builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        // builder.registerName(createExNames('propname0'), id('2named'));
        builder.registerName(createExNames('propname1' )) ;
        builder.registerName(createExNames('propname0') );
        built = builder.build()
        let defaultExport = built.default_exports
        expect(generate(built.default_exports)).to.be.equal((makeExpected('export default {propname1:alias1, propname0}')))


    });

    it('one namedaliasMix', () => {
        builder = new ExportBuilder()
        // builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        // builder.registerName(createExNames('propname0'), id('2named'));
        // builder.registerName(createExNames('propname2'), id('3named'));
        builder.registerName(createExNames('propname1', 'alias1')  );
        builder.registerName(createExNames('propname0'));
        builder.registerName(createExNames('propname2'));
        built = builder.build()
        expect(generate(built.default_exports)).to.be.equal(makeExpected('export default {propname1:alias1, propname0, propname2}', 0))

        expect(generate(built.named_exports)).to.be.equal(makeExpected(`export { alias1 as propname1  , propname0, propname2}`))

    });

    it('one namedanon default', () => {
        builder = new ExportBuilder()
        let bodyStmt = parseScript('let x =function(){}').body[0];
        // let init =
        // let         from = ini=t as
        let anonFunc: FunctionDeclaration = {
            params: [],
            async: false,
            generator: false,
            id: null,
            body: {body: [], type: "BlockStatement"},
            type: "FunctionDeclaration"
        }

        // builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        builder.registerName(createExNames('propname1', 'alias1'));
        builder.registerDefault(id('defaultExport'))

        built = builder.build()

        expect(generate(built.default_exports)).to.be.deep.equal((makeExpected(`export default defaultExport`)))

        expect(generate(built.named_exports)).to.be.deep.equal((makeExpected(`export {alias1 as propname1}`)))
    });

    it('one namedanondefaultAndNamedDefault', () => {
        builder = new ExportBuilder()
        let bodyStmt = parseScript('let x =function(){}').body[0];
        // let init =
        // let         from = ini=t as
        let anonFunc: FunctionDeclaration = {
            params: [],
            async: false,
            generator: false,
            id: null,
            body: {body: [], type: "BlockStatement"},
            type: "FunctionDeclaration"
        }

        // builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        builder.registerName(createExNames('propname1', 'alias1') );
        builder.registerDefault(id('defaultExport'))

        built = builder.build()
        expect(generate(built.default_exports)).to.be.equal(makeExpected(`export default defaultExport`))
        expect(generate(built.named_exports)).to.be.equal(makeExpected(`export {   alias1 as propname1}`))
    });

    it('one default', () => {
        built = builder.build()
    });

    it('one default with alias', () => {
        built = builder.build()
    });

    it('one defaultwith one alias, one regular', () => {
        built = builder.build()
    });

    it('one defaultaliasMix', () => {
        built = builder.build()
    });

    it('one defaultanon default', () => {
        built = builder.build()
    });

    it('one defaultanondefaultAndNamedDefault', () => {
        built = builder.build()
    });

    it('one of each', () => {
        built = builder.build()

    });

    it('one of each with alias', () => {
        built = builder.build()

    });

    it('one of eachwith one alias, one regular', () => {
        built = builder.build()

    });

    it('one of eachaliasMix', () => {
        built = builder.build()

    });

    it('one of eachanon default', () => {
        builder = new ExportBuilder()

        let anonFunc: FunctionDeclaration = {
            params: [],
            async: false,
            generator: false,
            id: null,
            body: {body: [], type: "BlockStatement"},
            type: "FunctionDeclaration"
        }

        // builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
        builder.registerName(createExNames('propname1', 'alias1') );
        builder.registerDefault(id('defaultExport'))

        built = builder.build()
        expect(generate(built.default_exports)).to.be.equal(makeExpected(`export default  defaultExport`))

        expect(generate(built.named_exports)).to.be.equal(makeExpected(`export {alias1 as propname1  }`))
    });

    it('one of eachanondefaultAndNamedDefault', () => {
        built = builder.build()

    });

    it('two named', () => {
        built = builder.build()

    });

    it('two named with alias', () => {
        built = builder.build()

    });

    it('two namedwith one alias, one regular', () => {
        built = builder.build()

    });

    it('two namedaliasMix', () => {
        built = builder.build()

    });

    it('two namedanon default', () => {
        built = builder.build()

    });

    it('two namedanondefaultAndNamedDefault', () => {
        built = builder.build()

    });

    it('three named', () => {
        built = builder.build()

    });

    it('three named with alias', () => {
        built = builder.build()

    });

    it('three namedwith one alias, one regular', () => {
        built = builder.build()

    });

    it('three namedaliasMix', () => {
        built = builder.build()

    });

    it('three namedanon default', () => {
        built = builder.build()

    });

    it('three namedanondefaultAndNamedDefault', () => {
        built = builder.build()

    });


//builder ordering
    it('add name add name expect na', () => {
        built = builder.build()

    });

    it('add name add name expect na with alias', () => {
        built = builder.build()

    });

    it('add name add name expect nawith one alias, one regular', () => {
        built = builder.build()

    });

    it('add name add name expect naaliasMix', () => {
        built = builder.build()

    });

    it('add name add name expect naanon default', () => {
        built = builder.build()

    });

    it('add name add name expect naanondefaultAndNamedDefault', () => {
        built = builder.build()

    });

    it('add default with two names', () => {
        built = builder.build()

    });

    it('add default with two names with alias', () => {
        built = builder.build()

    });

    it('add default with two nameswith one alias, one regular', () => {
        built = builder.build()

    });

    it('add default with two namesaliasMix', () => {
        built = builder.build()

    });

    it('add default with two namesanon default', () => {
        built = builder.build()

    });

    it('add default with two namesanondefaultAndNamedDefault', () => {
        built = builder.build()

    });


    //error
    it('one named one default', () => {
        built = builder.build()

    });

    it('one named one default with alias', () => {
        built = builder.build()

    });

    it('one named one defaultwith one alias, one regular', () => {
        built = builder.build()

    });

    it('one named one defaultaliasMix', () => {
        built = builder.build()

    });

    it('one named one defaultanon default', () => {
        built = builder.build()

    });

    it('one named one defaultanondefaultAndNamedDefault', () => {
        built = builder.build()

    });

    it('two named one default', () => {
        built = builder.build()

    });

    it('two named one default with alias', () => {
        built = builder.build()

    });

    it('two named one defaultwith one alias, one regular', () => {
        built = builder.build()

    });

    it('two named one defaultaliasMix', () => {
        built = builder.build()

    });

    it('two named one defaultanon default', () => {
        built = builder.build()

    });

    it('two named one defaultanondefaultAndNamedDefault', () => {
        built = builder.build()

    });

    it('two default', () => {
        built = builder.build()

    });

    it('two default with alias', () => {
        built = builder.build()

    });

    it('two defaultwith one alias, one regular', () => {
        built = builder.build()

    });

    it('two defaultaliasMix', () => {
        built = builder.build()

    });

    it('two defaultanon default', () => {
        built = builder.build()

    });

    it('two defaultanondefaultAndNamedDefault', () => {
        built = builder.build()

    });

});