
import {ProjectManager} from "./abstract_fs_v2/ProjectManager";
import {reqPropertyInfoGather} from "./InfoGatherer";
import {transformBaseExports} from "./transformations/export_transformations/visitors/exportTransformMain";
import {propReadReplace} from "./transformations/export_transformations/visitors/module.exports.replace";
import {hacker_defaults} from "./transformations/import_transformations/visitors/hack";
import {transformImport} from "./transformations/import_transformations/visitors/import_replacement";

//require strings x2
import {
	accessReplace,
	objLiteralFlatten,
	flattenDecls,
	jsonRequire,
	requireStringSanitizer
} from "./transformations/sanitizing/visitors";
import {add__dirname, req_filler} from "./transformations/sanitizing/visitors/__dirname";
import {requireRegistration} from "./transformations/sanitizing/visitors/requireRegistration";

export default function(projectManager:ProjectManager){
	projectManager.forEachSource(requireStringSanitizer)
	projectManager.forEachSource(jsonRequire)

//location of require call to varaible declarations
	projectManager.forEachSource(flattenDecls)

//get all requires already declared
	projectManager.forEachSource(requireRegistration)

//declare undeclared requires, use InfoTracker to minimize additions
	projectManager.forEachSource(accessReplace)


//__dirname
	projectManager.forEachSource(add__dirname)

//push all requires back to ast
	projectManager.forEachSource(req_filler)

//exports test_resources.sanitize, flatten object literal assignment
projectManager.forEachSource(objLiteralFlatten)


// init the list of properties accessed, and definitely not primitives
// for each require

	projectManager.forEachSource(reqPropertyInfoGather)

	projectManager.forEachSource(transformBaseExports)
	projectManager.forEachSource(propReadReplace)


	projectManager.forEachSource(js => {
		js.setAsModule()
	})
// importTransforms(projectManager)
	projectManager.forEachPackage(pkg => pkg.makeModule())
	projectManager.forEachSource(transformImport);
	projectManager.forEachSource(hacker_defaults)

	projectManager.writeOut()
}