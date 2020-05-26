import {
    Declaration,
    ExportDefaultDeclaration,
    ExportNamedDeclaration,
    ExportSpecifier,
    Expression,
    Identifier,
    ObjectExpression
} from "estree";

interface ExportIdentifier {
    name: string
    alias?: string
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

    constructor() {
    }

    clear() {
        this.exportList = [];
        this.exportNameValue = {};


        this.defaultIdentifier = null;

    }

    registerName(names: exportNaming) {
// console.log(names.name)

        let exportsTmp = {
            name: names.name,
            alias: names.alias
        }
        this.exportList.push(exportsTmp);
        this.exportNameValue[names.name] = exportsTmp;
    }


    //////////////////MUST BE ABLE TO REGISTER DEFAULT WITHOUT NAME
    //////////////////DEFAULTS CANNOT HAVE ALIASES IN NODE
    /**
     * case where there is an expression but no name... names is the default export name for the 'named' portion.
     * @param names named export name.
     * @param value expression/declaration value
     */
    registerDefault(names: Identifier): void {
        this.defaultExport = names;
    }


    build():  ExportTypes {
        let exports: ExportTypes = {named_exports: null, default_exports: null};


        let specifiers: ExportSpecifier[] = [];
        let objEx: ObjectExpression = {type: "ObjectExpression", properties: []}

        this.populateNames(specifiers, objEx)


        //unset
        if (!this.defaultExport && !this.exportList.length) {
            return exports;
        }

        exports.named_exports = {
            type: "ExportNamedDeclaration",
            specifiers: specifiers,
            declaration: null,
            source: null
        };//todo


        exports.default_exports = {
            type: "ExportDefaultDeclaration",
            declaration:
                this.defaultExport ? this.defaultExport : objEx
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


    private populateNames(specifiers: ExportSpecifier[], objEx: ObjectExpression) {

        this.exportList.forEach(e => {

            let exported: Identifier = {
                type: "Identifier",
                name: e.name
            }
            let local: Identifier = {
                type: "Identifier",
                name: e.alias ? e.alias : e.name
            }


            objEx.properties.push({
                type: "Property",
                key: exported,
                value: local,
                kind: "init",
                method: false,
                shorthand: e.name === e.alias,
                computed: false
            })
            let specifier: ExportSpecifier = {exported: exported, local: local, type: "ExportSpecifier"}

            // console.log(specifier)

            specifiers.push(specifier)
        });

    }
}

export interface exportNaming {
    name: string
    alias: string
}
