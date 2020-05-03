var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var import_replacement_1 = require("./visitors/import_replacement");
// implements importMap
var AbstractImport = /** @class */ (function () {
    function AbstractImport(importString, imports, isDefault) {
        this.importString = importString;
        if (!importString) {
            throw new Error('no import value');
        }
        if (imports && isDefault) {
            this.importType = import_replacement_1.ImportType.defaultI;
        }
        else if (imports && !isDefault) {
            this.importType = import_replacement_1.ImportType.named;
        }
        else if (!imports) {
            this.importType = import_replacement_1.ImportType.sideEffect;
        }
    }
    AbstractImport.prototype.getImportString = function () {
        return this.importString;
    };
    AbstractImport.prototype.getImports = function () {
        return this.imports;
    };
    AbstractImport.prototype.getImportType = function () {
        return this.importType;
    };
    return AbstractImport;
}());
var NamedImport = /** @class */ (function (_super) {
    __extends(NamedImport, _super);
    function NamedImport(importString, values) {
        var _this = _super.call(this, importString, values, false) || this;
        if (!values || values.length === 0) {
            throw new Error('missing an import');
        }
        return _this;
    }
    NamedImport.prototype.addAName = function (name) {
        this.imports.push(name);
    };
    NamedImport.prototype.build = function () {
        var specifiers = this.imports.map(function (e) {
            return {
                type: "ImportSpecifier",
                imported: {
                    name: "" + e,
                    type: "Identifier"
                },
                local: {
                    name: "" + e,
                    type: "Identifier"
                }
            };
        });
        return {
            type: "ImportDeclaration",
            specifiers: specifiers,
            source: {
                type: "Literal",
                value: "" + this.importString
            }
        };
    };
    return NamedImport;
}(AbstractImport));
exports.NamedImport = NamedImport;
var DefaultImport = /** @class */ (function (_super) {
    __extends(DefaultImport, _super);
    function DefaultImport(importString, value) {
        var _this = _super.call(this, importString, value, true) || this;
        if (!value) {
            throw new Error('no default import!');
        }
        return _this;
    }
    DefaultImport.prototype.build = function () {
        return {
            type: "ImportDeclaration",
            specifiers: [{
                    type: "ImportDefaultSpecifier",
                    local: {
                        name: "" + this.imports,
                        type: "Identifier"
                    }
                }],
            source: {
                type: "Literal",
                value: "" + this.importString
            }
        };
    };
    return DefaultImport;
}(AbstractImport));
exports.DefaultImport = DefaultImport;
var SideEffectImport = /** @class */ (function (_super) {
    __extends(SideEffectImport, _super);
    function SideEffectImport(importString) {
        return _super.call(this, importString, null, false) || this;
    }
    SideEffectImport.prototype.build = function () {
        return {
            type: "ImportDeclaration",
            specifiers: [],
            source: {
                type: "Literal",
                value: "chai"
            }
        };
    };
    return SideEffectImport;
}(AbstractImport));
exports.SideEffectImport = SideEffectImport;
