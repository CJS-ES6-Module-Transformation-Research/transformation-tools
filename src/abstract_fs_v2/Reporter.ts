import {writeFile, writeFileSync} from "fs";
import {join} from "path";

export class Reporter {
	static readonly ExportNames= 'export_name_report'
	static readonly copyPrimCount = 'copy_prim_count'
	static readonly forcedDefault = 'forced_default_count'
	private singleLines: {[key:string]:SingleLineItem }={}
	private arrayLine: {[key:string]:MultiLineItem }={}
	private path: string;
	private isActive: boolean;
	constructor(_path:string,active:boolean) {
		this.isActive = active
		this.path = _path
	}
	addSingleLine(name:string ):SingleLineItem{
		if (!this.singleLines[name] ) {
			this.singleLines[name] = { data: {}}
		}
		return this.singleLines[name]
	}
	addMultiLine(name:string ):MultiLineItem{
		if (!this.arrayLine[name]) {
			this.arrayLine[name] = {  data: {}}
		}
		return this.arrayLine[name]
	}
	writeOut(){
		let writeOuts:{[key:string]:string}={}
		for (let _key in this.singleLines){
			let _value = this.singleLines[_key].data
			let str = ''
			for (let key in _value){
				let value = _value[key]
				str = str + `${key}|${value}\n`
			}
			writeOuts[_key] = str
		}for (let _key in this.arrayLine){
			let _value = this.arrayLine[_key].data

			let str = ''
			for (let key in _value){
				let value = _value[key]
				str = str + `${key}|${value.length}|${csv_(value)}\n`
			}

			writeOuts[_key] = str

		}
		function csv_(list:string[]){
			let str:string=''
			list.forEach(e=>{
				str = e+ ','+str
			});
			if (str.length===1){
				str = ''
			}else if(str.endsWith(',')){

				str = str.substring(0,str.length-1 )
			}
			return  str
		}
		for (let w in writeOuts){
			// console.log(`${w}${writeOuts[w]}`)
			writeFile(join(this.path, `${w}.report.txt`), `${writeOuts[w]}`,()=>{})
		}

	}


}

interface SingleLineItem{
 	data:{[key:string]:any}
}
interface MultiLineItem{
 	data:{[key:string]:string[]}
}
// let r = new Reporter(process.cwd())
// let sl = r.addSingleLine('name1', 'header')
// sl.data['x'] = 'y'
// let ml = r.addMultiLine('ml', 'header2')
// ml.data['x'] = ['a','b','c']
//  r.writeOut()
