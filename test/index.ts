export const test_root = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test`
const project_sanitize_resources_root = `${test_root}/project_sanitize_tests`

interface StringToStringMap {
    [key:string]:string
}

const project_test_dirs:StringToStringMap = {};
project_test_dirs['untouched'] = `${project_sanitize_resources_root}/test_proj`;
project_test_dirs['requireString'] = `${project_sanitize_resources_root}/after_requireString_1`;
project_test_dirs['jsonRequireCreate'] = `${project_sanitize_resources_root}/after_jsonRequireCreate_2`;
project_test_dirs['declFlatten'] = `${project_sanitize_resources_root}/after_declFlatten_3`;
project_test_dirs['accessReplace'] = `${project_sanitize_resources_root}/after_accessReplace_4`;
project_test_dirs['module_exports_flatten'] = `${project_sanitize_resources_root}/after_module_exports_flatten_5`;
project_test_dirs['import_main'] = `${project_sanitize_resources_root}/after_import_0`;

export {project_test_dirs}