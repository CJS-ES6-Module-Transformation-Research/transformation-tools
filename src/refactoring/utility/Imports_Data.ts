import {ImportDeclaration} from "estree";
import {errHandle} from "../../control";
import {ModuleAPIMap} from "../../filesystem/FS-Factory";
 import {API} from "./API";
import {DeMap, InfoTracker, WithPropNames} from "./InfoTracker";
// type PropertiesOn = { [mod: string]: string[] }
// type APITable = { [moduleSpecifier: string]: API };

export class Imports {
	private readonly withPropNames: WithPropNames;
	private apiGetter: (string) => API;
	private mapiM: ModuleAPIMap;
	private info: InfoTracker;
	private readonly declarations: ImportDeclaration[];
	private readonly apis: { [moduleSpecifier: string]: API } = {}
	private readonly propertiesOn: { [mod: string]: string[] } = {};

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

	getAPITable() {
		return this.apis
	}

	getPropertiesOn() {
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