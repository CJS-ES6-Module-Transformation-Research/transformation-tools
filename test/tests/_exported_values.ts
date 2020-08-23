import {expect} from "chai";
import {join} from "path";
import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {getDeclaredModuleImports, reqPropertyInfoGather} from "../../src/InfoGatherer";
import {__exports} from "../../src/transformations/export_transformations/ExportPass";
import { execute } from "../../src/executor";
import {createProject, FIXTURES} from "../index";

function MANY(js: JSFile) {
	getDeclaredModuleImports(js)
	reqPropertyInfoGather(js)
	__exports(js)
}


describe('_exported_values', () => {

	it('default_natural', () => {
		const project = createProject(join(FIXTURES, '_exported_values/default_natural'), false)
		let actualJS: JSFile = project.getJS('default_natural.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('default_natural.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   default_natural');
	});

	it('named_exports', () => {
		const project = createProject(join(FIXTURES, '_exported_values/named_exports'), false)
		let actualJS: JSFile = project.getJS('named_exports.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('named_exports.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   named_exports');
	});
	it('module_exports_export', () => {
		const project = createProject(join(FIXTURES, '_exported_values/module_exports_export'), false)
		let actualJS: JSFile = project.getJS('module_exports_export.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('module_exports_export.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   module_exports_export');
	});
	it('_exports_export', () => {
		const project = createProject(join(FIXTURES, '_exported_values/_exports_export'), false)
		let actualJS: JSFile = project.getJS('_exports_export.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('_exports_export.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   _exports_export');
	});
	it('obj_direct_assign', () => {
		const project = createProject(join(FIXTURES, '_exported_values/obj_direct_assign'), false)
		let actualJS: JSFile = project.getJS('obj_direct_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('obj_direct_assign.expected.js')
		let actual = actualJS.makeSerializable().fileData
		let expected = prjS.makeSerializable().fileData
		// throw new Error(`${actual}\n\n${expected}`)
		expect(expected).to.be.equal(actual , 'error in   obj_direct_assign');
	});
	it('func_direct_assign', () => {
		const project = createProject(join(FIXTURES, '_exported_values/func_direct_assign'), false)
		let actualJS: JSFile = project.getJS('func_direct_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('func_direct_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   func_direct_assign');
	});
	it('class_direct_assign', () => {
		const project = createProject(join(FIXTURES, '_exported_values/class_direct_assign'), false)
		let actualJS: JSFile = project.getJS('class_direct_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('class_direct_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   class_direct_assign');
	});
	it('identifier_direct_assign', () => {
		const project = createProject(join(FIXTURES, '_exported_values/identifier_direct_assign'), false)
		let actualJS: JSFile = project.getJS('identifier_direct_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('identifier_direct_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   identifier_direct_assign');
	});
	it('m_exports_prop_reassign', () => {
		const project = createProject(join(FIXTURES, '_exported_values/m_exports_prop_reassign'), false)
		let actualJS: JSFile = project.getJS('m_exports_prop_reassign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('m_exports_prop_reassign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   m_exports_prop_reassign');
	});
	it('reassign direct obj assignment', () => {
		const project = createProject(join(FIXTURES, '_exported_values/reassign_direct_obj_assignment'), false)
		let actualJS: JSFile = project.getJS('reassign_direct_obj_assignment.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('reassign_direct_obj_assignment.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   reassign_direct_obj_assignment');
	});
	it('reassign direct obj assignment_forced_default', () => {
		const project = createProject(join(FIXTURES, '_exported_values/reassign_direct_obj_assignment_fd'), false)
		let actualJS: JSFile = project.getJS('reassign_direct_obj_assignment_fd.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('reassign_direct_obj_assignment_fd.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   reassign_direct_obj_assignment_fd ');
	});
// it('', ()=>{
// 	const project =  createProject(join(FIXTURES,'_exported_values'), false)
// 	let actualJS: JSFile = project.getJS(  '.actual.js');
// 	MANY(actualJS)
// 	let prjS = project.getJS('.expected.js')
//
// 	let expected = prjS.makeSerializable().fileData
// 	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ');
// });
// it('', ()=>{
// 	const project =  createProject(join(FIXTURES,'_exported_values'), false)
// 	let actualJS: JSFile = project.getJS(  '.actual.js');
// 	MANY(actualJS)
// 	let prjS = project.getJS('.expected.js')
//
// 	let expected = prjS.makeSerializable().fileData
// 	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ');
// });
});