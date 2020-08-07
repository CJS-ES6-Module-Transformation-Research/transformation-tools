import {Identifier, VariableDeclaration, VariableDeclarator} from "estree";
import {ReqPropInfo} from "./InfoGatherer";
import {API_TYPE} from "./transformations/export_transformations/ExportsBuilder";

export class InfoTracker {
	private readonly fromVarIDMap: { [id: string]: requireDecl } = {}
	private readonly fromModuleMap: { [id: string]: requireDecl } = {}
	private declList: VariableDeclaration[] = [];
	private import_ids: string[] = [];
	private rPropData: { [id: string]: ReqPropInfo } = {}
	private isForcedDefault: boolean = false;

	constructor() {
	}

	setForcedDecl(isForced: boolean) {
		this.isForcedDefault = isForced;
	}

	insertImportPair(varName: string, module: string) {

		let decl: requireDecl = {
			identifier: {type: "Identifier", name: varName},
			module_identifier: module
		}
		this.import_ids.push(varName)
		this.pushToDeclList(makeDecl(decl.identifier, decl.module_identifier))
		this.fromVarIDMap[varName] = decl;
		this.fromModuleMap[module] = decl;
	}

	getIfExists(module_identifier: string): requireDecl | null {
		return this.fromModuleMap[module_identifier]
	}

	getFromVar(module_identifier: string): requireDecl | null {
		return this.fromVarIDMap[module_identifier]
	}


	private pushToDeclList(varDecl: VariableDeclaration) {
		this.declList.push(varDecl)
	}


	getIDs(): string[] {
		return this.import_ids.map(e => e)
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
}

interface requireDecl {
	module_identifier: string
	identifier: Identifier
}

function makeDecl(id: Identifier, mod_id: string): VariableDeclaration {
	let variableDeclarator: VariableDeclarator = {
		id: id,
		type: "VariableDeclarator",
		init: {
			type: "CallExpression",
			arguments: [{type: "Literal", value: `${mod_id}`}],
			callee: {type: "Identifier", name: "require"}
		}
	}
	return {
		declarations: [variableDeclarator], kind: 'const', type: "VariableDeclaration"

	}
}
