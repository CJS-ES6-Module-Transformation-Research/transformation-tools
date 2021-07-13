import {expect} from "chai";
import {join} from "path";
import {JSFile} from "../../src/filesystem/JSFile";
import {add__dirname} from "../../src/refactoring/__dirname";
import {createProject, FIXTURES} from "../index";

describe('__dirname', () => {

	it('filename_only_preexisting_url', () => {
		const project = createProject(join(FIXTURES, '__dirname/filename_only_preexisting_url'), false)
		let actualJS: JSFile = project.getJS('filename_only_preexisting_url.actual.js');
		add__dirname(actualJS)
		let prjS = project.getJS('filename_only_preexisting_url.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected
			.replace('IMPORT_META_URL', 'import.meta.url')).to.be.equal(actualJS.makeSerializable().fileData, 'error in   filename_only_preexisting_url');
	});
	it('filename_only_new_url_require', () => {
		const project = createProject(join(FIXTURES, '__dirname/filename_only_new_url_require'), false)
		let actualJS: JSFile = project.getJS('filename_only_new_url_require.actual.js');
		add__dirname(actualJS)
		let prjS = project.getJS('filename_only_new_url_require.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected.replace('IMPORT_META_URL', 'import.meta.url')).to.be.equal(actualJS.makeSerializable().fileData, 'error in   filename_only_new_url_require');
	});
	it('dirname_only_preexisting_path', () => {
		const project = createProject(join(FIXTURES, '__dirname/dirname_only_preexisting_path'), false)
		let actualJS: JSFile = project.getJS('dirname_only_preexisting_path.actual.js');
		add__dirname(actualJS)
		let prjS = project.getJS('dirname_only_preexisting_path.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected.replace('IMPORT_META_URL', 'import.meta.url')).to.be.equal(actualJS.makeSerializable().fileData, 'error in   dirname_only_preexisting_path');
	});
	it('dirname_only_new_path_require', () => {
		const project = createProject(join(FIXTURES, '__dirname/dirname_only_new_path_require'), false)
		let actualJS: JSFile = project.getJS('dirname_only_new_path_require.actual.js');
		add__dirname(actualJS)
		let prjS = project.getJS('dirname_only_new_path_require.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected.replace('IMPORT_META_URL', 'import.meta.url')).to.be.equal(actualJS.makeSerializable().fileData, 'error in   dirname_only_new_path_require');
	});
	it('both_dirname_filename', () => {
		const project = createProject(join(FIXTURES, '__dirname/both_dirname_filename'), false)
		let actualJS: JSFile = project.getJS('both_dirname_filename.actual.js');
		add__dirname(actualJS)
		let prjS = project.getJS('both_dirname_filename.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected.replace('IMPORT_META_URL', 'import.meta.url')).to.be.equal(actualJS.makeSerializable().fileData, 'error in   both_dirname_filename');
	});
	it('dirname_in_if', () => {
		const project = createProject(join(FIXTURES, '__dirname/dirname_in_if'), false)
		let actualJS: JSFile = project.getJS('dirname_in_if.actual.js');
		add__dirname(actualJS)
		let prjS = project.getJS('dirname_in_if.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected.replace('IMPORT_META_URL', 'import.meta.url')).to.be.equal(actualJS.makeSerializable().fileData, 'error in   dirname_in_if');
	});
	it('dirname_in_callexpr', () => {
		const project = createProject(join(FIXTURES, '__dirname/dirname_in_callexpr'), false)
		let actualJS: JSFile = project.getJS('dirname_in_callexpr.actual.js');
		add__dirname(actualJS)
		let prjS = project.getJS('dirname_in_callexpr.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected.replace('IMPORT_META_URL', 'import.meta.url')).to.be.equal(actualJS.makeSerializable().fileData, 'error in   dirname_in_callexpr');
	});
	it('dirname_in_newexpr', () => {
		const project = createProject(join(FIXTURES, '__dirname/dirname_in_newexpr'), false)
		let actualJS: JSFile = project.getJS('dirname_in_newexpr.actual.js');
		add__dirname(actualJS)
		let prjS = project.getJS('dirname_in_newexpr.expected.js')

		let expected = prjS.makeSerializable().fileData
		expect(expected.replace('IMPORT_META_URL', 'import.meta.url')).to.be.equal(actualJS.makeSerializable().fileData, 'error in   dirname_in_newexpr');
	});

});