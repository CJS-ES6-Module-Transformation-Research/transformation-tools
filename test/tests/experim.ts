import {expect} from 'chai'
import {readdirSync} from "fs";
import {join} from 'path';
import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {ProjectManager} from "../../src/abstract_fs_v2/ProjectManager";
import {_sanitize} from "../../src/executor";
import {getDeclaredModuleImports, reqPropertyInfoGather} from "../../src/InfoGatherer";
import {createProject, FIXTURES} from "../index";

interface TestsData {
	name: string
	actualFile: string
	expectedFile: string
	actualProjDir: string
	expectedProjDir: string
}

interface BuiltTestData {
	name: string
	actProj: ProjectManager,
	expProj: ProjectManager,
	actualJS: JSFile,
	expectedJS: JSFile
}

function createTestData(name: string, baseDir: string): BuiltTestData {
let _baseDir =join ( baseDir,name)
	let actualProjDir = join(_baseDir, 'actual')
	let expectedProjDir = join(_baseDir, 'expected')
	let actualFile = join(actualProjDir, 'actual.js')
	let expectedFile = join(expectedProjDir, 'expected.js')


	let actProj = createProject(actualProjDir, false)
	let expProj = createProject(expectedProjDir, false)
	let actualJS = actProj.getJS(actualFile)
	let expectedJS = expProj.getJS(expectedFile)
	return {
		name,
		actProj,
		expProj,
		actualJS,
		expectedJS
	}
}

function readInProjs(data: TestsData) {

}


describe('imports and behaviour', () => {
	let tests: BuiltTestData[] = []
	// it('x',()=>{
	// 	expect('left').to.be.eq('right')
	// })
});

function getAllExpTestData(dir_suite: string): BuiltTestData[] {
	let data: BuiltTestData[] = []
	let baseDir = join(FIXTURES, dir_suite)
	readdirSync(baseDir).forEach((name:string)=>{
		data.push(createTestData(name, baseDir))
	});

	return data

}

describe('export building and apis', () => {
	let tests: BuiltTestData[] = getAllExpTestData('dyn_exp')
	tests.forEach(function (test) {
		it(test.name, function () {
			_sanitize(test.actProj)
			test.actProj.forEachSource(reqPropertyInfoGather)
			test.actProj.forEachSource(reqPropertyInfoGather)

			test.actProj.getJSNames()
				.forEach(e => {

						let actualJS = 	e.getRelative()
console.error (actualJS)
						let actual = test.actProj.getJS(actualJS).makeSerializable()
						let expected = test.expProj.getJS(actualJS).makeSerializable()
						expect(actual).to.be.eq(expected)

				})
 		});
	});
});