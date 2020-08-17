import {generate} from "escodegen";
import {Identifier, ImportDeclaration} from "estree";
import {ModuleAPIMap} from "./abstract_fs_v2/Factory";
import {RequireDeclaration, RequireExpression} from "./abstract_fs_v2/interfaces";
import {ReqPropInfo} from "./InfoGatherer";
import {API, API_TYPE} from "./transformations/export_transformations/API";

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

	private specMap: DeMap = {
		aliases: {},
		fromId: {},
		fromSpec: {}
	}

	insertDeclPair(id: string, modSpec: string) {

		this.specMap.fromId[id] = modSpec
		this.specMap.fromSpec[modSpec] = id
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

	getFromDeMap(thing: string, _type: "id" | "ms") {
		switch (_type) {
			case "id":
				return this.specMap.fromId[thing]
				break;
			case "ms":
				return this.specMap.fromSpec[thing]
				break;
		}

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
		let ids: string[] = []
		for (let id in this.fromVarIDMap) {
 				ids.push(id)
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

	private conditionalAdd(spec: string) {
		if (!this.specifiers.includes(spec)) {
			this.specifiers.push(spec)
		}
	}

	getImportedModuleSpecifiers() {


		for (let spec in this.fromModuleMap) {
			this.conditionalAdd(spec)
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
			this.conditionalAdd(moduleIdentifier)// only add if we have an id
			this.addToImportIDs(id.name)
			let decl: requireDecl = {identifier: id, module_identifier: moduleIdentifier}
			this.fromVarIDMap[id.name] = decl;
			this.fromModuleMap[moduleIdentifier] = decl;
		} else {
			console.log('ERR_______')
			console.log(generate(stmt))
			throw new Error()
		}
// 		console.log(`id: ${id.name}   modulespecifier: ${moduleIdentifier}
// ${this.fromModuleMap[moduleIdentifier].module_identifier  }\t ${this.fromModuleMap[moduleIdentifier].identifier.name }\n`)

	}



	importingModule(requireString: string): Identifier {

		// console.log(`  ${this.fromModuleMap[requireString]}`)
		// console.log(`  ${this.fromModuleMap[requireString].identifier}`)
		// console.log(`  ${this.fromModuleMap[requireString].module_identifier}`)
		// if (this.fromModuleMap[requireString] && this.fromModuleMap[requireString].identifier) {
		// 	// console.log(`returning value: ${this.fromModuleMap[requireString].identifier.name} `)
		// 	return this.fromModuleMap[requireString].identifier;
		// }
		return
	}

	private readonly deconsIDs: string[] = []

	addDeconsId(identifier: Identifier) {
		let _name = identifier.name
		if (!this.deconsIDs.includes(_name)) {
			this.deconsIDs.push(_name)
		}
	}

	getDeconses() {
		return this.deconsIDs;
	}


	// addSpecifiers(requireString:string, specifiers: ImportSpecifier[]) {
	// 	ImportDefaultSpecifier
	// 	//	this.specMap.specifiers[requireString] = specifiers
	// }
	registerAlias(requireString: string, key: string, value: string) {
		if (!this.specMap.aliases[requireString]) {
			this.specMap.aliases[requireString] = {}
		}
		if (!this.specMap.aliases[requireString][key]) {
			this.specMap.aliases[requireString][key] = value
		}

	}

	getAlias(moduleSpecifier: string) {
		return this.specMap.aliases[moduleSpecifier]
	}

	getDeMap() {
		return this.specMap
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
export interface DeMap {
	aliases: { [modSpec: string]: { [local: string]: string } }
	fromId: { [id: string]: string },
	fromSpec: { [spec: string]: string }


}

export class Imports {
	private withPropNames: WithPropNames;
	private apiGetter: (string) => API;
	private mapiM: ModuleAPIMap;
	private info: InfoTracker;
	private readonly declarations: ImportDeclaration[];

	constructor(map: DeMap, apiGetter: (string) => API, MAM: ModuleAPIMap, info:InfoTracker) {
		this.info = info ;
	this.declarations = []
		this.mapiM = MAM
		this.apiGetter = apiGetter
		let _api: { [moduleSpecifier: string]: API } = {};
 		let po={}
		for (let spec in map.fromSpec) {
try {
	_api[spec] = apiGetter(spec.replace(/^\.{0,2}\//, ''))
	po[map.fromSpec[spec]] = info.getRPI(map.fromSpec[spec]).allAccessedProps
}catch (e) {
	console.log(`err:  ${map.fromSpec[spec]}` )
}
		}
		;

		this.withPropNames = {
			fromId: map.fromId,
			fromSpec: map.fromSpec,
			aliases: map.aliases,
			propertiesOf: po,
			api: _api

		}

	}

	addAllProps(modSpec: string, props: string[]) {
		this.withPropNames.propertiesOf[modSpec] = props;
	}


	add(declaration:ImportDeclaration) {
		this.declarations.push(declaration)
	}
	getWPN( ){
		return this.withPropNames
	}

	getDeclarations() {
		return this.declarations 
	}
}

export interface WithPropNames
	extends DeMap {
	propertiesOf: {
		[mod: string]: string[]
	},
	api: { [moduleSpecifier: string]: API }
}