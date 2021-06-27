import {JSFile} from "../../abstract_fs_v2/JSv2";
import {JanitorExportsData} from "./ExportData";
import {ExportData, RequireStringData, StringMap} from "./IDataController";
 export class JanitorRequireData  {

	 private readonly js: JSFile;

	 mappingToID: StringMap;
	 specifiers: string[];
	 constructor (js:JSFile){
		 this.js = js
		 this.specifiers   = []
		 this.mappingToID = {}
	 }

	 addSpecifier(specifier: string, id:string=''): void {
	 	if( 	id){
			this.mappingToID[specifier] = id
		}
	 	this.specifiers.push(specifier)
	 }


 }