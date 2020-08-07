// test_resources.import {describe, it} from "mocha";
import {expect} from 'chai'
import {generate} from "escodegen";
import {parseModule, parseScript} from "esprima";
import {AssignmentProperty, FunctionDeclaration, Identifier, ObjectPattern, Property, RestElement} from "estree";
import {ExportBuilder, exportNaming, ExportTypes} from '../../src/transformations/export_transformations/ExportsBuilder'

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


// @ts-ignore
describe('ExportBuilder Testing Without Code', () => {
	// @ts-ignore
	it('no exports', () => {
		builder.build();
		built = builder.getBuilt();
		expect(built.default_exports).to.be.null;
		expect(built.named_exports).to.be.null;
	});
// @ts-ignore
	it('one named', () => {
		let a: Identifier = {type: "Identifier", name: "one named"}
		builder.registerName(createExNames('hello'),);
		builder.build();
		built = builder.getBuilt();

		expect(built.default_exports.type).to.be.eq("ExportDefaultDeclaration")
		expect(built.default_exports.declaration.type).to.be.eq("ObjectExpression")


		let gen = generate(built.default_exports.declaration)
		expect(gen).to.equal("{ hello }")

		expect(built.named_exports.specifiers[0].local.name).to.be.equal("hello")
		expect(built.named_exports.specifiers[0].exported.name).to.be.equal("hello")

	});
// @ts-ignore
	it('one named with alias', () => {
		builder = new ExportBuilder()
		builder.registerName(createExNames('hello', 'hello1'));//, {type: "Identifier", name: "one named"}
		builder.build();
		built = builder.getBuilt();


		expect(generate(built.named_exports)).to.be.equal(makeExpected('test_resources.export {hello1 as hello}'))
		expect(generate(built.default_exports)).to.be.equal(makeExpected('test_resources.export default {hello:hello1 }'))


	});
	// @ts-ignore
	it('one namedwith one alias, one regular', () => {
		builder = new ExportBuilder()
		// builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
		// builder.registerName(createExNames('propname0'), id('2named'));
		builder.registerName(createExNames('propname1'));
		builder.registerName(createExNames('propname0'));
		builder.build();
		built = builder.getBuilt();
		let defaultExport = built.default_exports
		expect(generate(built.default_exports)).to.be.equal((makeExpected('test_resources.export default {propname1:alias1, propname0}')))


	});
// @ts-ignore
	it('one namedaliasMix', () => {
		builder = new ExportBuilder()
		// builder.registerName(createExNames('propname1', 'alias1'), id("one named"));
		// builder.registerName(createExNames('propname0'), id('2named'));
		// builder.registerName(createExNames('propname2'), id('3named'));
		builder.registerName(createExNames('propname1', 'alias1'));
		builder.registerName(createExNames('propname0'));
		builder.registerName(createExNames('propname2'));
		builder.build();
		built = builder.getBuilt();
		expect(generate(built.default_exports)).to.be.equal(makeExpected('test_resources.export default {propname1:alias1, propname0, propname2}', 0))

		expect(generate(built.named_exports)).to.be.equal(makeExpected(`export { alias1 as propname1  , propname0, propname2}`))

	});
// @ts-ignore
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

		builder.build();
		built = builder.getBuilt();

		expect(generate(built.default_exports)).to.be.deep.equal((makeExpected(`export default defaultExport`)))

		expect(generate(built.named_exports)).to.be.deep.equal((makeExpected(`export {alias1 as propname1}`)))
	});
// @ts-ignore
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
		builder.registerName(createExNames('propname1', 'alias1'));
		builder.registerDefault(id('defaultExport'))

		builder.build();
		built = builder.getBuilt();
		expect(generate(built.default_exports)).to.be.equal(makeExpected(`export default defaultExport`))
		expect(generate(built.named_exports)).to.be.equal(makeExpected(`export {   alias1 as propname1}`))
	});
// @ts-ignore
	it('one default', () => {
		builder.build();
		built = builder.getBuilt();
	});
// @ts-ignore
	it('one default with alias', () => {
		builder.build();
		built = builder.getBuilt();
	});
// @ts-ignore
	it('one defaultwith one alias, one regular', () => {
		builder.build();
		built = builder.getBuilt();
	});
// @ts-ignore
	it('one defaultaliasMix', () => {
		builder.build();
		built = builder.getBuilt();
	});
// @ts-ignore
	it('one defaultanon default', () => {
		builder.build();
		built = builder.getBuilt();
	});
// @ts-ignore
	it('one defaultanondefaultAndNamedDefault', () => {
		builder.build();
		built = builder.getBuilt();
	});
// @ts-ignore
	it('one of each', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('one of each with alias', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('one of eachwith one alias, one regular', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('one of eachaliasMix', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
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
		builder.registerName(createExNames('propname1', 'alias1'));
		builder.registerDefault(id('defaultExport'))

		builder.build();
		built = builder.getBuilt();
		expect(generate(built.default_exports)).to.be.equal(makeExpected(`export default  defaultExport`))

		expect(generate(built.named_exports)).to.be.equal(makeExpected(`export {alias1 as propname1  }`))
	});
// @ts-ignore
	it('one of eachanondefaultAndNamedDefault', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two named', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two named with alias', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two namedwith one alias, one regular', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two namedaliasMix', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two namedanon default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two namedanondefaultAndNamedDefault', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('three named', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('three named with alias', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('three namedwith one alias, one regular', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('three namedaliasMix', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('three namedanon default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('three namedanondefaultAndNamedDefault', () => {
		builder.build();
		built = builder.getBuilt();

	});


//builder ordering
	// @ts-ignore
	it('add name add name expect na', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add name add name expect na with alias', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add name add name expect nawith one alias, one regular', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add name add name expect naaliasMix', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add name add name expect naanon default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add name add name expect naanondefaultAndNamedDefault', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add default with two names', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add default with two names with alias', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add default with two nameswith one alias, one regular', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add default with two namesaliasMix', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add default with two namesanon default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('add default with two namesanondefaultAndNamedDefault', () => {
		builder.build();
		built = builder.getBuilt();

	});


	//error
	// @ts-ignore
	it('one named one default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('one named one default with alias', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('one named one defaultwith one alias, one regular', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('one named one defaultaliasMix', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('one named one defaultanon default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('one named one defaultanondefaultAndNamedDefault', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two named one default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two named one default with alias', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two named one defaultwith one alias, one regular', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two named one defaultaliasMix', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two named one defaultanon default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two named one defaultanondefaultAndNamedDefault', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two default with alias', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two defaultwith one alias, one regular', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two defaultaliasMix', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two defaultanon default', () => {
		builder.build();
		built = builder.getBuilt();

	});
// @ts-ignore
	it('two defaultanondefaultAndNamedDefault', () => {
		builder.build();
		built = builder.getBuilt();

	});

});