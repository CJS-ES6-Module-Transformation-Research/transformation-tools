import {join} from 'path';
import {project} from '../index'
import {ProjConstructionOpts, ProjectManager} from "../src/abstract_fs_v2/ProjectManager";

export const TEST_DIR = join(project, 'test')

export const test_root = `${project}`
export const project_sanitize_resources_root = `${test_root}/project_sanitize_tests`
export const FIXTURES= join(project, 'fixtures')

export const mock_opts: ProjConstructionOpts = {
	write_status: "in-place",
	target_dir: "",
	suffix: "",
	isModule: false,
	copy_node_modules: false,
	isNamed: false,
	ignored: [],
	testing: true
}
const namedProjOps: ProjConstructionOpts = {
	isNamed: true,
	write_status: "in-place",
	target_dir: "",
	suffix: "",
	ignored: [],
	testing: true
}
const defaultProjOpts: ProjConstructionOpts = {
	isNamed: false,
	write_status: "in-place",
	target_dir: "",
	suffix: "",
	ignored: [],
	testing: true
}
export function createProject(projPath: string, isNamed: boolean) {
	return new ProjectManager(projPath,  {
		isNamed: isNamed,
		write_status: "in-place",
		target_dir: "",
		suffix: "",
		ignored: [],
		testing: true
	}, isNamed);
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