Object.defineProperty(exports, "__esModule", { value: true });
function createRequireDecl(varStr, importStr, kindStr) {
    var varDecl;
    varDecl = {
        type: "VariableDeclaration",
        declarations: [
            {
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: varStr
                }, init: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "require"
                    },
                    arguments: [
                        {
                            type: "Literal",
                            value: importStr,
                            raw: "'" + importStr + "'"
                        }
                    ]
                },
            }
        ],
        kind: kindStr
    };
    return varDecl;
}
exports.createRequireDecl = createRequireDecl;
