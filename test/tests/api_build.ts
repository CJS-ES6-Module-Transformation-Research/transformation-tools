import {assert} from "chai";
import {join} from "path";
import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {getDeclaredModuleImports, reqPropertyInfoGather} from "../../src/InfoGatherer";
import {API_TYPE} from "../../src/transformations/export_transformations/API";
import {__exports} from "../../src/transformations/export_transformations/ExportPass";
import {accessReplace} from "../../src/transformations/sanitizing/visitors";
import {createProject, FIXTURES} from "../index";

function MANY(js: JSFile) {
	throw new Error('IMPLEMENT THE API_BUILD TESTS THING ')
}

describe('api_build', () => {

	it('check_none_on_create', () => {
		const project = createProject(join(FIXTURES, 'api_build/check_none_on_create'), false)
		let actualJS: JSFile = project.getJS('main.js');

		project.forEachSource(getDeclaredModuleImports)
		project.forEachSource(reqPropertyInfoGather)
		let _type = actualJS.getApi().getType()
		assert(_type === API_TYPE.none);

	});
	it('check_some_forced_default_after_info_gather', () => {
		const project = createProject(join(FIXTURES, 'api_build/check_some_forced_default_after_info_gather'), false)
		let actualJS: JSFile = project.getJS('main.js');
		project.forEachSource(getDeclaredModuleImports)
		project.forEachSource(reqPropertyInfoGather)
		let _type = actualJS
			.getAPIMap()
			.resolveSpecifier(actualJS, 'fs')
			.getType()
		assert(_type === API_TYPE.default_only)
	});
	it('check_expected_after_exports', () => {
		const project = createProject(join(FIXTURES, 'api_build/check_expected_after_exports'), false)
		let main: JSFile = project.getJS('main.js');
		let m1: JSFile = project.getJS('mod.js');
		let m2: JSFile = project.getJS('mod2.js');
		project.forEachSource(getDeclaredModuleImports)
		project.forEachSource(reqPropertyInfoGather)
		project.forEachSource(accessReplace)
		project.forEachSource(__exports)
		assert(m1.getApi().getType() === API_TYPE.named_only)
		assert(m2.getApi().getType() === API_TYPE.default_only)
		assert(main.getApi().getType() === API_TYPE.none)

	});
	it('check_forced_default_cannot_change', () => {
		const project = createProject(join(FIXTURES, 'api_build/check_forced_default_cannot_change'), false)
		let actualJS: JSFile = project.getJS('mod.js');
		project.forEachSource(getDeclaredModuleImports)
		project.forEachSource(reqPropertyInfoGather)
		assert(actualJS.getApi().getType() === API_TYPE.default_only)
		actualJS.getApi().setType(API_TYPE.named_only)
 		assert.equal(actualJS.getApi().getType(), API_TYPE.default_only)
	});
	it('none_not_default', () => {
		const project = createProject(join(FIXTURES, 'api_build/none_not_default'), false)
		let actualJS: JSFile = project.getJS('mod.js');
		project.forEachSource(getDeclaredModuleImports)
		project.forEachSource(reqPropertyInfoGather)
		project.forEachSource(accessReplace)
		project.forEachSource(__exports)
		assert.equal(actualJS.getApi().getType(), API_TYPE.none)
	});
});