
import {expect} from 'chai';
import 'mocha';
import {join} from "path";
import {clean} from "../src/janitor/janitor";
import {createProject} from "../test";



let test_data = join(process.env.CJS, 'test_data');
let test_root = join(test_data, 'cleaning/equality');
describe('cleaning-exports', () => {
    it('module.exports-mix', () => {
        let test_path = join(test_root, 'cleaning-exports', 'module.exports-mix');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('module.exports-no-shorthand', () => {
        let test_path = join(test_root, 'cleaning-exports', 'module.exports-no-shorthand');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('module.exports-shorthand', () => {
        let test_path = join(test_root, 'cleaning-exports', 'module.exports-shorthand');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
});
describe('cleaning-requires', () => {
    it('deconstrImport_single', () => {
        let test_path = join(test_root, 'cleaning-requires', 'deconstrImport_single');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('deconstrImport_x2_with_alias', () => {
        let test_path = join(test_root, 'cleaning-requires', 'deconstrImport_x2_with_alias');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('exports-mix-to-module.exports', () => {
        let test_path = join(test_root, 'cleaning-requires', 'exports-mix-to-module.exports');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('hoistChildFunc', () => {
        let test_path = join(test_root, 'cleaning-requires', 'hoistChildFunc');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('hoistChildIf', () => {
        let test_path = join(test_root, 'cleaning-requires', 'hoistChildIf');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('hoistExpression', () => {
        let test_path = join(test_root, 'cleaning-requires', 'hoistExpression');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('hoistSameIDx2', () => {
        let test_path = join(test_root, 'cleaning-requires', 'hoistSameIDx2');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('propAccessImport', () => {
        let test_path = join(test_root, 'cleaning-requires', 'propAccessImport');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
    it('resolveDot', () => {
        let test_path = join(test_root, 'cleaning-requires', 'resolveDot');
        let actual = createProject(join(test_path, 'actual'), true);
        let expected = createProject(join(test_path, 'expected'), true);
        clean(actual);
        let relatives = actual.getJSRelativeStrings();
        relatives.forEach(file => {
            expect(actual.getJS(file).makeSerializable().fileData, 'test file: ${test_path} ').to.be.eq(expected.getJS(file).makeSerializable().fileData);
        });
    });
});