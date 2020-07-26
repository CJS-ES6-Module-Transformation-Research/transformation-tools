import {
    ExportDefaultDeclaration,
    ExportNamedDeclaration,
    ExportSpecifier,
    Identifier,
    ObjectExpression,
    Property
} from "estree";

interface ExportIdentifier {
    exported_name: string
    local_alias?: string
}

interface ExportMap {
    [name: string]: ExportIdentifier
}

export interface ExportTypes {
    default_exports: ExportDefaultDeclaration
    named_exports: ExportNamedDeclaration
}


export class ExportBuilder {

    private exportList: ExportIdentifier[] = [];
    private defaultIdentifier: Identifier;
    private exportNameValue: ExportMap = {};
    private defaultExport: Identifier = null;
    private api: API = null;
    private api_type: API_TYPE

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

    build(): ExportTypes {



        let exports: ExportTypes = {named_exports: null, default_exports: null};
        //unset
        if (!this.defaultExport && !this.exportList.length) {
            return exports;
        }
        if (!this.api_type) {
            this.api_type = this.defaultExport ? API_TYPE.default_only : API_TYPE.named_only

        }
        this.api = {exports: [], type: this.api_type}


        let specifier_names: ExportSpecifier[] = [];
        let default_object: ObjectExpression = {type: "ObjectExpression", properties: []}


        this.populateNames(specifier_names, default_object)


        switch (this.api.type) {
            case API_TYPE.default_only:
                this.api.exports.push('default')
                break;
            case API_TYPE.named_only:
                break;
            case API_TYPE.synthetic_named:
                this.api.exports.push('default')
                break;
        }
        if (this.api.type !== API_TYPE.default_only) {
            specifier_names.forEach(spec_name => {
                this.api.exports.push(spec_name.exported.name)
            })
        }


        exports.named_exports = {
            type: "ExportNamedDeclaration",
            specifiers: specifier_names,
            declaration: null,
            source: null
        };//todo


        exports.default_exports = {
            type: "ExportDefaultDeclaration",
            declaration:
                this.defaultExport ? this.defaultExport : default_object
        }
        //named-only case... no default
        // if (!this.defaultExport) {
        //
        //     };
        // } else {
        //     exports.default_exports = {
        //         type: "ExportDefaultDeclaration",
        //         declaration: {type: "Identifier", name: this.defaultExport.name}
        //     }
        // }
        return exports;
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

export interface API {
    type: API_TYPE
    exports: string[]
}


export enum API_TYPE {
    default_only = "default",
    named_only = "named",
    // this is when the assigned properties are exported as namnes as well
    synthetic_named = "synthetic",
}
