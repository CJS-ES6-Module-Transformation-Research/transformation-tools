Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnExport = void 0;
//
function createAnExport(exp) {
    if (exp.isDefault) {
        // let typeX = getAType(exp)
        return {
            type: "ExportDefaultDeclaration",
            declaration: {
                type: "Identifier",
                name: exp.alias
            }
        };
    }
    else {
        return {
            type: "ExportNamedDeclaration",
            declaration: createVarDecl(),
            specifiers: [createSpecifier()],
            source: null //todo verify source can be null
        };
    }
    return null;
    function createSpecifier() {
        return {
            type: "ExportSpecifier",
            exported: { type: "Identifier", name: exp.identifier },
            local: { type: "Identifier", name: exp.alias }
        };
    }
    function createVarDecl() {
        return {
            declarations: [{ type: "VariableDeclarator", id: { type: "Identifier", name: exp.alias }, init: exp.expr }],
            kind: "const",
            type: "VariableDeclaration"
        };
    }
}
exports.createAnExport = createAnExport;
