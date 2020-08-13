import {generate} from "escodegen";
import {
	ExportDefaultDeclaration,
	ExportNamedDeclaration,
	ExportSpecifier,
	Identifier,
	ObjectExpression,
	Property
} from "estree";
import {id} from "../../abstract_fs_v2/interfaces";
import {JSFile} from "../../abstract_fs_v2/JSv2";
import {InfoTracker} from "../../InfoTracker";
import {API} from "./API";

// interface ExportIdentifier extends ExportSpecifier{
// 	// type:"ExportSpecifier"
// }

// interface ExportMap {
// 	[name: string]: ExportSpecifier
// }

export interface ExportTypes {
	type: API_TYPE//"default" | "named" | "synthetic" | "none"
	default_exports?: ExportDefaultDeclaration
	named_exports?: ExportNamedDeclaration
}


interface ExportBuilderI {
	clear(): void;

	/**
	 * case where there is an expression but no name... names is the default test_resources.export name for the 'named' portion.
	 * @param names named test_resources.export name.
	 * @param value expression/declaration value
	 */
	registerDefault(names: Identifier): void;

	registerObjectLiteral(obj: ObjectExpression): void;

	registerName(spec: ExportSpecifier): void;

	build(): void;
}

export class ExportBuilder implements ExportBuilderI {
	private infoTracker: InfoTracker;
	private js : JSFile;
	getBuilt(): ExportTypes {
		return this.builtVals
	}

	private exportList: ExportSpecifier[] = [];
	// private defaultIdentifier: Identifier;
	private exportNameValue: { [name: string]: ExportSpecifier } = {};
	private defaultExport: Identifier = null;
	private api_type: API_TYPE
	private api: API = null;
	private builtVals: ExportTypes = null

	constructor(js:JSFile, infoTracker:InfoTracker, api_type: API_TYPE.default_only  = undefined) {
		this.infoTracker = infoTracker
		this.js = js;
		if (api_type) {
			this.api_type = api_type;
		}else{
			this.api_type = API_TYPE.none
		}
	}

	getFromExported(exported: string) {
		let local = this.exportNameValue[exported]
		return local.local ? local.local : local.exported
	}

	getDefaultExportIdentifier() {
		return this.defaultExport;
	}


	clear() {
		this.exportList = [];
		this.exportNameValue = {};
	}

	//todo test
	getByName(name: string): ExportSpecifier {

		return  this.exportNameValue[name]?this.exportNameValue[name]: {type:"ExportSpecifier", local:this.defaultExport, exported:id('default')};
	}


	/**
	 * case where there is an expression but no name... names is the default test_resources.export name for the 'named' portion.
	 * @param names named test_resources.export name.
	 * @param value expression/declaration value
	 */
	registerDefault(names: Identifier): void {
		// if (this.defaultExport) {
		this.clear();
		// }

		this.defaultExport = names;
	}

	registerObjectLiteral(obj: ObjectExpression) {

		obj.properties.forEach(prop => {
			//preprocessing says these are all properties id:id
			prop = (prop as Property)
			let exported = prop.key as Identifier
			let local = (prop.value as Identifier)
			// 	{
			// 	type:"MemberExpression",
			// 	object:this.defaultExport,
			// 	property:(prop.value as Identifier)
			// }
			console.log(generate({type: "ExportSpecifier", exported, local}))
			this.registerName({type: "ExportSpecifier", exported, local})
		});
	}

	registerName(spec: ExportSpecifier) {
		if (this.exportNameValue[spec.exported.name]) {
			console.log(spec.exported.name + " exists ")
			return;
		}
		// let exportsTmp:ExportSpecifier = {
		// 	exported: names.exported_name,
		// 	local: names.local_alias
		// }
		this.exportList.push(spec);
		this.exportNameValue[spec.exported.name] = spec;
	}

	build(): void {

		//noExports
		if (!this.defaultExport && !this.exportList.length) {
			this.builtVals = {type: API_TYPE.none};
			this.api = new API(API_TYPE.none, null)
			return;
		}
		//no preferred api type
		if (this.api_type === API_TYPE.none && (this.defaultExport || this.exportList)) {
			this.api_type = this.defaultExport ? API_TYPE.default_only : API_TYPE.named_only
		}
		this.generateAPI();
		this.buildExports();
	}


	private buildExports( ) {
		switch (this.api_type) {
			case API_TYPE.named_only:
				this.builtVals = this.createNamedExportDeclaration();
				break;
			case API_TYPE.default_only:
				this.builtVals = this.buildDefaultExportDeclaration()

				break;
		}
	}

	private createNamedExportDeclaration():ExportTypes {
		console.log(this.exportList.length)

		return {
			type: API_TYPE.named_only,
			named_exports: {
				type: "ExportNamedDeclaration",
				specifiers: this.exportList,
				declaration: null,
				source: null
			}
		};
	}

	private buildDefaultExportDeclaration():ExportTypes {
		console.log(this.exportList.length)

		let default_object: ObjectExpression = {type: "ObjectExpression", properties: []}
		this.exportList.forEach(e => {
			if (default_object) {
				default_object.properties.push(this.createProperty(e))
			}
		});
		return {
			type: API_TYPE.default_only,
			default_exports: {
				type: "ExportDefaultDeclaration",
				declaration:
					this.defaultExport ? this.defaultExport : default_object
			}
		};
	}

	private generateAPI() {

			let api = new API(this.api_type);

		//use specified api type to test_resources.export specified names
		switch (api.getType()) {
			case API_TYPE.default_only:
				// api.getExports().push('default')
				break;
			case API_TYPE.named_only:
				break;
			case API_TYPE.synthetic_named:
				// api.getExports().push('defaul/t')
				break;
		}
		if (api.getType() !== API_TYPE.default_only) {
			this.exportList.forEach(spec_name => {
				api.getExports().push(spec_name.exported.name)
			})
		}
		this.api = api
	}

	getAPI(): API {
		return this.api
	}

	// private populateNames(  objEx: ObjectExpression = null) {
	//
	//
	//
	// }


	private createProperty(e: ExportSpecifier): Property {
		return {
			type: "Property",
			key: e.exported,
			value: e.local,
			kind: "init",
			method: false,
			shorthand: e.local.name === e.exported.name,
			computed: false
		};
	}

	// getDefaultIdentifier() {
	// 	return this.defaultIdentifier;
	// }
}

// export interface exportNaming {
// 	exported_name: string
// 	local_alias: string
// }


export enum API_TYPE {
	default_only = "default",
	named_only = "named",
	// this is when the assigned properties are exported as namnes as well
	synthetic_named = "synthetic",
	// builtIn = "built in",
	none = "none"
}
