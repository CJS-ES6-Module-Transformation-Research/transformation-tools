

import {expect} from 'chai';
import 'mocha';
import {join} from "path";
import {clean} from "../src/refactoring";
import {createProject} from "../test";




let test_data = join(process.env.CJS , 'test_data' )
let test_root =join (test_data, 'cleaning/equality')


describe('direct_assign', () => {
    it('object_direct_assign_to_ME_mixed', () => {
        let test_path = join(test_root, 'direct_assign', 'object_direct_assign_to_ME_mixed');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('object_direct_assign_to_ME_mixed_WithSubsequentDefinitions', () => {
        let test_path = join(test_root, 'direct_assign', 'object_direct_assign_to_ME_mixed_WithSubsequentDefinitions');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('object_direct_assign_to_ME_one_noShortcut', () => {
        let test_path = join(test_root, 'direct_assign', 'object_direct_assign_to_ME_one_noShortcut');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('object_direct_assign_to_ME_one_noShortcut_WithSubsequentDefinitions', () => {
        let test_path = join(test_root, 'direct_assign', 'object_direct_assign_to_ME_one_noShortcut_WithSubsequentDefinitions');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('object_direct_assign_to_ME_one_of_each', () => {
        let test_path = join(test_root, 'direct_assign', 'object_direct_assign_to_ME_one_of_each');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('object_direct_assign_to_ME_one_of_each_WithSubsequentDefinitions', () => {
        let test_path = join(test_root, 'direct_assign', 'object_direct_assign_to_ME_one_of_each_WithSubsequentDefinitions');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('object_direct_assign_to_ME_one_shortcut', () => {
        let test_path = join(test_root, 'direct_assign', 'object_direct_assign_to_ME_one_shortcut');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('object_direct_assign_to_ME_one_shortcut_WithSubsequentDefinitions', () => {
        let test_path = join(test_root, 'direct_assign', 'object_direct_assign_to_ME_one_shortcut_WithSubsequentDefinitions');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('object_direct_assign_to_delete', () => {
        let test_path = join(test_root, 'direct_assign', 'object_direct_assign_to_delete');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('overWrite_default_no_props', () => {
        let test_path = join(test_root, 'direct_assign', 'overWrite_default_no_props');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('overWrite_default_with_1_one_prop', () => {
        let test_path = join(test_root, 'direct_assign', 'overWrite_default_with_1_one_prop');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('overWrite_default_with_2_two_props', () => {
        let test_path = join(test_root, 'direct_assign', 'overWrite_default_with_2_two_props');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('overWrite_default_with_3_props', () => {
        let test_path = join(test_root, 'direct_assign', 'overWrite_default_with_3_props');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
});
describe('export_names', () => {
    it('default_export_with_property', () => {
        let test_path = join(test_root, 'export_names', 'default_export_with_property');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('reassignmentOf_default_export', () => {
        let test_path = join(test_root, 'export_names', 'reassignmentOf_default_export');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('reassignmentOf_default_export_with_names', () => {
        let test_path = join(test_root, 'export_names', 'reassignmentOf_default_export_with_names');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('reassignmentOf_namedExport_', () => {
        let test_path = join(test_root, 'export_names', 'reassignmentOf_namedExport_');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('reassignmentOf_namedExport_using_Exports', () => {
        let test_path = join(test_root, 'export_names', 'reassignmentOf_namedExport_using_Exports');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('singe_default_export', () => {
        let test_path = join(test_root, 'export_names', 'singe_default_export');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('single_namedExport', () => {
        let test_path = join(test_root, 'export_names', 'single_namedExport');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('single_namedExport_using_Exports', () => {
        let test_path = join(test_root, 'export_names', 'single_namedExport_using_Exports');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
});
describe('replace_require', () => {
    it('call_expressionOn_require', () => {
        let test_path = join(test_root, 'replace_require', 'call_expressionOn_require');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('call_expression_parameter', () => {
        let test_path = join(test_root, 'replace_require', 'call_expression_parameter');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('inside_for_loop', () => {
        let test_path = join(test_root, 'replace_require', 'inside_for_loop');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('member_expression_on_nested_decl', () => {
        let test_path = join(test_root, 'replace_require', 'member_expression_on_nested_decl');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('member_expression_on_top-level_decl', () => {
        let test_path = join(test_root, 'replace_require', 'member_expression_on_top-level_decl');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('nested_requireDecl', () => {
        let test_path = join(test_root, 'replace_require', 'nested_requireDecl');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
});
describe('require_call', () => {
    it('json_require_just_add_ext', () => {
        let test_path = join(test_root, 'require_call', 'json_require_just_add_ext');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('mixed_requires_all_resolve', () => {
        let test_path = join(test_root, 'require_call', 'mixed_requires_all_resolve');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('requireDecl_fs_module', () => {
        let test_path = join(test_root, 'require_call', 'requireDecl_fs_module');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('requireDecl_installed_module', () => {
        let test_path = join(test_root, 'require_call', 'requireDecl_installed_module');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('requireDotDotSlash_resolves', () => {
        let test_path = join(test_root, 'require_call', 'requireDotDotSlash_resolves');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('requireDotSlash_resolves', () => {
        let test_path = join(test_root, 'require_call', 'requireDotSlash_resolves');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('requireDot_resolves_', () => {
        let test_path = join(test_root, 'require_call', 'requireDot_resolves_');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('requireDotdot_resolves', () => {
        let test_path = join(test_root, 'require_call', 'requireDotdot_resolves');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
});
describe('require_decons', () => {
    it('decons_many_mixed', () => {
        let test_path = join(test_root, 'require_decons', 'decons_many_mixed');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('decons_one_no-shortcut', () => {
        let test_path = join(test_root, 'require_decons', 'decons_one_no-shortcut');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('decons_one_of_each', () => {
        let test_path = join(test_root, 'require_decons', 'decons_one_of_each');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('decons_one_shortcut', () => {
        let test_path = join(test_root, 'require_decons', 'decons_one_shortcut');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
});
