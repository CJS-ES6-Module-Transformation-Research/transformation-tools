import {replace, traverse, Visitor} from "estraverse";
import {Identifier} from "estree";
import {JSFile} from "../../abstract_fs_v2/JSv2";
import {Namespace} from "../../abstract_fs_v2/Namespace";
import {Reporter} from "../../abstract_fs_v2/Reporter";
import {Imports} from "../../InfoTracker";
import getMainVisitor from "./visitors/import_utility1";
import {replaceModExp_with_ID /*,     handleNamedImports*/ } from "./visitors/insert_imports";
export type Prop_Replace_Map =  { [base: string]: { [property: string]: string } }
export function importer(js: JSFile) {
	let {info,
		mod_map,
		reporter,
		jsRelative,
		deleteASTLocationData
	} = init(js)
	let _imports = new Imports(info.getDeMap(), ((mspec: string) => mod_map.resolveSpecifier(js, mspec)), mod_map, info );

	js.setImports(_imports)

	//Init stuff
	let xImportsY = reporter.addMultiLine(Reporter.xImportsY)
	xImportsY.data[jsRelative] = []

	let propNameReplaceMap:Prop_Replace_Map= {}//replaceName

	//for readability in debugging
	deleteASTLocationData(js);

 	//load in visitors
	let visitor: Visitor = getMainVisitor(js, reporter  , propNameReplaceMap,xImportsY, _imports)
	let membex_replacer:Visitor = replaceModExp_with_ID(propNameReplaceMap, js)
	//main visitor
	replace(js.getAST(), visitor)

	replace(js.getAST(), membex_replacer);


	// function namedImports(id: string, module_specifier: string) {
	// }

	function init(js: JSFile) {
		js.setAsModule()

		return {
			info:js.getInfoTracker(),
			mod_map: js.getAPIMap(),
			reporter: js.getReporter(),
			jsRelative: js.getRelative(),
			report: js.report(),
			deleteASTLocationData
		}
		function deleteASTLocationData(js: JSFile): void {
			traverse(js.getAST(), {
				enter: (node) => {
					delete node.loc
				}
			})
		}

	}

}
export default importer
