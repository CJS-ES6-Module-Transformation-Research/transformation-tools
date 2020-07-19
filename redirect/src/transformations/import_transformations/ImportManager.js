Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportManager = void 0;
function createADefault(importString, defaultedName) {
    return {
        specifiers: [{
                local: { name: defaultedName, type: "Identifier" },
                type: "ImportDefaultSpecifier"
            }],
        source: {
            type: "Literal",
            value: importString
        }, type: "ImportDeclaration"
    };
}
function createAnExport(importString, aliasMap) {
    let specifiers = [];
    for (let name in aliasMap) {
        let alias = aliasMap[name];
        specifiers.push(createASpecifier(alias, name));
    }
    function createASpecifier(local, imported) {
        return {
            type: "ImportSpecifier", local: {
                name: local, type: "Identifier"
            },
            imported: {
                name: imported, type: "Identifier"
            }
        };
    }
    return {
        type: "ImportDeclaration",
        source: {
            type: "Literal",
            value: importString
        },
        specifiers: specifiers
    };
}
function createASideEffect(importString) {
    return {
        "type": "ImportDeclaration",
        "specifiers": [],
        "source": {
            "type": "Literal",
            "value": `${importString}`,
        }
    };
}
class ImportManager {
    constructor() {
        this.importMap = {};
        this.orderedImports = [];
    }
    createDefault(importString, value) {
        if (this.importMap[importString] === undefined) {
            this.orderedImports.push(importString);
            this.importMap[importString] = {
                named: {},
                hasDefault: false,
                defaultIdentifiers: new Set(),
                importString: importString,
                isSideEff: false
            };
        }
        this.importMap[importString].hasDefault = true;
        this.importMap[importString].defaultIdentifiers.add(value);
    }
    createNamedWithAlias(importString, name, alias = name) {
        if (this.importMap[importString] === undefined) {
            this.orderedImports.push(importString);
            this.importMap[importString] = {
                named: {},
                hasDefault: false,
                defaultIdentifiers: new Set(),
                importString: importString,
                isSideEff: false
            };
        }
        let curr = this.importMap[importString]
            ? this.importMap[importString] : {
            named: {},
            hasDefault: false,
            defaultIdentifiers: new Set(),
            importString: importString,
            isSideEff: false
        };
        this.importMap[importString] = curr;
        curr.named[name] = alias;
    }
    createSideEffect(importString) {
        if (this.importMap[importString] === undefined) {
            this.orderedImports.push(importString);
        }
        let curr = this.importMap[importString]
            ? this.importMap[importString] : {
            named: {},
            hasDefault: false,
            defaultIdentifiers: new Set(),
            importString: importString,
            isSideEff: true
        };
        curr.isSideEff = true; // in case laready exists
        this.importMap[importString] = curr;
    }
    buildDeclList() {
        let decls = [];
        this.orderedImports.forEach(imp => {
            let value = this.importMap[imp];
            let tmp = [];
            if (value.hasDefault) {
                value.defaultIdentifiers.forEach(name => {
                    tmp.push(createADefault(value.importString, name));
                });
            }
            tmp.reverse().forEach(e => decls.push(e));
            tmp = [];
            if (Object.keys(value.named).length > 0) {
                tmp.push(createAnExport(value.importString, value.named));
            }
            tmp.reverse().forEach(e => decls.push(e));
            if (value.isSideEff) {
                decls.push(createASideEffect(value.importString));
            }
        });
        return decls;
    }
    importsThis(importString, value) {
        let importsMap = this.importMap[importString];
        if (importsMap === undefined) {
            return false;
        }
        if (importsMap.hasDefault) {
            return importsMap.defaultIdentifiers[value] !== undefined;
        }
        return importsMap.named[value] !== undefined;
    }
    importsDefaultFromModule(importString) {
        let importsMap = this.importMap[importString];
        if (importsMap === undefined) {
            return false;
        }
        else {
            return importsMap.hasDefault;
        }
    }
}
exports.ImportManager = ImportManager;
