import {expect} from "chai";
import {JSFile} from "../../src/filesystem/JSFile";
import {requireStringSanitizer} from "../../src/transformations/sanitizing/visitors";
import {createProject, FIXTURES} from "../index";

describe('json_require', () => {

	it('parallel_json_require', () => {
		const project = createProject(FIXTURES+'/json_require/parallel_json_require', false)
		let actualJS: JSFile = project.getJS('parallel_json_require.actual.js');
		requireStringSanitizer(actualJS)
		let prjS = project.getJS('parallel_json_require.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   parallel_json_require');
	});


	it('up_one_json_require', () => {
		const project = createProject( FIXTURES+'/json_require/up_one_json_require', false)
		let actualJS: JSFile = project.getJS('down/up_one_json_require.actual.js');
		requireStringSanitizer(actualJS)
		let prjS = project.getJS('down/up_one_json_require.expected.js')
		let cjs = project.getAnAddition('package.json.cjs')
		expect(cjs).not.to.be.null
		expect(cjs.getRelative()).to.be.equal('package.json.cjs')
		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   up_one_json_require');
	});


	it('down_one_json_require', () => {
		const project = createProject(FIXTURES+'/json_require/down_one_json_require', false)
		let actualJS: JSFile = project.getJS('down_one_json_require.actual.js');
		requireStringSanitizer(actualJS)
		let prjS = project.getJS('down_one_json_require.expected.js')
		let cjs = project.getAnAddition('down/x.json.cjs')
		expect(cjs).not.to.be.null
		expect(cjs.getRelative()).to.be.equal('down/x.json.cjs')
		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   down_one_json_require');
	});


	it('multi_json_require_same_mid', () => {
		const project = createProject(FIXTURES+'/json_require/multi_json_require_same_mid', false)
		let actualJS: JSFile = project.getJS('multi_json_require_same_mid.actual.js');
		requireStringSanitizer(actualJS)
		let prjS = project.getJS('multi_json_require_same_mid.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   multi_json_require_same_mid');
	});


	it('js_has_priority', () => {
		const project = createProject(FIXTURES+'/json_require/js_has_priority', false)
		let actualJS: JSFile = project.getJS('js_has_priority.actual.js');
		requireStringSanitizer(actualJS)
		let prjS = project.getJS('js_has_priority.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   js_has_priority');
	});
});