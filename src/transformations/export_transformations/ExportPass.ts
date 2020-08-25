import assert from "assert";
import {replace, Visitor} from "estraverse";
import {
	AssignmentExpression,
	Directive,
	ExportDefaultDeclaration,
	ExportNamedDeclaration,
	ExportSpecifier,
	Expression,
	ExpressionStatement,
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
	type: API_TYPE
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


interface ETracker {
	type: API_TYPE
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

	private tracker: ETracker
	private readonly forcedDefault: boolean
	private namespace: Namespace;
	private js: JSFile;
	private api: API

	constructor(js: JSFile, isForcedDefault: boolean) {

		this.namespace = js.getNamespace()
		this.js = js
		this.api = js.getApi()
		this.forcedDefault = this.js.getApi().isForced()

		this.tracker = {
			type: this.forcedDefault ? API_TYPE.default_only : API_TYPE.none,
			names: {},
			defaultIdentifier: null
		}
	}


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

		let exprs: ExpressionStatement[] = []
		let reporter = this.js.getReporter()
		let mli = reporter.addMultiLine('export_name_report')
		// if (this.js.getRelative().includes('format.js')) {
		// 	console.log('fd' + this.tracker.type)
		// 	console.log('fd' + this.forcedDefault)
		// }
		if (this.forcedDefault) {
			switch (this.tracker.type) {
				case API_TYPE.default_only:

					break;
				case API_TYPE.named_only:

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
				case API_TYPE.none:
					break;
			}
		}
		// this.js.getAPIMap().resolveSpecifier(js,)
		switch (this.tracker.type) {


			case API_TYPE.default_only:

				declaration = {
					type: "ExportDefaultDeclaration",
					declaration: this.tracker.defaultIdentifier
				}
				// api = new API(API_TYPE.default_only)
				this.api.setType(API_TYPE.default_only)
				mli.data[this.js.getRelative()] = ['default']
				let body = this.js.getAST().body
				for (let name in this.tracker.names) {
					let spec: ExportSpecifier = this.tracker.names[name]
					let exported = spec.exported.name
					let local = spec.local.name
					let assign: AssignmentExpression = {
						type: "AssignmentExpression",
						operator: "=",
						left: {
							type: "MemberExpression",
							object: this.namespace.getDefaultExport(),// {type:"Identifier",name:},
							property: {type: "Identifier", name: exported},
							computed: false
						},
						right: {type: "Identifier", name: local}
					}
					body.push({
						type: "ExpressionStatement",
						expression: assign
					})
				}


				return declaration
			case API_TYPE.named_only:

				//
				// if (this.js.getRelative().includes('format.js')) {
				// 	console.log(`reached`)
				// }
				return this.createNamedExports();

		}
	}

	private createNamedExports(): ExportNamedDeclaration {


		let names: string[] = []
		let specifiers: ExportSpecifier[] = []
		let mli = this.js.getReporter().addMultiLine(Reporter.ExportNames)
		for (let name in this.tracker.names) {
			let val: ExportSpecifier = this.tracker.names[name]
			names.push(val.exported.name)
			specifiers.push(val)
		}
		let _api: API = this.js.getAPIMap().resolveSpecifier(this.js, this.js.getRelative())
		// let api = new API(API_TYPE.named_only, names)
		this.api.setType(API_TYPE.named_only)
		this.api.setNames(names)
		try {
			assert(this.api.getType() === API_TYPE.named_only, this.api.getType() + "")
		} catch (e) {
			console.log("ERR :: ")
			console.log(this.api)
			throw e
		}
		mli.data[this.js.getRelative()] = names


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
		return this.tracker.names[exported]
	}

	clear(objExpr: boolean = false): void {
		// if (this.js.getRelative().includes('format.js')) {
		// 	console.log('fd' + this.forcedDefault)
		// }
		this.tracker = {
			defaultIdentifier: this.tracker.defaultIdentifier,
			names: {},
			type: this.forcedDefault
				? "default" : "none"
		} as ETracker
	}

	registerDefault(name: Identifier = null): void {
		this.js.report().addDefaultExport(this.js)
		this.clear()
		this.tracker.type = API_TYPE.default_only
		if (name && (!this.tracker.defaultIdentifier)) {
			this.tracker.defaultIdentifier = this.namespace.getDefaultExport();
		}
	}

	registerName(local: string, exported: string): void {
		this.js.report().addNamedExport(this.js)
		//
		// if (this.js.getRelative().includes('format.js')) {
		// 	console.log('format' + this.tracker.type)
		// }
		if (this.tracker.type !== API_TYPE.default_only) {

			this.tracker.type = API_TYPE.named_only
		}
		this.tracker.names[exported] = makeExSpecifier(local, exported);

	}


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
	js.setAsModule()

	function setDefaultID() {
		if (!__default_exports_id) {
			__default_exports_id = namespace.getDefaultExport()
		}
	}

	let body = js.getAST().body

	let insertIndicesDecl: number[] = []
	let objDeclReplaceMap: { [key: number]: VariableDeclaration[] } = {}

	body.forEach((node: (Directive | Statement | ModuleDeclaration), index: number, arr: (Directive | Statement | ModuleDeclaration)[]) => {


		let debug = ""
		if (node.type === "ExpressionStatement"
			&& node.expression.type === "AssignmentExpression"
		) {

			if (
				node.expression.left.type === "Identifier"
				&& node.expression.left.name === "exports"
				&& node.expression.right.type === "AssignmentExpression"
				&& node.expression.operator === "="
				&& node.expression.right.operator === "="

				&& node.expression.right.left.type === "MemberExpression"
				&& node.expression.right.left.object.type === "Identifier"
				&& node.expression.right.left.property.type === "Identifier"
				&& node.expression.right.left.object.name === "module"
				&& node.expression.right.left.property.name === "exports"
			) {
				setDefaultID();

				switch (node.expression.right.right.type) {
					case "ObjectExpression":
						exportPass.clear()
						insertIndicesDecl.push(index)
						objDeclReplaceMap[index] = pushObj(node.expression, node.expression.right.right)

						break;

					default:
						node.expression.left = __default_exports_id
						node.expression.right = node.expression.right.right
						exportPass.registerDefault(__default_exports_id)

						break
				}
			} else if (node.expression.left.type === "MemberExpression") {

				let right: Expression = node.expression.right;
				let modExp: ExportedAssignmentType = __deterimineExportType(node.expression.left);
				if ((modExp && modExp.isDefault)) {
					setDefaultID();
					switch (right.type) {
						case "ObjectExpression":

							exportPass.clear()
							insertIndicesDecl.push(index)
							objDeclReplaceMap[index] = pushObj(node.expression, right)

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
							node.expression.left = preexisting
						}
					}


					if (rhs.type === "Identifier") {

						if (rhs.name === exported.name) {
							// arr.splice(index, 1)
							arr[index] = {type: "EmptyStatement"}
							exportPass.registerName(rhs.name, exported.name)
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
							} else {

							}
							dcln = createVarD(local, rhs)
							arr[index] = dcln
						}
						exportPass.registerName(local.name, exported.name)


					}

				}

			}
		}

		exReplace(node)


	});


	insertIndicesDecl.reverse().forEach(e => {
		objDeclReplaceMap[e].reverse().forEach(v => {

			body.splice(e, 0, v)
		});

	});

	function pushObj(expression: AssignmentExpression, assigned: ObjectExpression): VariableDeclaration[] {
		let properties = assigned.properties
		// expression.right = {type: "ObjectExpression", properties: []}
		expression.left = __default_exports_id

		let toAdd: VariableDeclaration[] = []
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
					prop.value = local
					// console.log(`inserting declaration ${generate(decl)}`)
					toAdd.push(decl)
				} else {
					local = prop.value
					exported = prop.key
				}
				exportPass.registerName(local.name, exported.name)
				// console.log(` registering names local:${local.name}    and exported:${exported.name}`)

			}
		});
		return toAdd;
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


