import {expect} from "chai";
import {join} from "path";
import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {getDeclaredModuleImports, reqPropertyInfoGather} from "../../src/InfoGatherer";
import {__exports} from "../../src/transformations/export_transformations/ExportPass";
import {createProject, TEST_DIR} from "../index";

function MANY(js: JSFile) {
	getDeclaredModuleImports(js)
	reqPropertyInfoGather(js)
	__exports(js)
}


describe('_exported_values', () => {

	it('default_natural', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/default_natural'), false)
		let actualJS: JSFile = project.getJS('default_natural.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('default_natural.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   default_natural');
	});
	it('forced_default_or_eq', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/forced_default_or_eq'), false)
		let actualJS: JSFile = project.getJS('forced_default_or_eq.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('forced_default_or_eq.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   forced_default_or_eq');
	});
	it('forced_default_reassign_builtin', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/forced_default_reassign_builtin'), false)
		let actualJS: JSFile = project.getJS('forced_default_reassign_builtin.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('forced_default_reassign_builtin.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   forced_default_reassign_builtin');
	});
	it('forced_default_reassign_local', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/forced_default_reassign_local'), false)
		let actualJS: JSFile = project.getJS('forced_default_reassign_local.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('forced_default_reassign_local.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   forced_default_reassign_local');
	});
	it('named_exports', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/named_exports'), false)
		let actualJS: JSFile = project.getJS('named_exports.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('named_exports.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   named_exports');
	});
	it('module_exports_export', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/module_exports_export'), false)
		let actualJS: JSFile = project.getJS('module_exports_export.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('module_exports_export.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   module_exports_export');
	});
	it('_exports_export', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/_exports_export'), false)
		let actualJS: JSFile = project.getJS('_exports_export.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('_exports_export.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   _exports_export');
	});
	it('obj_direct_assign', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/obj_direct_assign'), false)
		let actualJS: JSFile = project.getJS('obj_direct_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('obj_direct_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   obj_direct_assign');
	});
	it('func_direct_assign', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/func_direct_assign'), false)
		let actualJS: JSFile = project.getJS('func_direct_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('func_direct_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   func_direct_assign');
	});
	it('class_direct_assign', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/class_direct_assign'), false)
		let actualJS: JSFile = project.getJS('class_direct_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('class_direct_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   class_direct_assign');
	});
	it('identifier_direct_assign', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/identifier_direct_assign'), false)
		let actualJS: JSFile = project.getJS('identifier_direct_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('identifier_direct_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   identifier_direct_assign');
	});
	it('m_exports_prop_reassign', () => {
		const project = createProject(join(TEST_DIR, 'test_data/_exported_values/m_exports_prop_reassign'), false)
		let actualJS: JSFile = project.getJS('m_exports_prop_reassign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('m_exports_prop_reassign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   m_exports_prop_reassign');
	});
// it('', ()=>{
// 	const project =  createProject(join(TEST_DIR,'test_data/_exported_values'), false)
// 	let actualJS: JSFile = project.getJS(  '.actual.js');
// 	MANY(actualJS)
// 	let prjS = project.getJS('.expected.js')
//
// 	let expected = prjS.makeSerializable().fileData
// 	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ');
// });
// it('', ()=>{
// 	const project =  createProject(join(TEST_DIR,'test_data/_exported_values'), false)
// 	let actualJS: JSFile = project.getJS(  '.actual.js');
// 	MANY(actualJS)
// 	let prjS = project.getJS('.expected.js')
//
// 	let expected = prjS.makeSerializable().fileData
// 	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ');
// });
});