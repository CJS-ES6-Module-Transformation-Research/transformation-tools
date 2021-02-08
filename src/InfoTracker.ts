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



	getFromDeMap(thing: string, _type: "id" | "ms") {
		switch (_type) {
			case "id":
				return this.specMap.fromId[thing]
			case "ms":
				return this.specMap.fromSpec[thing]
		}

	}

	getRPI(id: string): ReqPropInfo {
		return this.rPropData[id]
	}

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
	}

	getExportType(): API_TYPE.default_only | null {
		return this.isForcedDefault ? API_TYPE.default_only : null;
	}


	private addToImportIDs(name: string) {
		if (!this.import_ids.includes(name)) {
			this.import_ids.push(name)
		}
	}


	private readonly deconsIDs: string[] = []

	addDeconsId(identifier: Identifier) {
		let _name = identifier.name
		if (!this.deconsIDs.includes(_name)) {
			this.deconsIDs.push(_name)
		}
	}

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
	_api[spec] = apiGetter(spec  )
	po[map.fromSpec[spec]] = info.getRPI(map.fromSpec[spec]).allAccessedProps
}catch (e) {
	console.log(`err:  ${map.fromSpec[spec]}` )
}
		};

		this.withPropNames = {
			fromId: map.fromId,
			fromSpec: map.fromSpec,
			aliases: map.aliases,
			propertiesOf: po,
			api: _api

		}

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