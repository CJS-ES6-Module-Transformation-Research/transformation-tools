import {assert, expect} from "chai";
import {join} from "path";
import {JSFile} from "../../src/filesystem/JSFile";
import {getDeclaredModuleImports, reqPropertyInfoGather} from "../../src/refactoring/utility/InfoGatherer";
import {API_TYPE} from "../../src/refactoring/utility/API";
import {__exports} from "../../src/refactoring/export-phases/ExportPass";
import {accessReplace} from "../../src/transformations/sanitizing/visitors";
import {createProject, FIXTURES} from "../index";

//  		const project = createProject(join(FIXTURES, 'api_build/check_forced_default_cannot_change'), false)
// project.forEachSource(getDeclaredModuleImports)
// project.forEachSource(reqPropertyInfoGather)
//
// let actualJS: JSFile = project.getJS('mod.js');
// console.log(actualJS.getAPIMap().apiKey)
// let api = actualJS.getApi()
// // expect(actualJS.getAPIMap().resolveSpecifier(actualJS,'mod.js').getID()).to.be.eq(api.getID() )
// // expect(api.getType()).to.be.eq(API_TYPE.default_only)
// actualJS.getApi().setType(API_TYPE.named_only)
// expect(api.getType()).to.be.eq(API_TYPE.default_only)


// const project = createProject(join(FIXTURES, 'api_build/check_expected_after_exports'), false)
//
// project.forEachSource(getDeclaredModuleImports)
// project.forEachSource(reqPropertyInfoGather)
// project.forEachSource(accessReplace)
// project.forEachSource(__exports)
//
// let main: JSFile = project.getJS('main.js');
// let m1: JSFile = project.getJS('mod.js');
// let m2: JSFile = project.getJS('mod2.js');
// console.log(m1.getApi())
// console.log(m1.getAPIMap().resolveSpecifier(m1,m1.getRelative()))
// console.log(m2.getApi())
// console.log(m2 .getAPIMap().resolveSpecifier(m2,m2.getRelative()))
// expect(m1.getApi().getType()).to.be.eq(API_TYPE.named_only, ` expected named: forced default was ${m1.getApi().isForced()}`)
// expect(m2.getApi().getType()).to.be.eq(API_TYPE.default_only, ` expected default:  forced default was ${m2.getApi().isForced()}`)
// expect(main.getApi().getType()).to.be.eq(API_TYPE.none)

let debug = false;

(function  (debug:boolean ) {
	// let describe = (a,b)=>{} ,it =  (a,b)=>{} ;

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
				.resolveSpecifier(actualJS, 'mod.js')
				.getType()
			expect(_type).to.be.eq(API_TYPE.default_only)
		});
		it('check_expected_after_exports', () => {
			const project = createProject(join(FIXTURES, 'api_build/check_expected_after_exports'), false)

			project.forEachSource(getDeclaredModuleImports)
			project.forEachSource(reqPropertyInfoGather)
			project.forEachSource(accessReplace)
			project.forEachSource(__exports)

			let main: JSFile = project.getJS('main.js');
			let m1: JSFile = project.getJS('mod.js');
			let m2: JSFile = project.getJS('mod2.js');

			expect(m1.getApi().getType()).to.be.eq(API_TYPE.named_only, ` expected named: forced default was ${m1.getApi().isForced()}`)
			expect(m2.getApi().getType()).to.be.eq(API_TYPE.default_only, ` expected default:  forced default was ${m2.getApi().isForced()}`)
			expect(main.getApi().getType()).to.be.eq(API_TYPE.none)
		});
		it('check_forced_default_cannot_change', () => {
			const project = createProject(join(FIXTURES, 'api_build/check_forced_default_cannot_change'), false)
			project.forEachSource(getDeclaredModuleImports)
			project.forEachSource(reqPropertyInfoGather)

			let actualJS: JSFile = project.getJS('mod.js');

			let api = actualJS.getApi()
			expect(actualJS.getAPIMap().resolveSpecifier(actualJS, 'mod.js').getID()).to.be.eq(api.getID())
			// expect(api.getType()).to.be.eq(API_TYPE.default_only)
			actualJS.getApi().setType(API_TYPE.named_only)
			expect(api.getType()).to.be.eq(API_TYPE.default_only)
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
}(debug))
