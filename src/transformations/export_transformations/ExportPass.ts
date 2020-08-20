import {replace, Visitor} from "estraverse";
import {
	AssignmentExpression,
	Directive,
	ExportDefaultDeclaration,
	ExportNamedDeclaration,
	ExportSpecifier,
	Expression,
	Identifier,
	MemberExpression,
	ModuleDeclaration,
	Node,
	ObjectExpression,
	Property,
	Statement,
	VariableDeclaration,
	VariableDeclarator
} from "estree";
import {id} from "../../abstract_fs_v2/interfaces";
import {JSFile} from "../../abstract_fs_v2/JSv2";
import {Namespace} from "../../abstract_fs_v2/Namespace";
import {Reporter} from "../../abstract_fs_v2/Reporter";
import {InfoTracker} from "../../InfoTracker";
import {API, API_TYPE} from "./API";

export interface ExportTypes {
	type: exportType
	default_exports?: ExportDefaultDeclaration
	named_exports?: ExportNamedDeclaration
}


interface ModuleDotExports extends MemberExpression {
	_type: "module.exports"
	object: { type: "Identifier", name: "module" }
	property: { type: "Identifier", name: "exports" }
	computed: false
}

interface ExportsNameAccess extends MemberExpression {
	_type: "named"
	object: { type: "Identifier", name: "exports" }
	property: Identifier
}

interface ModuleNameAccess extends MemberExpression {
	_type: "named"
	object: ModuleDotExports
	property: Identifier
}


interface ExportedAssignmentType {
	isDefault: boolean,
	id?: Identifier
}

type exportType = "default" | "named" | "none"

interface ETracker {
	type: exportType
	names: { [exported: string]: ExportSpecifier }
	defaultIdentifier: Identifier
}

function makeExSpecifier(local: string, exported: string): ExportSpecifier {
	return {
		type: "ExportSpecifier",
		local: id(local),
		exported: id(exported)
	}
}


class ExportPass {

	private exportTypes: ExportTypes
	private tracker: ETracker
	private readonly forcedDefault: boolean
	private namespace: Namespace;
	private js: JSFile;
	private api: API

	constructor(js: JSFile, isForcedDefault: boolean) {
		this.forcedDefault = isForcedDefault
		let _type: exportType = isForcedDefault ? "default" : "none"
		this.exportTypes = {type: _type}
		this.tracker = {type: _type, names: {}, defaultIdentifier: null}
		this.namespace = js.getNamespace()
		this.js = js

		this.api = this.js.getApi()
		if (this.api.getType()===API_TYPE.default_only ){
			this.forcedDefault = true;
		}
	}
	//
	// private getAPI(): API {
	// 	return .resolveSpecifier(this.js)
	// }

	build(): ExportNamedDeclaration | ExportDefaultDeclaration | null | undefined {


		let declaration: ExportNamedDeclaration | ExportDefaultDeclaration

		function createProperty(es: ExportSpecifier): Property {
			return {
				kind: 'init',
				method: false,
				type: "Property",
				key: es.exported,
				value: es.local,
				shorthand: false,
				computed: false
			}

		}


		let reporter = this.js.getReporter()
		let mli = reporter.addMultiLine('export_name_report' )
 		switch (this.tracker.type) {

			case "default":
				if (this.js.getRelative() === 'lib/main.js') {
					// console.log(`____ ${this.tracker.type}`)
				}
				declaration = {
					type: "ExportDefaultDeclaration",
					declaration: this.tracker.defaultIdentifier
				}
				// api = new API(API_TYPE.default_only)
				this.api.setType(API_TYPE.default_only)
				mli.data[this.js.getRelative()] = ['default']

				return declaration
			case "named":
				if (this.js.getRelative() === 'lib/main.js') {
					// console.log(`____ ${this.tracker.type}`)
				}

				if (this.forcedDefault  ) {
					let objExpr: ObjectExpression = {type: "ObjectExpression", properties: []}
					let names: string[] = []
					for (let name in this.tracker.names) {
						let exported = this.tracker.names[name]
						objExpr.properties.push(createProperty(exported))
						names.push(exported.exported.name)
					}
					let declaration: ExportDefaultDeclaration = {
						type: "ExportDefaultDeclaration",
						declaration: objExpr
					}
					mli.data[this.js.getRelative()] = ['default']
					this.api.setType(API_TYPE.default_only)
					this.api.setNames(names)
					return declaration
				} else {
					return this.createNamedExports();
				}
				break;
		}
	}

	private createNamedExports(): ExportNamedDeclaration {


		let names: string[] = []
		let specifiers: ExportSpecifier[] = []
  		let mli = this.js.getReporter().addMultiLine( Reporter.ExportNames)
		for (let name in this.tracker.names) {
			let val: ExportSpecifier = this.tracker.names[name]
			names.push(val.exported.name)
			specifiers.push(val)
		}
		// let api = new API(API_TYPE.named_only, names)
		this.api.setType(API_TYPE.named_only)
		this.api.setNames(names)
		mli.data[this.js.getRelative()] = names

		if (this.js.getRelative() === 'lib/main.js') {
			// console.log(`____ ${this.tracker.type}`)
		}
		let declaration: ExportNamedDeclaration = {type: "ExportNamedDeclaration", specifiers: specifiers}
		return declaration
	}

	getLocalID(exported: string) {
		if (!exported) {
			throw new Error('passed value was undefined in getLocalID()')
		} else if (!this.tracker.names[exported]) {
			let str = `exported value ${exported} had no local`
			throw new Error(str)
		} else {

			return this.tracker.names[exported].local
		}
	}

	hasLocalID(exported: string) {
		// console.log(`requesting ${exported} which is ${this.tracker.names[exported] ? this.tracker.names[exported] : "undefined or null"} `)
		return this.tracker.names[exported]
	}

	clear(): void {
		this.tracker = {
			defaultIdentifier: this.tracker.defaultIdentifier,
			names: {},
			type: this.forcedDefault
				? "default" : "none"
		} as ETracker
	}

	registerDefault(name: Identifier = null): void {
		this.clear()
		this.tracker.type = "default"
		if (name && (!this.tracker.defaultIdentifier)) {
			this.tracker.defaultIdentifier = this.namespace.getDefaultExport();
		}
	}

	registerName(local: string, exported: string): void {
		// console.log(this.tracker.type)
		// console.log(`registering local:${local}  :  export:${exported} ${this.tracker.type}`)
		if (this.tracker.type !== "default" ) {

			this.tracker.type = "named"
		}
		this.tracker.names[exported] = makeExSpecifier(local, exported);

	}

	//
	// registerObjectLiteral(obj: ObjectExpression): void {
	// 	throw new Error()
	// 	obj.properties.forEach(prop => {
	// 		if (prop.type === "Property") {
	// 			if (prop.key && prop.value
	// 				&& prop.key.type === "Identifier"
	// 				&& prop.value.type === "Identifier"
	// 			) {
	// 				// let local =this.namespace.generateBestName( prop.value.name )
	// 				// this.registerName(name , prop.key.name)
	// 				//
	// 			}
	// 		}
	// 	});
	// }

}


export function __exports(js: JSFile) {
	const infoTracker: InfoTracker = js.getInfoTracker();
	let namespace: Namespace = js.getNamespace();
	let expType = infoTracker.getExportType() === API_TYPE.default_only
	let __default_exports_id: Identifier = null;
	// if (js.getAPIMap().forceMap()[js.getRelative()]) {
	// 	expType = true ;//fixme
	// }
	let exportPass: ExportPass = new ExportPass(js, expType)
	let indicesToRemove: number[] = []
	type adder = (e: (Directive | Statement | ModuleDeclaration)) => void
	let add: adder;

	function setDefaultID() {
		if (!__default_exports_id) {
			__default_exports_id = namespace.getDefaultExport()
		}
	}

	js.getAST().body.forEach((node: (Directive | Statement | ModuleDeclaration), index: number, arr: (Directive | Statement | ModuleDeclaration)[]) => {
		let debug = ""
		add = (elem) => 1 + index ? arr.push(elem) : arr.splice(index, 0, elem)
 		if (node.type === "ExpressionStatement"
			&& node.expression.type === "AssignmentExpression"
			&& node.expression.left.type === "MemberExpression"
		) {
			let right: Expression = node.expression.right;
			let modExp: ExportedAssignmentType = __deterimineExportType(node.expression.left);
			if ((modExp && modExp.isDefault)) {
				setDefaultID();
				switch (right.type) {
					case "ObjectExpression":

						exportPass.clear()
						pushObj(node.expression, right)

						break;
					default:
						node.expression.left = __default_exports_id

						exportPass.registerDefault(__default_exports_id)
						break;
				}
			} else if (modExp) {
				//named exports
				let exported: Identifier = modExp.id

				let local: Identifier
				let rhs: Expression = node.expression.right
				let dcln: VariableDeclaration
				let preexisting: Identifier
				if (exportPass.hasLocalID(exported.name)) {
					preexisting = exportPass.getLocalID(exported.name)
					if (preexisting) {
						// console.log(`_exname: ${preexisting.name}`)
						node.expression.left = preexisting
					}
					// console.log(`exname: ${preexisting.name}`)
				}
				if (rhs.type === "Identifier") {

					if (rhs.name === exported.name) {
						// arr.splice(index, 1)
						arr[index] = {type:"EmptyStatement" }
						exportPass.registerName(rhs.name,exported.name )
					} else {

						exported = namespace.generateBestName(exported.name)
						dcln = createVarD(exported, rhs)
						arr[index] = dcln
						exportPass.registerName(rhs.name, exported.name)
					}


				} else {
					local = preexisting;
					if (!preexisting) {
 						local = exported;
						if (!(exportPass.hasLocalID(exported.name))) {

							local = namespace.generateBestName(exported.name)
 						}
 						dcln = createVarD(local, rhs)
						arr[index] = dcln
					}
					exportPass.registerName(local.name, exported.name)


				}

			}

		}
		exReplace(node)


	});


	function pushObj(expression: AssignmentExpression, assigned: ObjectExpression) {
		let properties = assigned.properties
		// expression.right = {type: "ObjectExpression", properties: []}
		expression.left = __default_exports_id

		properties.forEach(prop => {
			// console.log(`processing ${generate(prop)}`)

			if (prop.type === "Property" && prop.key && prop.value
				&& prop.key.type === "Identifier") {

				let local: Identifier
				let exported: Identifier = prop.key

				if (prop.value.type !== "Identifier" || (prop.key.name !== prop.value.name)) {

					local = namespace.generateBestName(exported.name)
					let declarator: VariableDeclarator = {
						type: "VariableDeclarator",
						id: local,
						init: prop.value as Expression
					}
					let decl: VariableDeclaration = {
						type: "VariableDeclaration",
						declarations: [declarator],
						kind: 'const'
					}
					// console.log(`inserting declaration ${generate(decl)}`)

					add(decl)
				} else {
					local = prop.value
					exported = prop.key
				}
				exportPass.registerName(local.name, exported.name)
				// console.log(` registering names local:${local.name}    and exported:${exported.name}`)

			}
		})
	}

	function __deterimineExportType(test: MemberExpression): ExportedAssignmentType | null {
		if ((!test) || (!test.object) || (!test.property) || (test.property.type !== "Identifier")) {
			return null;
		} else {
			if (test && test.object && test.object.type === "Identifier") {
				if (test.object.name === "exports") {
					return {isDefault: false, id: test.property}
				} else if (test.object.name === "module"
					&& test.property.name === "exports") {


					return {isDefault: true}
				}
			} else if (test.object.type === "MemberExpression"
				&& test.object.object.type === "Identifier"
				&& test.object.property.type === "Identifier"
				&& test.object.object.name === "module"
				&& test.object.property.name === "exports"
			) {
				// console.log(`prop:${test.property.name}`)
				return {isDefault: false, id: test.property}
			}
		}
	}

	// let exData =
	let ex_decl = exportPass.build()
	if (ex_decl && (
		(ex_decl.type === "ExportDefaultDeclaration" && ex_decl.declaration)
		|| (ex_decl.type === "ExportNamedDeclaration"))) {
		// console.log(generate(ex_decl))
		js.getAST().body.push(ex_decl)
	}

	if (__default_exports_id) {
		let decl: VariableDeclaration = {
			type: "VariableDeclaration",
			kind: "var",
			declarations: [{
				type: "VariableDeclarator",
				id: __default_exports_id,
				init: {type: "ObjectExpression", properties: []}
			}]
		}
		js.getAST().body.splice(0, 0, decl)
	}


	function exReplace(node: Node) {
		let exREplaceVisitor: Visitor = {
			leave: (node, parent) => {

				if (node.type === "MemberExpression" && node.property.type === "Identifier") {
					if (node.object.type === "Identifier") {
						if (node.object.name === "module" && node.property.name === "exports" && parent && parent.type !== "MemberExpression") {
							return __default_exports_id
						} else if (node.object.name === "exports") {
							if (exportPass.hasLocalID(node.property.name)) {
								return exportPass.getLocalID(node.property.name)
							} else {
								setDefaultID();
								node.object = __default_exports_id
							}
						}

					} else if (
						node.object.type === "MemberExpression"
						&& node.object.object.type === "Identifier"
						&& node.object.property.type === "Identifier"
						&& node.object.object.name === "module"
						&& node.object.property.name === "exports"
					) {
						// console.log(`accessing property: ${node.property.name} in loc :\t  ${generate(node)} `)
						if (exportPass.hasLocalID(node.property.name)) {
							return exportPass.getLocalID(node.property.name)
						} else {
							setDefaultID();
							node.object = __default_exports_id
						}
					}
				}

			}
		};
		replace(node, exREplaceVisitor)
	}

}



function createVarD(identifier: Identifier, ex: Expression): VariableDeclaration {
	return {
		type: "VariableDeclaration",
		kind: "var",
		declarations: [
			{
				type: "VariableDeclarator",
				id: identifier,
				init: ex
			}
		]
	}
}


