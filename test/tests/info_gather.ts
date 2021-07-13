import {assert, expect} from "chai";
import {join} from "path";
import {JSFile} from "../../src/filesystem/JSFile";
import {ProjectManager} from "../../src/control/ProjectManager";
import {getDeclaredModuleImports, reqPropertyInfoGather, ReqPropInfo} from "../../src/refactoring/utility/InfoGatherer";
import {InfoTracker} from "../../src/refactoring/utility/InfoTracker";
import {API_TYPE} from "../../src/refactoring/utility/API";
import {createProject, FIXTURES} from "../index";


function MANY(js: JSFile) {
	getDeclaredModuleImports(js)
	reqPropertyInfoGather(js)
}

describe('info_gather', () => {
	// let project: ProjectManager
	// let js: JSFile
	interface _Info {
		js: JSFile,
		project: ProjectManager,
		info: InfoTracker,
		rpi: ReqPropInfo
	}

	function runInfoGather(name: string): _Info {
		let project = createProject(join(FIXTURES, `info_gather/${name}`), false)
		let js = project.getJS(`${name}.actual.js`);
		assert(js, 'js ')
		MANY(js)
		let info = js.getInfoTracker()
		assert(info, 'info ')
		let x = []
		project.forEachSource(e => x.push(e.getRelative()))
		let rpi: ReqPropInfo = info.getRPI('x')
		assert(rpi, 'rpi: ' + `${name}.actual.js  ${x

		}`)
		return {js, project, info, rpi}
	}

	it('nested_shadow', () => {
		let {js, project, info, rpi} = runInfoGather('nested_shadow')
		expect(rpi.potentialPrimProps.length).to.be.eq(1)
		expect(rpi.potentialPrimProps[0]).to.be.eq('z')
	});
	it('rpi_info_general', () => {
		let {js, project, info, rpi} = runInfoGather('rpi_info_general')
		expect(rpi.potentialPrimProps.length).to.be.eq(1)
		expect(rpi.potentialPrimProps[0]).to.be.eq('y')
		expect(rpi.refTypeProps.length).to.be.eq(1)
		expect(rpi.refTypeProps[0]).to.be.eq('z')
		expect(rpi.allAccessedProps.length).to.be.eq(2)
		expect(rpi.allAccessedProps).to.contains('z')
		expect(rpi.allAccessedProps).to.contains('y')

	});
	it('forced_decl_from_orEquals', () => {
		let {js, project, info, rpi} = runInfoGather('forced_decl_from_orEquals')
		let actual = js.getAPIMap().resolveSpecifier(js, 'x').getType()
		expect(actual).to.be.eq(API_TYPE.default_only)


	});
	it('forced_decl_from_prop_lhs_assign', () => {
		let {js, project, info, rpi} = runInfoGather('forced_decl_from_prop_lhs_assign')
		let actual = js.getAPIMap().resolveSpecifier(js, 'x').getType()
		expect(actual).to.be.eq(API_TYPE.default_only)
	});

	it('potential_prim_rhs_assign', () => {

		let {js, project, info, rpi} = runInfoGather('potential_prim_rhs_assign')
		expect(rpi.allAccessedProps).to.contains('y', rpi.allAccessedProps.toString())
		expect(rpi.potentialPrimProps).to.contains('y', rpi.potentialPrimProps.toString())
		expect(rpi.allAccessedProps).to.contains('z', rpi.allAccessedProps.toString())
		expect(rpi.potentialPrimProps).to.contains('z', rpi.potentialPrimProps.toString())
		expect(rpi.potentialPrimProps.length).to.eq(2, rpi.potentialPrimProps.toString())
		expect(rpi.allAccessedProps.length).to.eq(2, rpi.allAccessedProps.toString())
	});
	it('potential_prim_add_expr', () => {

		let {js, project, info, rpi} = runInfoGather('potential_prim_add_expr')
		expect(rpi.allAccessedProps).to.contains('y')
		expect(rpi.potentialPrimProps).to.contains('y')
		expect(rpi.allAccessedProps).to.contains('z')
		expect(rpi.potentialPrimProps).to.contains('z')
		expect(rpi.potentialPrimProps.length).to.eq(2)
		expect(rpi.allAccessedProps.length).to.eq(2)


	});
	it('potential_prim_many', () => {
		let {js, project, info, rpi} = runInfoGather('potential_prim_many')
		expect(rpi.allAccessedProps).to.contains('y')
		expect(rpi.potentialPrimProps).to.contains('y')
		expect(rpi.allAccessedProps).to.contains('z')
		expect(rpi.potentialPrimProps).to.contains('z')
		expect(rpi.potentialPrimProps.length).to.eq(2)
		expect(rpi.allAccessedProps.length).to.eq(2)
	});
	it('call_or_access_prop_rhs_assign', () => {
		let {js, project, info, rpi} = runInfoGather('call_or_access_prop_rhs_assign')


		expect(rpi.allAccessedProps).to.contains('y', "msg:  " + (JSON.stringify(rpi, null, 3)) + "")
		expect(rpi.refTypeProps).to.contains('y', "msg:  " + (JSON.stringify(rpi, null, 3)) + "")
		expect(rpi.refTypeProps.length).to.eq(1)
		expect(rpi.allAccessedProps.length).to.eq(1)

	});
	it('call_or_access_prop_invoke', () => {
		let {js, project, info, rpi} = runInfoGather('call_or_access_prop_invoke')
		expect(rpi.allAccessedProps).to.contains('y')
		expect(rpi.potentialPrimProps).to.contains('y')
		expect(rpi.allAccessedProps).to.contains('z')
		expect(rpi.refTypeProps).to.contains('z')
		expect(rpi.potentialPrimProps.length).to.eq(1)
		expect(rpi.refTypeProps.length).to.eq(1)
		expect(rpi.allAccessedProps.length).to.eq(2)
	});
	it('call_or_access_prop_new_expr', () => {
		let {js, project, info, rpi} = runInfoGather('call_or_access_prop_new_expr')

		expect(rpi.refTypeProps).to.contains('y')
		expect(rpi.allAccessedProps).to.contains('y')
		expect(rpi.refTypeProps.length).to.eq(1)
		expect(rpi.allAccessedProps.length).to.eq(1)
	});
	it('call_or_access_prop_new_many', () => {
		let {js, project, info, rpi} = runInfoGather('call_or_access_prop_new_many')
		expect(rpi.potentialPrimProps).to.contains('a')
		expect(rpi.potentialPrimProps.length).to.eq(1, `for primProps:${rpi.potentialPrimProps.toString()}`)
		expect(rpi.refTypeProps).to.contains('z')
		expect(rpi.refTypeProps).to.contains('y')
		expect(rpi.refTypeProps.length).to.eq(2, `for refProps:${rpi.refTypeProps.toString()}`)
		expect(rpi.allAccessedProps).to.contains('z')
		expect(rpi.allAccessedProps).to.contains('a')
		expect(rpi.allAccessedProps).to.contains('y')
		expect(rpi.allAccessedProps.length).to.eq(3, `for allPRops :${rpi.allAccessedProps.toString()}`)
	});
	it('all_props_mix', () => {
		let {js, project, info, rpi} = runInfoGather('all_props_mix')
		expect(rpi.allAccessedProps).to.contains('y', rpi.allAccessedProps.toString())
		expect(rpi.potentialPrimProps).to.contains('y', rpi.potentialPrimProps.toString())
		expect(rpi.allAccessedProps).to.contains('call', rpi.allAccessedProps.toString())
		expect(rpi.refTypeProps).to.contains('call', rpi.refTypeProps.toString())
		expect(rpi.potentialPrimProps.length).to.eq(1, rpi.potentialPrimProps.toString())
		expect(rpi.refTypeProps.length).to.eq(1, rpi.potentialPrimProps.toString())
		expect(rpi.allAccessedProps.length).to.eq(2, rpi.allAccessedProps.toString())
	});


});