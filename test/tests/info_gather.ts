import {expect} from "chai";
import {join} from "path";
import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {getDeclaredModuleImports, reqPropertyInfoGather} from "../../src/InfoGatherer";
import {createProject, TEST_DIR} from "../index";


function MANY(js: JSFile) {
	getDeclaredModuleImports(js)
	reqPropertyInfoGather(js)
}

describe('info_gather', () => {

	it('shadow_single', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/shadow_single'), false)
		let actualJS: JSFile = project.getJS('shadow_single.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('shadow_single.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   shadow_single');
	});
	it('nested_shadow', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/nested_shadow'), false)
		let actualJS: JSFile = project.getJS('nested_shadow.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('nested_shadow.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   nested_shadow');
	});
	it('rpi_info_general', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/rpi_info_general'), false)
		let actualJS: JSFile = project.getJS('rpi_info_general.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('rpi_info_general.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   rpi_info_general');
	});
	it('forced_decl_from_orEquals', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/forced_decl_from_orEquals'), false)
		let actualJS: JSFile = project.getJS('forced_decl_from_orEquals.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('forced_decl_from_orEquals.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   forced_decl_from_orEquals');
	});
	it('forced_decl_from_prop_lhs_assign', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/forced_decl_from_prop_lhs_assign'), false)
		let actualJS: JSFile = project.getJS('forced_decl_from_prop_lhs_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('forced_decl_from_prop_lhs_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   forced_decl_from_prop_lhs_assign');
	});
	it('potential_prim_rhs_decl', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/potential_prim_rhs_decl'), false)
		let actualJS: JSFile = project.getJS('potential_prim_rhs_decl.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('potential_prim_rhs_decl.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   potential_prim_rhs_decl');
	});
	it('potential_prim_rhs_assign', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/potential_prim_rhs_assign'), false)
		let actualJS: JSFile = project.getJS('potential_prim_rhs_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('potential_prim_rhs_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   potential_prim_rhs_assign');
	});
	it('potential_prim_add_expr', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/potential_prim_add_expr'), false)
		let actualJS: JSFile = project.getJS('potential_prim_add_expr.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('potential_prim_add_expr.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   potential_prim_add_expr');
	});
	it('potential_prim_many', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/potential_prim_many'), false)
		let actualJS: JSFile = project.getJS('potential_prim_many.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('potential_prim_many.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   potential_prim_many');
	});
	it('call_or_access_prop_rhs_assign', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/call_or_access_prop_rhs_assign'), false)
		let actualJS: JSFile = project.getJS('call_or_access_prop_rhs_assign.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('call_or_access_prop_rhs_assign.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   call_or_access_prop_rhs_assign');
	});
	it('call_or_access_prop_invoke', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/call_or_access_prop_invoke'), false)
		let actualJS: JSFile = project.getJS('call_or_access_prop_invoke.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('call_or_access_prop_invoke.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   call_or_access_prop_invoke');
	});
	it('call_or_access_prop_new_expr', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/call_or_access_prop_new_expr'), false)
		let actualJS: JSFile = project.getJS('call_or_access_prop_new_expr.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('call_or_access_prop_new_expr.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   call_or_access_prop_new_expr');
	});
	it('call_or_access_prop_new_many', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/call_or_access_prop_new_many'), false)
		let actualJS: JSFile = project.getJS('call_or_access_prop_new_many.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('call_or_access_prop_new_many.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   call_or_access_prop_new_many');
	});
	it('all_props_mix', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/all_props_mix'), false)
		let actualJS: JSFile = project.getJS('all_props_mix.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('all_props_mix.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   all_props_mix');
	});
	it('prim_ref_mix', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather/prim_ref_mix'), false)
		let actualJS: JSFile = project.getJS('prim_ref_mix.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('prim_ref_mix.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   prim_ref_mix');
	});
	it('', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather'), false)
		let actualJS: JSFile = project.getJS('.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ');
	});
	it('', () => {
		const project = createProject(join(TEST_DIR, 'test_data/info_gather'), false)
		let actualJS: JSFile = project.getJS('.actual.js');
		MANY(actualJS)
		let prjS = project.getJS('.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ');
	});
});