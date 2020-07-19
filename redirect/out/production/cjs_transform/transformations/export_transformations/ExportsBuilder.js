Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportBuilder = void 0;
class ExportBuilder {
    constructor() {
        this.exportList = [];
        this.exportNameValue = {};
        this.defaultExport = null;
    }
    clear() {
        this.exportList = [];
        this.exportNameValue = {};
        this.defaultIdentifier = null;
    }
    //todo test
    getByName(name) {
        let theNamed = this.exportNameValue[name];
        if (theNamed) {
            return {
                name: theNamed.name,
                type: "Identifier"
            };
        }
        return null;
    }
    registerName(names) {
        // console.log(names.name)
        if (this.exportNameValue[names.name]) {
            return;
        }
        let exportsTmp = {
            name: names.name,
            alias: names.alias
        };
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
    registerDefault(names) {
        if (this.defaultExport) {
            this.clear();
        }
        this.defaultExport = names;
    }
    build() {
        let exports = { named_exports: null, default_exports: null };
        let specifiers = [];
        let objEx = { type: "ObjectExpression", properties: [] };
        this.populateNames(specifiers, objEx);
        //unset
        if (!this.defaultExport && !this.exportList.length) {
            return exports;
        }
        exports.named_exports = {
            type: "ExportNamedDeclaration",
            specifiers: specifiers,
            declaration: null,
            source: null
        }; //todo
        exports.default_exports = {
            type: "ExportDefaultDeclaration",
            declaration: this.defaultExport ? this.defaultExport : objEx
        };
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
    populateNames(specifiers, objEx) {
        this.exportList.forEach(e => {
            let exported = {
                type: "Identifier",
                name: e.name
            };
            let local = {
                type: "Identifier",
                name: e.alias ? e.alias : e.name
            };
            objEx.properties.push({
                type: "Property",
                key: exported,
                value: local,
                kind: "init",
                method: false,
                shorthand: e.name === e.alias,
                computed: false
            });
            let specifier = { exported: exported, local: local, type: "ExportSpecifier" };
            // console.log(specifier)
            specifiers.push(specifier);
        });
    }
    getDefaultIdentifier() {
        return this.defaultIdentifier;
    }
}
exports.ExportBuilder = ExportBuilder;
