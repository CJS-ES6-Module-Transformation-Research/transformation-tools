import {ProjectManager} from "./abstract_fs_v2/ProjectManager";
import {getDeclaredModuleImports, reqPropertyInfoGather} from "./InfoGatherer";
import {__exports} from "./transformations/export_transformations/ExportPass";
import {hacker_defaults, named_copyByValue} from "./transformations/import_transformations/visitors/copyPassByValue";
import {insertImports} from "./transformations/import_transformations/visitors/insert_imports";
//require strings x2
import {accessReplace, flattenDecls , requireStringSanitizer} from "./transformations/sanitizing/visitors";
import {add__dirname} from "./transformations/sanitizing/visitors/__dirname";
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





	(function toModule(projectManager: ProjectManager) {
		projectManager.forEachSource(js => {
			js.setAsModule()
		}, 'set module flag')
		projectManager.forEachPackage(pkg => pkg.makeModule())
	})(projectManager);
}


export function _sanitize(projectManager: ProjectManager) {

	projectManager.forEachSource(requireStringSanitizer, "string sanitize")
	// projectManager.forEachSource(jsonRequire, "JSON require sanitize")

	// projectManager.forEachSource(deconsFlatten, 'dc flt')
	// todo rewrite for the fwk
	projectManager.forEachSource(flattenDecls, "Declaration Flattener")

	projectManager.forEachSource(getDeclaredModuleImports, "Require Info Gather")

	// projectManager.forEachSource(add__dirname, '__dirname case')


	projectManager.forEachSource(accessReplace, "Require Access Replace")
}

export default execute
