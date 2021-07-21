import {ExpressionStatement, VariableDeclaration} from "estree";
import {ShadowVariableMap} from "./types";

type S2<T> = { [p: string]: T }

export class Intermediate implements IEData {
	// getRPIMap(): { [id: string]: ReqPropInfo; } {
	// 	return this.rpiMap
	// }

	constructor(id_to_ms, ms_to_id, import_decls, exportMap, load_order, declCounts, id_aliases) {
		this.id_aliases = id_aliases
		this.declCounts = declCounts
		this.exportMap = exportMap
		this.id_to_ms = id_to_ms
		this.ms_to_id = ms_to_id
		this.import_decls = import_decls
		this.load_order = load_order
		this.shadows = {}
		this.propReads = {}
		this.shadows = {}
		this.forcedDefaultMap = {}
		console.log(this.forcedDefaultMap)
		console.log(this.propReads)
		Object.keys(this.ms_to_id).forEach(modid => {

			this.forcedDefaultMap[modid] = false;
			this.propReads[modid] = []
		})
	}

	getShadowVars(): ShadowVariableMap {
		return this.shadows
	}

	readonly declCounts: S2<number>;
	readonly import_decls: (ExpressionStatement | VariableDeclaration)[];
	readonly exportMap: S2<string>;
	readonly id_to_ms: S2<string>;
	readonly load_order: string[];
	readonly ms_to_id: S2<string>;
	readonly id_aliases: { [p: string]: string[] };
	readonly shadows: ShadowVariableMap = {};
	// readonly rpiMap: { [id: string]: ReqPropInfo }
	readonly forcedDefaultMap: { [p: string]: boolean }
	readonly propReads: { [p: string]: string[] }

	getPropReads() {
		return this.propReads
	}

	getForcedDefaults() {
		return this.forcedDefaultMap
	}

	getListOfIDs(): string[] {
		return Object.keys(this.id_to_ms)
	}
}

interface IEData {
	declCounts: { [key: string]: number }
	load_order: string[]
	id_to_ms: { [str: string]: string }
	ms_to_id: { [str: string]: string }
	id_aliases: { [str: string]: string[] }

	exportMap: { [str: string]: string }
	import_decls: (ExpressionStatement | VariableDeclaration)[]
	shadows: ShadowVariableMap
	// rpiMap: { [id: string]: ReqPropInfo }
	forcedDefaultMap: { [key: string]: boolean }
	propReads: { [key: string]: string[] }

}