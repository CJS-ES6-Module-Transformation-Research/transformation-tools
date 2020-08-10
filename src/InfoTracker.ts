import {generate} from "escodegen";
import {Identifier} from "estree";
import {RequireDeclaration, RequireExpression} from "./abstract_fs_v2/interfaces";
import {ReqPropInfo} from "./InfoGatherer";
import {API_TYPE} from "./transformations/export_transformations/ExportsBuilder";

interface ToDeclMap {
	[id: string]: requireDecl
}

export class InfoTracker {
	private readonly fromVarIDMap: ToDeclMap = {}
	private readonly fromModuleMap: ToDeclMap = {}
	private declList: (RequireExpression | RequireDeclaration)[] = [];
	private import_ids: string[] = [];
	private rPropData: { [id: string]: ReqPropInfo } = {}
	private isForcedDefault: boolean = false;
	readonly filename: string;

	constructor(name: string) {
		this.filename = name
	}

	setForcedDecl(isForced: boolean) {
		this.isForcedDefault = isForced;
	}

	insertImportPair(varName: string, module: string) {

		let decl: requireDecl = {
			identifier: {type: "Identifier", name: varName},
			module_identifier: module
		}
		this.addToImportIDs(varName)
		// this.pushToDeclList(makeDecl(decl.identifier, decl.module_identifier))
		this.fromVarIDMap[varName] = decl;
		this.fromModuleMap[module] = decl;
	}

	getRPI(id: string): ReqPropInfo {
		return this.rPropData[id]
	}

	getIfExists(module_identifier: string): requireDecl | null {
		return this.fromModuleMap[module_identifier]
	}

	getFromVar(module_identifier: string): requireDecl | null {
		return this.fromVarIDMap[module_identifier]
	}

	//
	// private pushToDeclList(varDecl: VariableDeclaration) {
	// 	this.declList.push(varDecl)
	// }


	getIDs(): string[] {
		let ids:string[] = []
		for (let id in this.fromVarIDMap) {
			if (!ids.includes(id)){
				ids.push(id)
			}
		}
		return ids
	}


	setReqPropsAccessedMap(rPropData: { [id: string]: ReqPropInfo }) {
		// console.log(`rpis set!  value: ${JSON.stringify(rPropData, null, 3)}`)
		this.rPropData = rPropData;
	}

	getMaybePrims(): { modId: string, propName: string }[] {
		let retVal: { modId: string, propName: string }[] = [];
		for (let id in this.rPropData) {
			let rpi: ReqPropInfo = this.rPropData[id]
			rpi.potentialPrimProps
				.forEach(
					(e: string) => {
						retVal.push({modId: id, propName: e})
					});
		}
		return retVal;
	}


	getDeclarations() {
		return this.declList
		// return   this .
	}

	getExportType(): API_TYPE.default_only | null {
		return this.isForcedDefault ? API_TYPE.default_only : null;
	}

	private specifiers: string[] = []

	private conditonalAdd(spec: string) {
		if (!this.specifiers.includes(spec)) {
			this.specifiers.push(spec)
		}
	}

	getImportedModuleSpecifiers() {


		for (let spec in this.fromModuleMap) {
			this.conditonalAdd(spec)
		}
		return this.specifiers;
	}

	private addToImportIDs(name: string) {
		if (!this.import_ids.includes(name)) {
			this.import_ids.push(name)
		}
	}

	insertRequireImport(stmt: RequireExpression | RequireDeclaration) {
		let id: Identifier
		let moduleIdentifier: string;

		this.declList.push(stmt)

		if (stmt.type === "ExpressionStatement") {
 			moduleIdentifier = stmt.expression.arguments[0].value.toString()
		} else if (stmt.type === "VariableDeclaration") {
			let decl = stmt.declarations[0]
			let _id = decl.id
 			id = decl.id;

			moduleIdentifier = stmt.declarations[0].init.arguments[0].value.toString()
		} else {
			throw new Error("should be unnreachable")
		}

		this.fromModuleMap[moduleIdentifier] = {identifier: null, module_identifier: moduleIdentifier};


		// console.log(`${this.filename}----${id.name}----${moduleIdentifier} \t\t${generate(stmt)}`)
		if (id) {
			this.conditonalAdd(moduleIdentifier)// only add if we have an id
			this.addToImportIDs(id.name)
			let decl: requireDecl = {identifier: id, module_identifier: moduleIdentifier}
			this.fromVarIDMap[id.name] = decl;
			this.fromModuleMap[moduleIdentifier] = decl;
		}else {
			console.log('err_______')
			console.log(generate(stmt))
			throw new Error()
		}
// 		console.log(`id: ${id.name}   modulespecifier: ${moduleIdentifier}
// ${this.fromModuleMap[moduleIdentifier].module_identifier  }\t ${this.fromModuleMap[moduleIdentifier].identifier.name }\n`)

	}

	getRPI_() {
		console.log(JSON.stringify(this, null, 2))
	}

	importingModule(requireString: string): Identifier {

		console.log(`  ${this.fromModuleMap[requireString] }`)
		console.log(`  ${this.fromModuleMap[requireString].identifier }`)
		console.log(`  ${this.fromModuleMap[requireString].module_identifier  }`)
		if (this.fromModuleMap[requireString] && this.fromModuleMap[requireString].identifier) {
			// console.log(`returning value: ${this.fromModuleMap[requireString].identifier.name} `)
			return this.fromModuleMap[requireString].identifier;
		}
		return
	}

	private  readonly  deconsIDs:string[]  = []
	addDeconsId(identifier: Identifier) {
		let _name = identifier.name
		if (!this.deconsIDs.includes(_name)) {
			this.deconsIDs.push(_name)
		}
	}
	getDeconses(){
		return this.deconsIDs;
	}
}

interface requireDecl {
	module_identifier: string
	identifier: Identifier
}

//
// function makeDecl(id: Identifier, mod_id: string): VariableDeclaration| {
// 	let variableDeclarator: VariableDeclarator = {
// 		id: id,
// 		type: "VariableDeclarator",
// 		init: {
// 			type: "CallExpression",
// 			arguments: [{type: "Literal", value: `${mod_id}`}],
// 			callee: {type: "Identifier", name: "require"}
// 		}
// 	}
// 	return {
// 		declarations: [variableDeclarator], kind: 'const', type: "VariableDeclaration"
//
// 	}
// }
