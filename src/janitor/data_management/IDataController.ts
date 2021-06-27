import {JanitorExportsData} from "./ExportData";
import {JanitorRequireData} from "./RequireStringData";

interface Builder<T>{
	build:(optional?:string)=> T
}

interface KeyMap<T>{
	[key:string]:T
}

export interface StringMap extends  KeyMap<string>{}
export interface DataController<T,R> {
	dynamic?:KeyMap<{}>
	Exports: T;
	Requires: R;

}

export interface RequireStringData{
	specifiers:string[]
	mappingToID:StringMap
	addSpecifier:(specifier:string,id?:string)=>void
	// addMapping:(specifier:string,id:string )=>void

}



export interface ExportData{
	duplicateReport:{[rstr:string]:{ident:string, count:number}}[]
	exportNames:string[]
	directAssignCount:number
	readCount:number
	incReads:()=>void
	 incDirectAssigns:()=>void
	 addExportName:(name:string)=>void
}
