import {JSFile} from "../../abstract_fs_v2/JSv2";
import {JanitorExportsData} from "./ExportData";
import {DataController, ExportData, RequireStringData, StringMap} from "./IDataController";
import {JanitorRequireData} from "./RequireStringData";



export class JanitorData implements  DataController<JanitorExportsData,JanitorRequireData> {
	private readonly js: JSFile;
	constructor (js:JSFile){
	this.js = js
		 this.Requires = new JanitorRequireData(js);
		 this.Exports = new JanitorExportsData(js);
	}
	Exports: JanitorExportsData;
	Requires: JanitorRequireData;

}