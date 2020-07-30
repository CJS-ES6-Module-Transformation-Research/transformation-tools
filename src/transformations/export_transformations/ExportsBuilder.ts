import {
	ExportDefaultDeclaration,
	ExportNamedDeclaration,
	ExportSpecifier,
	Identifier,
	ObjectExpression,
	Property
} from "estree";
import {API} from "./API";

interface ExportIdentifier {
	exported_name: string
	local_alias?: string
}

interface ExportMap {
	[name: string]: ExportIdentifier
}

export interface ExportTypes {
	type: "default" | "named" | "synthetic" | "none"
	default_exports?: ExportDefaultDeclaration
	named_exports?: ExportNamedDeclaration
}


export class ExportBuilder {
    getBuilt() {
		return this.builtVals
    }

	private exportList: ExportIdentifier[] = [];
	private defaultIdentifier: Identifier;
	private exportNameValue: ExportMap = {};
	private defaultExport: Identifier = null;
	private api_type: API_TYPE
	private api: API = null;
	private builtVals:ExportTypes = null
	constructor(api_type: API_TYPE.default_only | API_TYPE.synthetic_named = undefined) {
		if (api_type) {
			this.api_type = api_type;
		}
	}

	clear() {
		this.exportList = [];
		this.exportNameValue = {};
		this.defaultIdentifier = null;

	}

	//todo test
	getByName(name: string): Identifier {
		let theNamed = this.exportNameValue[name];
		if (theNamed) {
			return {
				name: theNamed.exported_name,
				type: "Identifier"
			}
		}
		return null;
	}


	/**
	 * case where there is an expression but no name... names is the default export name for the 'named' portion.
	 * @param names named export name.
	 * @param value expression/declaration value
	 */
	registerDefault(names: Identifier): void {
		// if (this.defaultExport) {
		this.clear();
		// }

		this.defaultExport = names;
	}

	registerName(names: exportNaming) {
		if (this.exportNameValue[names.exported_name]) {
			return;
		}
		let exportsTmp = {
			exported_name: names.exported_name,
			local_alias: names.local_alias
		}
		this.exportList.push(exportsTmp);
		this.exportNameValue[names.exported_name] = exportsTmp;
	}

	build(rebuild:boolean=false):void {

		if (this.builtVals && (!rebuild )){
			return
		}

		let exports: ExportTypes = {type: "none"};

		// no exports
		if (!this.defaultExport && !this.exportList.length) {
			this.builtVals= exports;
			return;
		}

		//no preferred api type
		if (!this.api_type) {
			this.api_type = this.defaultExport ? API_TYPE.default_only : API_TYPE.named_only
		}

		//creater api
		// this.api = {exports: [], type: this.api_type}
		let api = new API(this.api_type);
		//create empty specifier and default
		let specifier_names: ExportSpecifier[] = [];
		let default_object: ObjectExpression = {type: "ObjectExpression", properties: []}


		this.populateNames(specifier_names, default_object)

		//use specified api type to export specified names
		switch (api.getType()) {
			case API_TYPE.default_only:
				api.getExports().push('default')
				break;
			case API_TYPE.named_only:
				break;
			case API_TYPE.synthetic_named:
				api.getExports().push('default')
				break;
		}
		if (api.getType() !== API_TYPE.default_only) {
			specifier_names.forEach(spec_name => {
				api.getExports().push(spec_name.exported.name)
			})
		}


		switch (this.api_type) {
			case API_TYPE.named_only:
				exports.named_exports = {
					type: "ExportNamedDeclaration",
					specifiers: specifier_names,
					declaration: null,
					source: null
				};
				break;
			case API_TYPE.default_only:
				exports.default_exports = {
					type: "ExportDefaultDeclaration",
					declaration:
						this.defaultExport ? this.defaultExport : default_object
				}

				break;
		}
		this.api = api
		this.builtVals= exports;
	}




	getAPI():API{
		return this.api
	}

	private populateNames(specifiers: ExportSpecifier[], objEx: ObjectExpression = null) {

		this.exportList.forEach(e => {
			let {exported, local} = this.extractSpecData(e);

			if (objEx) {
				objEx.properties.push(this.createProperty(exported, local, e))
			}
			let specifier: ExportSpecifier = {exported: exported, local: local, type: "ExportSpecifier"}
			specifiers.push(specifier)
		});

	}

	private extractSpecData(e: ExportIdentifier) {
		let exported: Identifier = {
			type: "Identifier",
			name: e.exported_name
		}
		let local: Identifier = {
			type: "Identifier",
			name: e.local_alias ? e.local_alias : e.exported_name
		}
		return {exported, local};
	}


	private createProperty(exported: Identifier, local: Identifier, e: ExportIdentifier): Property {
		return {
			type: "Property",
			key: exported,
			value: local,
			kind: "init",
			method: false,
			shorthand: e.exported_name === e.local_alias,
			computed: false
		};
	}

	getDefaultIdentifier() {
		return this.defaultIdentifier;
	}
}

export interface exportNaming {
	exported_name: string
	local_alias: string
}


export enum API_TYPE {
	default_only = "default",
	named_only = "named",
	// this is when the assigned properties are exported as namnes as well
	synthetic_named = "synthetic",
}
