import {project} from '../index'
import {ProjConstructionOpts} from "../src/abstract_fs_v2/ProjectManager.js";

export const test_root = `${project}`
export const project_sanitize_resources_root = `${test_root}/project_sanitize_tests`


export const mock_opts: ProjConstructionOpts = {
	write_status: "in-place",
	target_dir: "",
	suffix: "",
	isModule: false,
	copy_node_modules: false
}
export const mod_mock: ProjConstructionOpts = {
	write_status: "in-place",
	target_dir: "",
	suffix: "",
	isModule: true,
	copy_node_modules: false
}

const project_test_dirs: { [key: string]: string } = {};
project_test_dirs.untouched = `${project_sanitize_resources_root}/test_proj`;
project_test_dirs.requireString = `${project_sanitize_resources_root}/after_requireString_1`;
project_test_dirs.jsonRequireCreate = `${project_sanitize_resources_root}/after_jsonRequireCreate_2`;
project_test_dirs.declFlatten = `${project_sanitize_resources_root}/after_declFlatten_3`;
project_test_dirs.accessReplace = `${project_sanitize_resources_root}/after_accessReplace_4`;
project_test_dirs.module_exports_flatten = `${project_sanitize_resources_root}/after_module_exports_flatten_5`;
project_test_dirs.import_main = `${project_sanitize_resources_root}/after_import_0`;

export {project_test_dirs}