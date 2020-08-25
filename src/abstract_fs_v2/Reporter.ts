import {writeFile} from "fs";
import {join} from "path";
import {JSFile} from "./JSv2";

export class Reporter {
	static readonly ExportNames = 'export_name_report'
	static readonly copyPrimCount = 'copy_prim_count'
	static readonly forcedDefault = 'forced_default_count'
	private singleLines: { [key: string]: SingleLineItem } = {}
	private arrayLine: { [key: string]: MultiLineItem } = {}
	private path: string;
	private isActive: boolean;
	static xImportsY: string = "imported-by";

	private reports: ReportBuilder = new ReportBuilder();

	reportOn(): ReportBuilder {
		return this.reports
	}

	constructor(_path: string, active: boolean) {
		this.isActive = active
		this.path = _path
	}

	addSingleLine(name: string): SingleLineItem {
		if (!this.singleLines[name]) {
			this.singleLines[name] = {data: {}}
		}
		return this.singleLines[name]
	}

	addMultiLine(name: string): MultiLineItem {
		if (!this.arrayLine[name]) {
			this.arrayLine[name] = {data: {}}
		}
		return this.arrayLine[name]
	}

	writeOut() {
		this.reports.build()
		let writeOuts: { [key: string]: string } = {}
		for (let _key in this.singleLines) {
			let _value = this.singleLines[_key].data
			let str = ''
			for (let key in _value) {
				let value = _value[key]
				str = str + `${key}|${value}\n`
			}
			writeOuts[_key] = str
		}
		for (let _key in this.arrayLine) {
			let _value = this.arrayLine[_key].data

			let str = ''
			for (let key in _value) {
				let value = _value[key]
				str = str + `${key}|${value.length}|${csv_(value)}\n`
			}

			writeOuts[_key] = str

		}

		function csv_(list: string[]) {
			let str: string = ''
			list.forEach(e => {
				str = e + ',' + str
			});
			if (str.length === 1) {
				str = ''
			} else if (str.endsWith(',')) {

				str = str.substring(0, str.length - 1)
			}
			return str
		}

		for (let w in writeOuts) {
			// console.log(`${w}${writeOuts[w]}`)
			writeFile(join(this.path, `${w}.report.txt`), `${writeOuts[w]}`, () => {
			})
		}

	}


}

interface SingleLineItem {
	data: { [key: string]: any }
}

interface MultiLineItem {
	data: { [key: string]: string[] }
}

// let r = new Reporter(process.cwd())
// let sl = r.addSingleLine('name1', 'header')
// sl.data['x'] = 'y'
// let ml = r.addMultiLine('ml', 'header2')
// ml.data['x'] = ['a','b','c']
//  r.writeOut()
export class ReportBuilder implements RepJR, ReportBuilder_ {
	forcedDfs: { [key: string]: { names: string[], count?: number } } = {};


	addAccessReplace(js: JSFile): void {
		this.accessReplaceCt++;
	}

	addedDirname() {
		this.dirnameCT++
	}

	addedFilename() {

		this.filenameCT++
	}

	addARequire(js: JSFile): void {
		this.requireCTTotal++
	}

	addCopyByValue(js: JSFile): void {
		this.copyByValueCT++
	}

	addDefaultExport(js: JSFile): void {
		this.defExCount++
		this.exCountTotal++
	}

	addDefaultImportStatement(js: JSFile): void {
		this.importDefStmtCt++
	}

	forcedDReasons: ("condition" | "property_assignment")[] = []

	addForcedDefault(js: JSFile, id: string, str: "condition" | "property_assignment"): void {
		this.forcedDefCT++
		this.forcedDReasons.push(str)
		if (!this.forcedDfs[js.getRelative()]) {
			this.forcedDfs[js.getRelative()] = {names: []}
		}
		let spec = js.getAPIMap().resolve(id, js)
		if (!(this.forcedDfs[js.getRelative()].names.includes(spec))) {
			this.forcedDfs[js.getRelative()].names.push(spec)
		}

	}

	addJSONRequire(js: JSFile, str: string = ''): void {
		this.JSONreqCT++
	}

	addModuleExport(js: JSFile, str: "direct" | "property" | "object"): void {
		this.moduleExports++
		this.moduleExportsReasons.push(str)
	}

	addNamedExport(js: JSFile): void {
		this.namedExCount++
		this.exCountTotal++
	}

	addNamedImportStatement(js: JSFile): void {
		this.importNamedStmtCt++
		this.importStmtCt++
	}

	addNamespaceImportStatement(js: JSFile): void {
		this.importNSStmtCt++
		this.importStmtCt++
	}

	addPropAccessLocation(js: JSFile): void {
		this.potentialNameablePropAccess++
	}

	addSaniRequire(js: JSFile): void {
		this.sanitizedRCT++
	}

	JSONreqCT: number = 0;
	builtinRCT: number = 0;
	copyByValueCT: number = 0;
	defExCount: number = 0;
	exCountTotal: number = 0;
	forcedDefCT: number = 0;
	forcedDefReasons: reasoned<forcedDefaultReason>[] = [];
	accessReplaceCt: number = 0;
	dirnameCT: number = 0;
	filenameCT: number = 0;
	importDefStmtCt: number = 0;
	importNSStmtCt: number = 0;
	importNamedStmtCt: number = 0;
	importStmtCt: number = 0;
	installedRCT: number = 0;
	moduleExports: number;
	moduleExportsReasons: moduleExportsReason[] = [];
	namedExCount: number = 0;
	potentialNameablePropAccess: number = 0;
	requireCTTotal: number = 0;
	sanitizedRCT: number = 0;
	nameCt: number = 0;

	esmNamedExports: number = 0;
	esmDefaultExports: number = 0;
	esmForcedDefaultExports: number = 0;
	esmTotalExports: number = 0;

	addESMEx(_type: "named" | "default" | "forced") {
		switch (_type) {
			case "named":
				this.esmNamedExports++
				break
			case "default":
				this.esmDefaultExports++
				break;
			case "forced":
				this.esmForcedDefaultExports++
				break;
		}
		this.esmTotalExports++;
	}

	addImportInfo(js:JSFile ,info:{
		relativizedImportString: string,
		isDefault: boolean,
		isForced: boolean
	} ){
		if(!this.importInfo[js.getRelative()]){
			this.importInfo[js.getRelative()] = []
		}
		this.importInfo[js.getRelative()].push(info)
	}
	importInfo: {
		[jsFileRelative: string]: {
			relativizedImportString: string,
			isDefault: boolean,
			isForced: boolean
		}[]
	} = {}

	addNamedSpecifier(js: JSFile): void {
		this.nameCt++
	}

	build() {
let w = this.importInfo

		let v = {
			esmNamedExports: this.esmNamedExports,
			esmDefaultExports: this.esmDefaultExports,
			esmForcedDefaultExports: this.esmForcedDefaultExports,
			esmTotalExports: this.esmTotalExports
		}
		let x = {
			accessReplace: this.accessReplaceCt,
			filenaemCount: this.filenameCT,
			dirnameCount: this.dirnameCT,
			sanitizedRequireTotal: this.sanitizedRCT,
			requireTotal: this.requireCTTotal
		}
		let y = {
			forcedDef: this.forcedDefCT,
			copyByValue: this.copyByValueCT,
			importDefault: this.importDefStmtCt,
			importNamespace: this.importNSStmtCt,
			importNamedDecls: this.importNamedStmtCt,
			importNAMES: this.nameCt
		}
		let z = {
			exports: this.exCountTotal,
			namedExports: this.namedExCount,
			defaultExports: this.defExCount
		}
		for (let key in this.forcedDfs) {
			let val = this.forcedDfs[key]
			val.count = val.names.length
		}

		let u = JSON.stringify(this.forcedDfs, null, 3)

		let sanitize = JSON.stringify(x, null, 3)
		let importEtc = JSON.stringify(y, null, 3)
		let exports_ = JSON.stringify(z, null, 3)
		let esmExports = JSON.stringify(v, null, 3)
		let importInfo = JSON.stringify(w , null, 3)
		writeFile('sanitize.report.js.txt', sanitize, () => {
		})
		writeFile('imports.etc..report.js.txt', importEtc, () => {
		})
		writeFile('exports.report.js.txt', exports_, () => {
		})
		writeFile('esmExports.report.js.txt', esmExports, () => {
		})
		writeFile('forced_defaultWithUniq.report.js.txt', u, () => {
		})
	writeFile('importInfo_pt2.report.js.txt', importInfo, () => {
		})

	}

}

type forcedDefaultReason = "condition" | "property_assignment"
type basicAdder = (js: JSFile) => void
type extraAdder = (js: JSFile, str: string) => void
type reasonAdd<T> = (js: JSFile, str: T) => void
type typ = "condition" | "property_assignment"
type moduleExportsReason = "direct" | "property" | "object"

interface ReportBuilder_ {

	addModuleExport: reasonAdd<moduleExportsReason>
	addAccessReplace: basicAdder
	//sum of these is total
	addARequire: basicAdder
	addJSONRequire: extraAdder
	addSaniRequire: basicAdder
	addCopyByValue: basicAdder
	addForcedDefault: (js: JSFile, id: string, fdr: forcedDefaultReason) => void


	//and total count
	addNamedExport: basicAdder
	addDefaultExport: basicAdder

	//and total count
	addNamedImportStatement: basicAdder
	addDefaultImportStatement: basicAdder
	addNamespaceImportStatement: basicAdder

	addPropAccessLocation: basicAdder
}

type reasoned<T> = { count: number, reason: T }
type countable = { js: string, count: number }

interface RepJR {
	moduleExports: number
	moduleExportsReasons: moduleExportsReason[]

	exCountTotal: number
	namedExCount: number
	defExCount: number

	importStmtCt: number
	importNamedStmtCt: number
	importNSStmtCt: number
	importDefStmtCt: number

	requireCTTotal: number
	JSONreqCT: number
	installedRCT: number
	builtinRCT: number
	sanitizedRCT: number

	accessReplaceCt: number

	copyByValueCT: number
	forcedDefCT: number
	forcedDefReasons: reasoned<forcedDefaultReason>[]
	potentialNameablePropAccess: number
}