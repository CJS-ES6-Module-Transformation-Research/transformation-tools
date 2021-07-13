import {expect} from "chai";
import {generate} from "escodegen";
import {join} from "path";
import {JSFile} from "../../src/filesystem/JSFile";
import {getDeclaredModuleImports, getListOfVars, reqPropertyInfoGather} from "../../src/refactoring/utility/InfoGatherer";
import {API_TYPE} from "../../src/refactoring/utility/API";
import {__exports} from "../../src/refactoring/export-phases/ExportPass";
import {hacker_defaults} from "../../src/refactoring/import-phases/copyPassByValue";
import {insertImports} from "../../src/refactoring/import-phases/insert_imports";
import {createProject, FIXTURES} from "../index";





	function execute(project) {
		project.forEachSource(getDeclaredModuleImports)
		project.forEachSource(reqPropertyInfoGather)
		project.forEachSource(__exports)
		project.forEachSource(js => {
			js.setAsModule()
		}, 'set module flag')
		project.forEachPackage(pkg => pkg.makeModule())
		project.forEachSource(insertImports)
		project.forEachSource(hacker_defaults)
	}


	describe('import_specifiers', () => {

		it('single_default_specifier__named', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/single_default_specifier__named'), true)
			let actualJS: JSFile = project.getJS('single_default_specifier__named.actual.js');
			execute(project)
			let prjS = project.getJS('single_default_specifier__named.expected.js')
			expect(actualJS.usesNamed()).to.be.eq(true)
			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   single_default_specifier__named');
		});
		it('single_default_specifier__default', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/single_default_specifier__default'), false)
			let actualJS: JSFile = project.getJS('single_default_specifier__default.actual.js');
			execute(project)
			let prjS = project.getJS('single_default_specifier__default.expected.js')

			expect(actualJS.usesNamed()).to.be.eq(false)
			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   single_default_specifier__default');
		});

		it('one_default_one_named__named', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/one_default_one_named__named'), true)
			let actualJS: JSFile = project.getJS('one_default_one_named__named.actual.js');
			execute(project)
			let prjS = project.getJS('one_default_one_named__named.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   one_default_one_named__named');
		});
		it('one_default_one_namespace__default', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/one_default_one_namespace__default'), false)
			let actualJS: JSFile = project.getJS('one_default_one_namespace__default.actual.js');
			execute(project)
			let prjS = project.getJS('one_default_one_namespace__default.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   one_default_one_namespace__default');
		});
		it('named_without_local_alias__named', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/named_without_local_alias__named'), true)
			let actualJS: JSFile = project.getJS('named_without_local_alias__named.actual.js');
			execute(project)
			let prjS = project.getJS('named_without_local_alias__named.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   named_without_local_alias__named');
		});
		it('named_with_local_alias', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/named_with_local_alias'), true)
			let actualJS: JSFile = project.getJS('named_with_local_alias.actual.js');
			execute(project)
			let prjS = project.getJS('named_with_local_alias.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   named_with_local_alias');
		});

		it('default_with_copy', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/default_with_copy'),
				false)
			let actualJS: JSFile = project.getJS('default_with_copy.actual.js');
			execute(project)
			let prjS = project.getJS('default_with_copy.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   default_with_copy');
		});

		it('namespace_with_copy__default', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/namespace_with_copy__default'), false)
			let actualJS: JSFile = project.getJS('namespace_with_copy__default.actual.js');
			execute(project)
			let prjS = project.getJS('namespace_with_copy__default.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   namespace_with_copy__default');
		});
		it('multi_name_one_copied__named', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/multi_name_one_copied__named'), true)
			let actualJS: JSFile = project.getJS('multi_name_one_copied__named.actual.js');
			execute(project)
			let prjS = project.getJS('multi_name_one_copied__named.expected.js')
			let actual = actualJS.makeSerializable().fileData
			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actual, `error in   multi_name_one_copied__named `);
		});
		it('side_effect_import', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/side_effect_import'), false)
			let actualJS: JSFile = project.getJS('side_effect_import.actual.js');
			execute(project)
			let prjS = project.getJS('side_effect_import.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   side_effect_import__default');
		});
		it('forced_default_or_eq', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/forced_default_or_eq'), false)
			let actualJS: JSFile = project.getJS('forced_default_or_eq.actual.js');
			execute(project)
			let prjS = project.getJS('forced_default_or_eq.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   forced_default_or_eq');
		});
		it('forced_default_reassign_builtin', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/forced_default_reassign_builtin'), false)
			let actualJS: JSFile = project.getJS('forced_default_reassign_builtin.actual.js');
			execute(project)
			let prjS = project.getJS('forced_default_reassign_builtin.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   forced_default_reassign_builtin');
		});
		it('forced_default_reassign_local', () => {
			const project = createProject(join(FIXTURES, 'import_specifiers/forced_default_reassign_local'), false)
			let actualJS: JSFile = project.getJS('forced_default_reassign_local.actual.js');
			execute(project)

			let prjS = project.getJS('forced_default_reassign_local.expected.js')

			let expected = prjS.makeSerializable().fileData
			expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   forced_default_reassign_local');
		});
		// it('side_effect_import__named', () => {
		// 	const project = createProject(join(FIXTURES, 'import_specifiers/side_effect_import__named'), true)
		// 	let actualJS: JSFile = project.getJS('side_effect_import__named.actual.js');
		// 	execute(project)
		// 	let prjS = project.getJS('side_effect_import__named.expected.js')
		//
		// 	let expected = prjS.makeSerializable().fileData
		// 	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   side_effect_import__named');
		// });
		// it('', () => {
		// 	const project = createProject(join(FIXTURES, 'import_specifiers'), false)
		// 	let actualJS: JSFile = project.getJS('.actual.js');
		// 	execute(project)
		// 	let prjS = project.getJS('.expected.js')
		//
		// 	let expected = prjS.makeSerializable().fileData
		// 	expect(expected).to.be.equal(actualJS.makeSerializable().fileData, 'error in   ');
		// });
	});

// function execute(projectManager: ProjectManager) {
// 	// todo rewrite for the fwk
//
// 	_sanitize(projectManager)
//
//
// 	//dirname?
//
// //declare undeclared requires, use InfoTracker to minimize additions
// 	projectManager.forEachSource(reqPropertyInfoGather, "Property Access Info Gather")
// 	// projectManager.forEachSource(__fd_2x, "Info Gather part 2 ")
// 	projectManager.forEachSource(__exports, "Export Transformation and module.exports removal")
// //
// 	toModule(projectManager);
// 	projectManager.forEachSource(insertImports, "Import transform");
// 	projectManager.forEachSource(hacker_defaults, "Import 'hacks'")
//
// 	// projectManager.writeOut()
// 	function toModule(projectManager: ProjectManager) {
// 		projectManager.forEachSource(js => {
// 			js.setAsModule()
// 		}, 'set module flag')
// 		projectManager.forEachPackage(pkg => pkg.makeModule())
// 	}
// }
//
//
// function _sanitize(projectManager: ProjectManager) {
//
// 	projectManager.forEachSource(requireStringSanitizer, "string sanitize")
// 	projectManager.forEachSource(jsonRequire, "JSON require sanitize")
//
// 	projectManager.forEachSource(deconsFlatten ,'dc flt')
// 	// todo rewrite for the fwk
// 	projectManager.forEachSource(flattenDecls, "Declaration Flattener")
//
// 	projectManager.forEachSource(getDeclaredModuleImports, "Require Info Gather")
//
// 	// projectManager.forEachSource(add__dirname, '__dirname case')
//
//
// 	projectManager.forEachSource(accessReplace, "Require Access Replace")
// }
