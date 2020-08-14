import exp from "constants";
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
import {id} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {Namespace} from "../../../abstract_fs_v2/Namespace";
import {InfoTracker} from "../../../InfoTracker";
import {API} from "../API";
import {API_TYPE} from "../ExportsBuilder";

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

interface DirectAssignment extends AssignmentExpression {
	left: ModuleDotExports
}

type anExport = ExportsNameAccess | ModuleNameAccess | ModuleDotExports


interface ExportedAssignmentType {
	isDefault: boolean,
	id?: Identifier
}

type exportType = "default" | "named" | "none"

interface ExportBuilderI {
	clear(): void;


	registerDefault(names: Identifier): void;

	// registerObjectLiteral(obj: ObjectExpression): void;

	registerName(local: string, exported: string): void;

	// build(): ExportNamedDeclaration | ExportDefaultDeclaration;
}

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

interface ExportReturns {
	api: API,
	declaration: ExportNamedDeclaration | ExportDefaultDeclaration
}

class ExportPass {

	private exportTypes: ExportTypes
	private tracker: ETracker
	private readonly forcedDefault: boolean
	private namespace: Namespace;

	constructor(isForcedDefault: boolean, namespace: Namespace) {
		this.forcedDefault = isForcedDefault
		let _type: exportType = isForcedDefault ? "default" : "none"
		this.exportTypes = {type: _type}
		this.tracker = {type: _type, names: {}, defaultIdentifier: null}
		this.namespace = namespace
	}

	build(): ExportReturns {
		let api: API

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

		switch (this.tracker.type) {
			case "default":
				declaration = {
					type: "ExportDefaultDeclaration",
					declaration: this.tracker.defaultIdentifier
				}
				api = new API(API_TYPE.default_only)
				return {api, declaration}
			case "named":

				let  __ret: ExportReturns

				if (this.forcedDefault) {
					let objExpr: ObjectExpression = {type: "ObjectExpression", properties: []}
					let names:string[] = []
					for (let name in this.tracker.names) {
						let exported = this.tracker.names[name]
						objExpr.properties.push(createProperty(exported))
						names.push(exported.exported.name )
					}
				let declaration:ExportDefaultDeclaration  = {
					type:"ExportDefaultDeclaration",
					declaration:objExpr
				}
					let api = new API(API_TYPE.default_only,names, false )
					__ret = {api, declaration}
				}else{
					__ret=  this.createNamedExports();
				}
				return __ret

			default:
				api = new API(API_TYPE.none)
				return {api, declaration: null}
		}
	}

	private createNamedExports(): ExportReturns {
		let names: string[] = []
		let specifiers: ExportSpecifier[] = []

		for (let name in this.tracker.names) {
			let val: ExportSpecifier = this.tracker.names[name]
			names.push(val.exported.name)
			specifiers.push(val)
		}
		let api = new API(API_TYPE.named_only, names)
		let declaration: ExportNamedDeclaration = {type: "ExportNamedDeclaration", specifiers: specifiers}
		return {api, declaration};
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
		if (this.tracker.type !== "default") {

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
	let exportPass: ExportPass = new ExportPass(expType, namespace)
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
		// console.log(`processing node ${generate(node)}`)
		if (node.type === "ExpressionStatement"
			&& node.expression.type === "AssignmentExpression"
			&& node.expression.left.type === "MemberExpression"
		) {
			let right: Expression = node.expression.right;
			let modExp: ExportedAssignmentType = __deterimineExportType(node.expression.left);
			if (modExp && modExp.isDefault) {
				setDefaultID();
				switch (right.type) {
					case "ObjectExpression":
						// console.log(`detected direct assign in id of type ${assigned.type}`)

						exportPass.clear()
						pushObj(node.expression, right)

						break;
					default:
						node.expression.left = __default_exports_id
						// console.log(`resassigned left to create expr ${generate(node)}`)

						exportPass.registerDefault(__default_exports_id)
						break;
				}
			} else if (modExp) {
				//named exports
				let exported: Identifier = modExp.id
				// console.log(`from id: ${modExp.id.name}`)
				// console.log(`exported name: ${exported.name}`)
				//
				// console.log(modExp.id.name)
				let local: Identifier
				let rhs: Expression = node.expression.right
				let dcln: VariableDeclaration
				let preexisting: Identifier
				if (exportPass.hasLocalID(exported.name)) {
					preexisting = exportPass.getLocalID(exported.name)
					if (preexisting) {
						console.log(`_exname: ${preexisting.name}`)
						node.expression.left = preexisting
					}
					console.log(`exname: ${preexisting.name}`)
				}
				if (rhs.type === "Identifier") {

					if (rhs.name === exported.name) {
						arr.splice(index, 1)
					} else {

						exported = namespace.generateBestName(exported.name)
						dcln = createVarD(exported, rhs)
						arr[index] = dcln
						exportPass.registerName(rhs.name, exported.name)
					}


				} else {
					local = preexisting;
					if (!preexisting) {
						// console.log(`exportedname: ${exported.name}`)
						local = exported;
						if (!(exportPass.hasLocalID(exported.name))) {

							local = namespace.generateBestName(exported.name)
							console.log(`reset local b/c haslocalid of exported.name: ${local.name}`)
						} else {
							console.log(`exported: ${exported.name}`)
							console.log(`local: ${local.name}`)

						}
						// console.log(`localized: ${local.name}`)
						dcln = createVarD(local, rhs)
						arr[index] = dcln
					}
					exportPass.registerName(local.name, exported.name)


				}

			}

		}
		// console.log(`attempting to handle replacement at node: ${generate(node)}`)

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

	let exData = exportPass.build()
	let ex_decl = exData.declaration
	if (ex_decl && ((ex_decl.type === "ExportDefaultDeclaration" && ex_decl.declaration)
		|| (ex_decl.type === "ExportNamedDeclaration"))) {
		js.getAST().body.push(ex_decl)
	} else {
		// console.log('')
	}
	js.setAPI(exData.api)
///////////////////////////////////// 	exReplace(js)
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
	// console.log(exData.api.getType())
	// if(js.getRelative().includes('main')){
	// // console.log(   generate(js.getAST())    )
	// 	process.exit(0)
	// }


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
				// if (node.type === "MemberExpression") {
				//
				// 	let _type: ExportedAssignmentType = __deterimineExportType(node)
				// 	if (_type) {
				//
				// 		if (_type.isDefault) {
				// 			if (parent && parent.type === "MemberExpression") {
				// 				_type = __deterimineExportType(parent, true)
				// 			}
				// 			if (_type && !_type.isDefault) {
				// 				return __default_exports_id
				// 			} else {
				// 				return __default_exports_id
				// 			}
				//
				// 		}
				// 		//  else if (  parent && parent.type !== "MemberExpression"){
				// 		// 	return exportPass.getLocalID(_type.id.name)
				// 		// }
				//
				// 	}
				// }
			}
		};
		replace(node, exREplaceVisitor)
	}

}


// @ts-ignore
// console.log(parseScript(`let x = {a, b:c}`).body[0].declarations[0].init.properties.forEach((prop: Property) => {
// 	console.log(prop)
// }));
//
// // @ts-ignore
// let ms = parseScript('module.exports.a').body[0].expression
// console.log((ms as ModuleDotExports).object)
//
// let tests = `
// module.exports = "direct assignment"
// module.exports.x = "m.e named assignment"
// exports.x = "exports named assignment"
// module.exports.x.y = "NULL m.e named assignment red herring"
// exports.x.y = "NULL exports named assignment red herring"
// `
// let _tests: AssignmentExpression[] = []
// parseScript(tests).body.forEach(e => {
// 	// @ts-ignore
// 	console.log(e.expression.left.object.type)
// 	_tests.push((e as ExpressionStatement).expression as AssignmentExpression)
// })
// _tests.forEach(e => {
// 	let testval = e.left
// 	let expected = generate(e.right)
// 	let actual = __deterimineExportType(testval as MemberExpression)
//
// 	console.log(`${generate(testval)} was determined to be a(n) ${actual ? actual.name : "null"} with expected : ${expected}`)
// })
//
///ts-ignore
// console.log(JSON.stringify((parseScript(`var x = {x:function(){}}`).body[0].declarations[0].init.properties), null, 2)
// )


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


