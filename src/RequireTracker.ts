import {Identifier, MemberExpression, VariableDeclaration, VariableDeclarator} from "estree";
import {ReqPropInfo} from "./ReqPropInfo.js";

export class RequireTracker {
	private readonly fromVarIDMap: { [id: string]: requireDecl } = {}
	private readonly fromModuleMap: { [id: string]: requireDecl } = {}
	private declList: VariableDeclaration[] = [];
	private maybePrims: { [p: string]: IdAndMemex[] } = {};

	constructor() {
	}

	insert(varName: string, module: string, computed: boolean) {
		// if (this.fromVarIDMap[module]) {
		//     throw new Error(`module identifier ${module} already seen with var ${varName}`)
		// } else {
		this.insertBlind(varName, module, computed)
		// }
	}

	insertBlind(varName: string, module: string, computed: boolean) {

		let decl: requireDecl = {
			identifier: {type: "Identifier", name: varName},
			module_identifier: module,
			computed: computed
		}
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

	mapString(val: number = 3) {
		// let rt_val = {}
		// for (let key in this.fromModuleMap) {
		//     rt_val[key] = this.fromModuleMap[key].identifier.name
		// }
		return JSON.stringify(this.fromModuleMap, null, val)
	}

	private pushToDeclList(varDecl: VariableDeclaration) {
		this.declList.push(varDecl)

	}

	private rPropData: { [id: string]: ReqPropInfo } = {}

	setReqPropsAccessedMap(rPropData: { [id: string]: ReqPropInfo }) {
		this.rPropData = rPropData;
		for (let id in rPropData) {
			let value: ReqPropInfo = rPropData[id]
			let refs = value.listOfPropsCalledOrAccessed
			let potential = value.listOfAllPropsAccessed
			let result: MemberExpression[] = potential.filter(po => !refs.includes(po))

			this.maybePrims[id] = []

			// can cast because the type-check was done already.
			result.forEach(e => {
				let identifier = e.property as Identifier
				this.maybePrims[id].push({id: identifier, memex: e})
			});

		}




	}

	getMaybePrims():{[id:string]:IdAndMemex[] }{
		return this.maybePrims
	}

	getReqPropsAccessedMap(): { [id: string]: ReqPropInfo } {
		return this.rPropData
	}


	getList() {
		return this.declList
	}
}

interface requireDecl {
	module_identifier: string
	identifier: Identifier
	computed: boolean
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

export interface IdAndMemex {
	id: Identifier
	memex: MemberExpression
}