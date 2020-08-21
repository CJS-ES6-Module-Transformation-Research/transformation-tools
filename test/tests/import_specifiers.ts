import {expect} from "chai";
import {join} from "path";
import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {getDeclaredModuleImports, reqPropertyInfoGather} from "../../src/InfoGatherer";
import {__exports} from "../../src/transformations/export_transformations/ExportPass";
import {insertImports} from "../../src/transformations/import_transformations/visitors/insert_imports";
import {createProject, TEST_DIR} from "../index";

function MANY(js: JSFile) {
	getDeclaredModuleImports(js)
	reqPropertyInfoGather(js)
	__exports(js)
	insertImports(js)
}

describe('import_specifiers', () => {

	it('single_named_import_specifier__named', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/single_named_import_specifier__named'), true)
		let actualJS: JSFile = project.getJS('single_named_import_specifier__named.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('single_named_import_specifier__named.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   single_named_import_specifier__named');
	});
	it('single_named_import_specifier__default', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/single_named_import_specifier__default'), false)
		let actualJS: JSFile = project.getJS('single_named_import_specifier__default.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('single_named_import_specifier__default.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   single_named_import_specifier__default');
	});
	it('single_default_specifier__named', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/single_default_specifier__named'), true)
		let actualJS: JSFile = project.getJS('single_default_specifier__named.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('single_default_specifier__named.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   single_default_specifier__named');
	});
	it('single_default_specifier__default', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/single_default_specifier__default'), false)
		let actualJS: JSFile = project.getJS('single_default_specifier__default.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('single_default_specifier__default.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   single_default_specifier__default');
	});
	it('single_named__named', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/single_named__named'), true)
		let actualJS: JSFile = project.getJS('single_named__named.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('single_named__named.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   single_named__named');
	});
	it('single_named__default', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/single_named__default'), false)
		let actualJS: JSFile = project.getJS('single_named__default.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('single_named__default.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   single_named__default');
	});
	it('one_default_one_named__named', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/one_default_one_named__named'), true)
		let actualJS: JSFile = project.getJS('one_default_one_named__named.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('one_default_one_named__named.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   one_default_one_named__named');
	});
	it('one_default_one_namespace__default', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/one_default_one_namespace__default'), false)
		let actualJS: JSFile = project.getJS('one_default_one_namespace__default.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('one_default_one_namespace__default.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   one_default_one_namespace__default');
	});
	it('named_without_local_alias__named', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/named_without_local_alias__named'), true)
		let actualJS: JSFile = project.getJS('named_without_local_alias__named.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('named_without_local_alias__named.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   named_without_local_alias__named');
	});
	it('named_with_local_alias', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/named_with_local_alias'), false)
		let actualJS: JSFile = project.getJS('named_with_local_alias.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('named_with_local_alias.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   named_with_local_alias');
	});
	it('default_with_copy__named', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/default_with_copy__named'), true)
		let actualJS: JSFile = project.getJS('default_with_copy__named.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('default_with_copy__named.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   default_with_copy__named');
	});
	it('default_with_copy__default', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/default_with_copy__default'), false)
		let actualJS: JSFile = project.getJS('default_with_copy__default.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('default_with_copy__default.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   default_with_copy__default');
	});
	it('named_with_copy__named', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/named_with_copy__named'), true)
		let actualJS: JSFile = project.getJS('named_with_copy__named.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('named_with_copy__named.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   named_with_copy__named');
	});
	it('namespace_with_copy__default', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/namespace_with_copy__default'), false)
		let actualJS: JSFile = project.getJS('namespace_with_copy__default.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('namespace_with_copy__default.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   namespace_with_copy__default');
	});
	it('multi_name_one_copied__named', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/multi_name_one_copied__named'), true)
		let actualJS: JSFile = project.getJS('multi_name_one_copied__named.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('multi_name_one_copied__named.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   multi_name_one_copied__named');
	});
	it('side_effect_import__default', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/side_effect_import__default'), false)
		let actualJS: JSFile = project.getJS('side_effect_import__default.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('side_effect_import__default.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   side_effect_import__default');
	});
	it('side_effect_import__named', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers/side_effect_import__named'), true)
		let actualJS: JSFile = project.getJS('side_effect_import__named.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('side_effect_import__named.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   side_effect_import__named');
	});
	it('', () => {
		const project = createProject(join(TEST_DIR, 'test_data/import_specifiers'), false)
		let actualJS: JSFile = project.getJS('.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ');
	});
});