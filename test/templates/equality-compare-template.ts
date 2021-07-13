// let test, test_root, SUITE, describe, createProject, clean, it, join, expect

import {clean} from "../../src/refactoring/janitor";
import {createProject } from "../index";
import { join } from "path";
import { expect } from "chai";

// @ts-ignore
const   {test_root,SUITE,test} = TO_REPLACE
let $  = () => {

	let test_path = join(test_root, SUITE, test)

	let actual = createProject(join(test_path, 'actual'), true)
	let expected = createProject(join(test_path, 'expected'), true)
	clean(actual)
	let relatives = actual.getJSRelativeStrings()
	relatives.forEach(file => {
		expect(actual.getJS(file).makeSerializable().fileData, `test file: ${test_path}`)
			.to
			.be
			.eq(expected.getJS(file).makeSerializable().fileData)
	})
}




