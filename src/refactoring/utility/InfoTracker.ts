import {Identifier, ImportDeclaration} from "estree";
import {ModuleAPIMap} from "../../filesystem/FS-Factory";
import {RequireDeclaration, RequireExpression} from "../../utility/Require";
import {errHandle} from '../../control/ProjectManager'
import {ReqPropInfo} from "./InfoGatherer";
import {API, API_TYPE} from "./API";

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
type PropertiesOn = {
	[mod: string]: string[]
}
type APITable = { [moduleSpecifier: string]: API };
export class Imports {
	private readonly withPropNames: WithPropNames;
	private apiGetter: (string) => API;
	private mapiM: ModuleAPIMap;
	private info: InfoTracker;
	private readonly declarations: ImportDeclaration[];
	private readonly apis :APITable= {}
	private readonly propertiesOn :PropertiesOn = {};
	constructor(map: DeMap, apiGetter: (string) => API, MAM: ModuleAPIMap, info: InfoTracker) {
		this.info = info;
		this.declarations = []
		this.mapiM = MAM
		this.apiGetter = apiGetter
		// let _api: { [moduleSpecifier: string]: API } = {};	// @ts-ignore

		for (let spec in map.fromSpec) {
			try {
				this.apis[spec] = apiGetter(spec)

				this.propertiesOn[map.fromSpec[spec]] = info.getRPI(map.fromSpec[spec]).allAccessedProps
			} catch (e) {
				errHandle(e, `err:  ${map.fromSpec[spec]}`)
			}
		}

		this.withPropNames = {
			fromId: map.fromId,
			fromSpec: map.fromSpec,
			aliases: map.aliases,
			propertiesOf: this.propertiesOn
			// ,
			// api: _api

		}

	}

	getAPITable():APITable{
		return this.apis
	}

	getPropertiesOn():PropertiesOn{
		return this.propertiesOn
	}

	add(declaration: ImportDeclaration) {
		this.declarations.push(declaration)
	}

	getWPN() {
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
	}
	// ,
	// api: { [moduleSpecifier: string]: API }
}