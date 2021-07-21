import {VariableDeclaration} from "estree";
import {readFileSync} from "fs";
import {ProjectManager} from "../../control";
import { join } from "path";
import {Intermediate} from "../../utility/Intermediate";


interface ImportData {
	rst_order: string[]
	rstrs: { [str: string]: string }
	idMap: { [str: string]: string }
	// aliases: { [str: string]: string[] }
}
type exportClassification= 'named' | 'default' | 'mixed'| 'none'
interface ExportData {
	exportsList: string[]
	exportClassification:exportClassification
	copy_declarations: VariableDeclaration | null
}

interface PreProcessData {
	import_data: ImportData,
	export_data: ExportData
}


interface PPBuilder {
	data: ImportData & ExportData
	setCopyDeclarations: (vd: VariableDeclaration) => PPBuilder
	// setExportClassification: (classif:exportClassification) => PPBuilder

	addExport: (exportName:string) => PPBuilder
	addRequire: (reqString: string, id?: string) => PPBuilder
	build: () => string

}
export function readInPreProcess(pm:ProjectManager,name:string=''):PreProcessData{
	return JSON.parse(readFileSync(join(pm.getRootDir(), `${name? name+'.':''}preprocess-data.json` ),'utf-8'))
}


class  PPBImpl implements  PPBuilder {
	constructor() {
		let idata: ImportData = new class implements ImportData {
			idMap: { [p: string]: string } = {};
			rst_order: string[] = [];
			rstrs: { [p: string]: string } = {};

		}
		let edata: ExportData = new class implements ExportData {
			copy_declarations: VariableDeclaration | null;
			exportClassification: exportClassification = null;
			exportsList: string[] = [];
		}
		this.data = {... idata, ... edata}

	}


	addRequire(reqString: string, id: string = null): PPBuilder {
		this.data.rst_order.push(reqString)
		this.data.rstrs[reqString] = id
		if (id) {
			this.data.idMap[id] = reqString
		}
		return this;
	}

	data: ImportData & ExportData;

	build(): string {

		let exportClassification: exportClassification
		if (this.data.exportsList.includes('default')) {
			if (this.data.exportsList.length === 1) {
				exportClassification = 'default'
			} else {
				exportClassification = 'mixed'
			}
		} else {
			if (this.data.exportsList.length > 0) {
				exportClassification = "named"
			} else {

				exportClassification = "none"
			}
		}

		return JSON.stringify({
			import_data: {rst_order: this.data.rst_order, idMap: this.data.idMap, rstrs: this.data.rstrs},
			export_data: {
				copy_declarations: this.data.copy_declarations,
				exportClassification,
				exportsList: this.data.exportsList
			}
		}, null, 3)


	}

	setCopyDeclarations(vd: VariableDeclaration): PPBuilder {
		this.data.copy_declarations = vd
		return this;
	}

	addExport(name: string): PPBuilder {
		if (!this.data.exportsList.includes(name)) {

			this.data.exportsList.push(name)
		}
		return this;
	}


}
export const DataBuilder:()=> PPBuilder = ()=> new PPBImpl()
//
// let z = new PPBuilder
// export const DataBuilder : () => PPBuilder = ():PPBuilder => {
// 	return {
// 		data: {
// 			rst_order: [],
// 			rstrs: {},
// 			idMap: {},
// 			exportsList: [] ,
// 			exportClassification: undefined,//'named' | 'default' | 'mixed',
// 			copy_declarations: null
// 		},
// 		addRequire(reqString: string, id: string = null): PPBuilder {
// 			this.data.rst_order.push(reqString)
// 			this.rstrs[reqString] = id
// 			if (id) {
// 				this.data.idMap[id] = reqString
// 			}
// 			return this;
// 		}, build(): string  {
//
// 			let exportClassification : exportClassification
// 			 if (this.data.exportsList.includes('default')){
// 			 	if (this.data.exportsList.length === 1  ){
// 			 		exportClassification= 'default'
// 				}
// 			 	else {
// 			 		exportClassification = 'mixed'
// 				}
// 			 }else {
// 			 	if(this.data.exportMap.length > 0 ){
// 			 		exportClassification = "named"
// 				}else{
//
// 			 		exportClassification = "none"
// 				}
// 			 }
//
// 			return JSON.stringify({
// 				import_data: {rst_order: this.rst_order, idMap: this.idMap, rstrs: this.rstrs},
// 				export_data: {
// 					copy_declarations: this.copy_declarations,
// 					exportClassification,
// 					exportsList: this.exportsList
// 				}}, null, 3)
//
//
// 		}, setCopyDeclarations(vd: VariableDeclaration): PPBuilder {
// 			this.data.copy_declarations = vd
// 			return this;
// 		},   addExport(name:string): PPBuilder {
// 			if (!this.data.exportsList.includes(name)){
//
// 			this.data.exportsList.push(name)
// 			}
// 			return this;
// 		}
// 	}
// }