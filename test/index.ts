import {join} from 'path';
import {project} from '../index'
import {ProjConstructionOpts, ProjectManager} from "../src/control/ProjectManager";

//     __dirname / test /
export const TEST_DIR = join(project, 'test')

export const test_root = `${project}`

//     __dirname / test / project_sanitize_tests
export const project_sanitize_resources_root = `${test_root}/project_sanitize_tests`
export const FIXTURES = join(project, 'fixtures')

export const mock_opts: ProjConstructionOpts = {
	input: "",
	operation_type: "in-place",
	output: "",
	suffix: "",
	isModule: false,
	copy_node_modules: false,
	isNamed: false,
	ignored: [],
	testing: true,
	report: false
}
export function createProject(input: string, isNamed: boolean) {
	return new ProjectManager(input, {
			input,
			isNamed: isNamed,
			operation_type: "in-place",
			output: "",
			suffix: "",
			ignored: [],
			testing: true,
			report: false
		},
		isNamed);
}


// export const mod_mock: ProjConstructionOpts = {
// 	write_status: "in-place",
// 	target_dir: "",
// 	suffix: "",
// 	isModule: true,
// 	copy_node_modules: false
// }

const project_test_dirs: { [key: string]: string } = {};
project_test_dirs.untouched = `${project_sanitize_resources_root}/test_proj`;
project_test_dirs.requireString = `${project_sanitize_resources_root}/after_requireString_1`;
project_test_dirs.jsonRequireCreate = `${project_sanitize_resources_root}/after_jsonRequireCreate_2`;
project_test_dirs.declFlatten = `${project_sanitize_resources_root}/after_declFlatten_3`;
project_test_dirs.accessReplace = `${project_sanitize_resources_root}/after_accessReplace_4`;
project_test_dirs.module_exports_flatten = `${project_sanitize_resources_root}/after_module_exports_flatten_5`;
project_test_dirs.import_main = `${project_sanitize_resources_root}/after_import_0`;

export {project_test_dirs}