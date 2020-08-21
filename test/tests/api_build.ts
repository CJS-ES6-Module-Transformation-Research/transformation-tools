

import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {createProject} from "../index";
import {TEST_DIR} from "../index";
import {join} from "path";
import { expect } from "chai";

function MANY(js:JSFile){throw new Error('IMPLEMENT THE API_BUILD TESTS THING ')}
describe('api_build', ()=>{

it('check_none_on_create', ()=>{ 
	const project =  createProject(join(TEST_DIR,'test_data/api_build/check_none_on_create'), false) 
	let actualJS: JSFile = project.getJS(  'check_none_on_create.actual.js');
	MANY(actualJS)
	let prjS = project.getJS('check_none_on_create.expected.js')

	let expected = prjS.makeSerializable().fileData
	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   check_none_on_create');
});
it('check_some_forced_default_after_info_gather', ()=>{ 
	const project =  createProject(join(TEST_DIR,'test_data/api_build/check_some_forced_default_after_info_gather'), false) 
	let actualJS: JSFile = project.getJS(  'check_some_forced_default_after_info_gather.actual.js');
	MANY(actualJS)
	let prjS = project.getJS('check_some_forced_default_after_info_gather.expected.js')

	let expected = prjS.makeSerializable().fileData
	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   check_some_forced_default_after_info_gather');
});
it('check_expected_after_exports', ()=>{ 
	const project =  createProject(join(TEST_DIR,'test_data/api_build/check_expected_after_exports'), false) 
	let actualJS: JSFile = project.getJS(  'check_expected_after_exports.actual.js');
	MANY(actualJS)
	let prjS = project.getJS('check_expected_after_exports.expected.js')

	let expected = prjS.makeSerializable().fileData
	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   check_expected_after_exports');
});
it('check_forced_default_cannot_change', ()=>{ 
	const project =  createProject(join(TEST_DIR,'test_data/api_build/check_forced_default_cannot_change'), false) 
	let actualJS: JSFile = project.getJS(  'check_forced_default_cannot_change.actual.js');
	MANY(actualJS)
	let prjS = project.getJS('check_forced_default_cannot_change.expected.js')

	let expected = prjS.makeSerializable().fileData
	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   check_forced_default_cannot_change');
});
it('none_not_default', ()=>{ 
	const project =  createProject(join(TEST_DIR,'test_data/api_build/none_not_default'), false) 
	let actualJS: JSFile = project.getJS(  'none_not_default.actual.js');
	MANY(actualJS)
	let prjS = project.getJS('none_not_default.expected.js')

	let expected = prjS.makeSerializable().fileData
	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   none_not_default');
});
	});