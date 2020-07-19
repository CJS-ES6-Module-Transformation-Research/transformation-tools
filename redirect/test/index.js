var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.project_test_dirs = exports.project_sanitize_resources_root = exports.test_root = void 0;
exports.test_root = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test`;
exports.project_sanitize_resources_root = `${exports.test_root}/project_sanitize_tests`;
var chai_1 = require("chai");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return chai_1.expect; } });
var mocha_1 = require("mocha");
Object.defineProperty(exports, "it", { enumerable: true, get: function () { return mocha_1.it; } });
Object.defineProperty(exports, "describe", { enumerable: true, get: function () { return mocha_1.describe; } });
__exportStar(require("fs"), exports);
var esprima_1 = require("esprima");
Object.defineProperty(exports, "parseScript", { enumerable: true, get: function () { return esprima_1.parseScript; } });
Object.defineProperty(exports, "parseModule", { enumerable: true, get: function () { return esprima_1.parseModule; } });
var escodegen_1 = require("escodegen");
Object.defineProperty(exports, "generate", { enumerable: true, get: function () { return escodegen_1.generate; } });
const project_test_dirs = {};
exports.project_test_dirs = project_test_dirs;
project_test_dirs['untouched'] = `${exports.project_sanitize_resources_root}/test_proj`;
project_test_dirs['requireString'] = `${exports.project_sanitize_resources_root}/after_requireString_1`;
project_test_dirs['jsonRequireCreate'] = `${exports.project_sanitize_resources_root}/after_jsonRequireCreate_2`;
project_test_dirs['declFlatten'] = `${exports.project_sanitize_resources_root}/after_declFlatten_3`;
project_test_dirs['accessReplace'] = `${exports.project_sanitize_resources_root}/after_accessReplace_4`;
project_test_dirs['module_exports_flatten'] = `${exports.project_sanitize_resources_root}/after_module_exports_flatten_5`;
project_test_dirs['import_main'] = `${exports.project_sanitize_resources_root}/after_import_0`;
