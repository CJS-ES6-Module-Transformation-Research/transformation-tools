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
function walkPatternToIdentifier(node, ids) {
    switch (node.type) {
        case "ArrayPattern":
            node.elements.forEach(function (e) { return walkPatternToIdentifier(e, ids); });
            break;
        case "AssignmentPattern":
            walkPatternToIdentifier(node.left, ids);
            break;
        case "Identifier":
            ids.add(node.name);
            break;
        case "ObjectPattern":
            node.properties.forEach(function (e) {
                if (e.type === "Property") {
                    walkPatternToIdentifier(e.value, ids);
                }
                else {
                    walkPatternToIdentifier(e, ids);
                }
            });
            break;
        case "RestElement":
            walkPatternToIdentifier(node.argument, ids);
            break;
        case "MemberExpression":
            if (node.object.type === "Identifier") {
                ids.add(node.object.name);
            }
            else if (node.object.type === "MemberExpression") {
                walkPatternToIdentifier(node.object, ids);
            }
    }
}
exports.walkPatternToIdentifier = walkPatternToIdentifier;
