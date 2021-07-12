import {ProjectManager, ProjectManagerI} from "../control/ProjectManager";
import {getDeclaredModuleImports, reqPropertyInfoGather} from "../refactoring/utility/InfoGatherer";
import {__exports} from "../refactoring/export-phases/ExportPass";
import {hacker_defaults} from "../refactoring/import-phases/copyPassByValue";
import {insertImports} from "../refactoring/import-phases/insert_imports";
//require strings x2
import {accessReplace, flattenDecls, requireStringSanitizer} from "../transformations/sanitizing/visitors";

// import {deconsFlatten} from "./transformations/saniti/zing/visitors/patternFlatten";


export function execute(projectManager: ProjectManager) {
	// todo rewrite for the fwk

	_sanitize(projectManager)


	//dirname?

//declare undeclared requires, use InfoTracker to minimize additions
	projectManager.forEachSource(reqPropertyInfoGather, "Property Access Info Gather")
	// projectManager.forEachSource(__fd_2x, "Info Gather part 2 ")
	projectManager.forEachSource(__exports, "Export Transformation and module.exports removal")
//
	projectManager.forEachSource(insertImports, "Import transform");
	// if (projectManager.usingNamed()) {
	// 	projectManager.forEachSource(named_copyByValue, "Import 'hacks'")
	// }else {
	projectManager.forEachSource(hacker_defaults, "Import 'hacks'");
	//  }


	(function toModule(projectManager: ProjectManagerI) {
		projectManager.forEachSource(js => {
			js.setAsModule()
		}, 'set module flag')
		projectManager.forEachPackage(pkg => pkg.makeModule())
	})(projectManager);
}


export function _sanitize(projectManager: ProjectManagerI) {

	projectManager.forEachSource(requireStringSanitizer, "string sanitize")
	// projectManager.forEachSource(jsonRequire, "JSON require sanitize")

	// projectManager.forEachSource(deconsFlatten, 'dc flt')
	// todo rewrite for the fwk
	projectManager.forEachSource(flattenDecls, "Declaration Flattener")
	// projectManager.forEachSource(obj_decons,"ObjectDecons ")
	projectManager.forEachSource(getDeclaredModuleImports, "Require Info Gather")

	// projectManager.forEachSource(add__dirname, '__dirname case')


	projectManager.forEachSource(accessReplace, "Require Access Replace")
}

export default execute
