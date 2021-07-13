import {JSFile} from "../../filesystem/JSFile";

//
// export class JanitorData implements DataController<JanitorExportsData, JanitorRequireData> {
// 	private readonly js: JSFile;
//
// 	constructor(js: JSFile) {
// 		this.js = js
// 		this.Requires = new JanitorRequireData(js);
// 		this.Exports = new JanitorExportsData(js);
// 	}
//
// 	Exports: JanitorExportsData;
// 	Requires: JanitorRequireData;
//
// }
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


interface KeyMap<T> {
	[key: string]: T
}

export interface StringMap extends KeyMap<string> {
}

export interface DataController<T, R> {
	dynamic?: KeyMap<{}>
	Exports: T;
	Requires: R;

}
//
// export interface RequireStringData {
// 	specifiers: string[]
// 	mappingToID: StringMap
// 	addSpecifier: (specifier: string, id?: string) => void
// 	// addMapping:(specifier:string,id:string )=>void
//
// }
//
//
// export interface ExportData {
// 	duplicateReport: { [rstr: string]: { ident: string, count: number } }[]
// 	exportNames: string[]
// 	directAssignCount: number
// 	readCount: number
// 	incReads: () => void
// 	incDirectAssigns: () => void
// 	addExportName: (name: string) => void
// }
