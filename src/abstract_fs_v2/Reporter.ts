import {writeFile, writeFileSync} from "fs";
import {join} from "path";

export class Reporter {
	private singleLines: {[key:string]:SingleLineItem }={}
	private multiLines: {[key:string]:MultiLineItem }={}
	private path: string;
	constructor(_path:string) {
		this.path = _path
	}
	addSingleLine(name:string, header:string):SingleLineItem{
		if (!this.singleLines[name] ) {
			this.singleLines[name] = {header: header, data: {}}
		}
		return this.singleLines[name]
	}
	addMultiLine(name:string, header:string):MultiLineItem{
		if (!this.multiLines[name]) {
			this.multiLines[name] = {header: header, data: {}}
		}
		return this.multiLines[name]
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
		}for (let _key in this.multiLines){
			let _value = this.multiLines[_key].data

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
	header:string
	data:{[key:string]:any}
}
interface MultiLineItem{
	header:string
	data:{[key:string]:string[]}
}
// let r = new Reporter(process.cwd())
// let sl = r.addSingleLine('name1', 'header')
// sl.data['x'] = 'y'
// let ml = r.addMultiLine('ml', 'header2')
// ml.data['x'] = ['a','b','c']
//  r.writeOut()
