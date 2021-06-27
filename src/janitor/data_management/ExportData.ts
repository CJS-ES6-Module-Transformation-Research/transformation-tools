import {JSFile} from "../../abstract_fs_v2/JSv2";
import {ExportData} from "./IDataController";
import {JanitorRequireData} from "./RequireStringData";

export class JanitorExportsData  {
	directAssignCount: number;
	exportNames: string[];
	readCount: number;

	private readonly js: JSFile;
	private hasDefault: boolean;

	constructor(js:JSFile) {
		this.js = js
		this.duplicateReport = []
		this.exportNames = [];
		this.directAssignCount = 0;
		this.readCount  = 0;
	}
	addDefault(){
		this.hasDefault = true
		this.directAssignCount++

	}


	addExportName(name: string): void {
		if (this.exportNames.includes(name)){
			if (!this.duplicateReport[name]){
				this.duplicateReport[name] = {name, count:0}
			}
			this.duplicateReport[name].count++
		}
		this.exportNames.push (name)
	}



	incReads(): void {
		this.readCount++
	}

	duplicateReport: { [p: string]: { ident: string; count: number } }[];


}
