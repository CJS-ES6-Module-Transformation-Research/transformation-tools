Object.defineProperty(exports, "__esModule", { value: true });
function createNamedAssignment(named, assignable, op) {
    if (op === void 0) { op = "="; }
    return {
        type: "ExpressionStatement",
        expression: {
            type: "AssignmentExpression",
            operator: op,
            left: {
                type: "MemberExpression",
                computed: false,
                object: {
                    type: "MemberExpression",
                    computed: false,
                    object: {
                        type: "Identifier",
                        name: "module"
                    },
                    property: {
                        type: "Identifier",
                        name: "exports"
                    }
                },
                property: {
                    type: "Identifier",
                    name: named
                }
            },
            right: assignable
        }
    };
}
exports.createNamedAssignment = createNamedAssignment;
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
