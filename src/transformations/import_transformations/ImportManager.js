Object.defineProperty(exports, "__esModule", { value: true });
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
    var specifiers = [];
    for (var name_1 in aliasMap) {
        var alias = aliasMap[name_1];
        specifiers.push(createASpecifier(alias, name_1));
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
            "value": "" + importString,
        }
    };
}
var ImportManager = /** @class */ (function () {
    function ImportManager() {
        this.importMap = {};
        this.orderedImports = [];
    }
    ImportManager.prototype.createDefault = function (importString, value) {
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
    };
    ImportManager.prototype.createNamedWithAlias = function (importString, name, alias) {
        if (alias === void 0) { alias = name; }
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
        var curr = this.importMap[importString]
            ? this.importMap[importString] : {
            named: {},
            hasDefault: false,
            defaultIdentifiers: new Set(),
            importString: importString,
            isSideEff: false
        };
        this.importMap[importString] = curr;
        curr.named[name] = alias;
    };
    ImportManager.prototype.createSideEffect = function (importString) {
        if (this.importMap[importString] === undefined) {
            this.orderedImports.push(importString);
        }
        var curr = this.importMap[importString]
            ? this.importMap[importString] : {
            named: {},
            hasDefault: false,
            defaultIdentifiers: new Set(),
            importString: importString,
            isSideEff: true
        };
        this.importMap[importString] = curr;
    };
    //
    // private create(importString: string, value: string, alias: string, _default: boolean = false): void {
    //     let curr: ImportRepresentation = this.importMap[importString]
    //         ? this.importMap[importString] : {
    //             named: {},
    //             hasDefault: false,
    //             defaultIdentifiers: {},
    //             importString: importString
    //         };
    //
    //     this.importMap[importString] = curr
    //
    //     if (_default) {
    //         curr.defaultIdentifiers[value] = alias;
    //         curr.hasDefault = true;
    //     } else {
    //         curr.named[value] = alias;
    //     }
    //
    // }
    ImportManager.prototype.buildDeclList = function () {
        var _this = this;
        var decls = [];
        this.orderedImports.forEach(function (imp) {
            var value = _this.importMap[imp];
            var tmp = [];
            if (value.hasDefault) {
                value.defaultIdentifiers.forEach(function (name) {
                    tmp.push(createADefault(value.importString, name));
                });
            }
            tmp.reverse().forEach(function (e) { return decls.push(e); });
            tmp = [];
            if (Object.keys(value.named).length > 0) {
                tmp.push(createAnExport(value.importString, value.named));
            }
            tmp.reverse().forEach(function (e) { return decls.push(e); });
            if (value.isSideEff) {
                decls.push(createASideEffect(value.importString));
            }
        });
        // for (let imp in this.importMap) {
        //     let value = this.importMap [imp];
        //
        //     if (value.hasDefault) {
        //         value.defaultIdentifiers.forEach(name => {
        //             decls.push(createADefault(value.importString, name))
        //         })
        //
        //     }
        //     if (Object.keys(value.named).length > 0) {
        //         decls.push(createAnExport(value.importString, value.named))
        //     }
        //
        //     if (value.isSideEff) {
        //         decls.push(createASideEffect(value.importString))
        //     }
        // }
        return decls;
    };
    ImportManager.prototype.importsThis = function (importString, value) {
        var importsMap = this.importMap[importString];
        if (importsMap === undefined) {
            return false;
        }
        if (importsMap.hasDefault) {
            return importsMap.defaultIdentifiers[value] !== undefined;
        }
        return importsMap.named[value] !== undefined;
    };
    ImportManager.prototype.importsDefaultFromModule = function (importString) {
        var importsMap = this.importMap[importString];
        if (importsMap === undefined) {
            return false;
        }
        else {
            return importsMap.hasDefault;
        }
    };
    return ImportManager;
}());
exports.ImportManager = ImportManager;
