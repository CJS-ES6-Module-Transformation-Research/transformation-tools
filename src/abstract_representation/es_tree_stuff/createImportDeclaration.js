Object.defineProperty(exports, "__esModule", { value: true });
var import_replacement_1 = require("../../transformations/import_transformations/visitors/import_replacement");
function createAnImportDeclaration(importData) {
    var specifiers = [];
    switch (importData.iType) {
        case import_replacement_1.ImportType.named:
            importData.importNames.forEach(function (e) {
                specifiers.push({
                    type: "ImportSpecifier",
                    imported: {
                        type: "Identifier",
                        name: e
                    }, local: {
                        type: "Identifier",
                        name: e
                    }
                });
            });
            break;
        case import_replacement_1.ImportType.defaultI:
            specifiers.push({
                type: "ImportDefaultSpecifier",
                local: { type: "Identifier", name: importData.importNames[0] }
            });
            break;
        case import_replacement_1.ImportType.sideEffect:
            break;
        default:
            throw new Error("unreachable");
            break;
    }
    return {
        type: "ImportDeclaration",
        specifiers: specifiers,
        source: {
            type: "Literal",
            value: importData.importString
        }
    };
}
exports.createAnImportDeclaration = createAnImportDeclaration;
