import {parseScript} from "esprima";
import {traverse, Visitor} from "estraverse";
import {
	AssignmentExpression,
	ExportNamedDeclaration,
	ExportSpecifier, Expression,
	Identifier,
	Node,
	ObjectExpression,
	Program,
	Property,
	SpreadElement,
	Statement
} from "estree";
import {Namespace} from "../../abstract_fs_v2/Namespace.js";
import {API} from "./API.js";
import {API_TYPE} from "./ExportsBuilder.js";

type exportsMap = { [exported: string]: exportedLocal }
type exportType = "objLitDefault" | "objDeclDefault" | "named"
type exportedLocal = { exported: Identifier, local: Identifier }

export class ExportRegistry {
	private readonly namespace: Namespace;
	private readonly defaultExport: Identifier;
	private api:API

	private _hasDefaultExports: boolean = false;

	private _type: exportType = "named"
	private names: exportsMap = {}
	private overwritten: exportsMap = {}


	constructor(namespace: Namespace) {
		this.namespace = namespace;
		this.defaultExport = namespace.generateBestName('defaultExport')
	}

	hasDefaultExports(): boolean {
		return this._hasDefaultExports;
	}

	getDefaultIdentifier(): Identifier {
		return {type: "Identifier", name: this.defaultExport.name}
	}


	registerObjLiteral(objExpr: ObjectExpression): AssignmentExpression {
		this._hasDefaultExports = true;
		this.overwrittenByDefault()
		this._type = "objLitDefault";
		objExpr.properties.forEach(
			(prop: Property | SpreadElement) => {
				if (prop.type === "SpreadElement") { //should not happen
					throw new Error("Finally found a spread element in an OBJECT ")
				}
				let key
					= prop.key

				//should be the case due to sanitization step
				if (key.type === "Identifier" && prop.value.type === "Identifier") {
					this.addName(key, prop.value)
				} else {
					throw new Error("Found non Identifier Property key")
				}
			})
		return {
			type: "AssignmentExpression",
			right: objExpr,
			left: this.defaultExport,
			operator: '='
		}

	}

	getAPI():API{
		return this.api
	}

	registerObjDecl(objDecl) {
		this._hasDefaultExports = true;
		this.overwrittenByDefault()

		return {
			type: "AssignmentExpression",
			right: objDecl,
			left: this.defaultExport,
			operator: '='
		}

	}

	private registerName(varName:Identifier, rhs:Expression ){
		let id:Identifier
		if(this.names[varName.name]){
			return {
				type:"ExpressionStatement",
				expression:{
					type:"AssignmentStatement",
					left:this.names[varName.name].local,
					right:rhs,
					operation:"="
				}
			}
		}else{
			id = this.namespace.generateBestName(varName.name)
			this.addName(varName, id)
		}

		return {
			type:"VariableDeclaration",
			kind:"var",
			declarations:[
				{
					type:"VariableDeclarator",
					id:"",
					init:rhs
				}
			]
		}
	}


	private addName(exported: Identifier, local: Identifier = exported) {
		this.names[exported.name] = {exported, local}
	}

	overwrittenByDefault() {
		for (let name in this.names) {
			this.overwritten[name] = this.names[name];
		}
		this.names = {}
	}
	generateExports(isForcedDefault: boolean) {

		let stmts: Node[] = []
		if (this._hasDefaultExports || isForcedDefault) {
			if (!this.api){
			this.api = new API(API_TYPE.default_only);
		}
			if (isForcedDefault) {
				stmts.push({
					type: "ExpressionStatement",
					expression: {
						type: "AssignmentExpression",
						left: this.getDefaultIdentifier(),
						right: {
							type: "ObjectExpression",
							properties: []

						},
						operator: "="
					}

				})
			}

			if (this.names) {
				for (let name in this.names) {
					let stmt = this.createAssingmentTo(this.names[name].exported, this.names[name].local)
					stmts.push(stmt)
				}
			}
			stmts.push({type: "ExportDefaultDeclaration", declaration: this.getDefaultIdentifier()})
		} else {
			let _api_names:string[] = []
			if (!this.api) {
				this.api = new API(API_TYPE.named_only, _api_names);
			}
			let specifiers: ExportSpecifier[] = []
			for (let spec in this.names) {
				_api_names.push(this.names[spec].exported.name)
				specifiers.push({
					type: "ExportSpecifier",
					local: this.names[spec].local,
					exported: this.names[spec].exported
				})
			}
			if (specifiers) {
				let ex: ExportNamedDeclaration = {
					type: "ExportNamedDeclaration",
					specifiers: specifiers
				}
				stmts.push(ex)
			}
		}
		return stmts;
	}

	private createAssingmentTo(exported: Identifier, local: Identifier): Statement {
		return {
			type: "ExpressionStatement",
			expression: {
				type: "AssignmentExpression",
				left: {
					type: "MemberExpression",
					object: this.defaultExport,
					property: exported,
					computed: false
				},
				right: local,
				operator: "="
			}

		}

	}
}

let ast: Program
let js_text = getJSText()

ast = parseScript(js_text)
traverse(ast, getVisitor())


function getJSText(): string {
	return `
module.exports = {a:'z', b:require('path'),c:1, x:...}
`
}

function getVisitor(): Visitor {
	let registry: ExportRegistry = new ExportRegistry(null);
	return {
		enter: (node, parent) => {
			if (node.type === "AssignmentExpression"
				&& node.right.type === "ObjectExpression") {
				registry.registerObjLiteral(node.right)
			}
		}
	}

	function processProp(prop: Property) {

	}
}
