Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
function isARequireDeclartor(node) {
    return (node.init.type === "CallExpression"
        && node.init.callee.type === "Identifier"
        && node.init.callee.name === "require"
        && node.init.arguments && node.init.arguments[0] !== null
        && node.init.arguments[0].type === "Literal");
}
exports.isARequireDeclartor = isARequireDeclartor;
function isARequire(node) {
    if (node.type === "VariableDeclarator") {
        (node.init.type === "CallExpression"
            && node.init.callee.type === "Identifier"
            && node.init.callee.name === "require"
            && node.init.arguments && node.init.arguments[0] !== null
            && node.init.arguments[0].type === "Literal");
        return true;
    }
    else if (node.type === "CallExpression"
        && node.callee.type === "Identifier"
        && node.callee.name === "require"
        && node.arguments[0].type === "Literal") {
        return true;
    }
    return false;
}
exports.isARequire = isARequire;
function isExpr(val) {
    switch (val) {
        case "ThisExpression":
        case "ArrayExpression":
        case "ObjectExpression":
        case "FunctionExpression":
        case "ArrowFunctionExpression":
        case "YieldExpression":
        case "Literal":
        case "UnaryExpression":
        case "UpdateExpression":
        case "BinaryExpression":
        case "AssignmentExpression":
        case "LogicalExpression":
        case "MemberExpression":
        case "ConditionalExpression":
        case "CallExpression":
        case "NewExpression":
        case "SequenceExpression":
        case "TemplateLiteral":
        case "TaggedTemplateExpression":
        case "ClassExpression":
        case "MetaProperty":
        case "Identifier":
        case "AwaitExpression":
        case "ImportExpression":
            return true;
        case "ObjectPattern":
        case "ArrayPattern":
        case "AssignmentPattern":
        case "RestElement":
            return false;
        default:
            throw new Error(" unreachable code. type is " + val);
    }
}
exports.isExpr = isExpr;
function instanceofThisExpression(object) {
    return object;
}
function instanceofArrayExpression(object) {
    return object;
}
function instanceofObjectExpression(object) {
    return object;
}
function instanceofFunctionExpression(object) {
    return object;
}
function instanceofArrowFunctionExpression(object) {
    return object;
}
function instanceofYieldExpression(object) {
    return object;
}
function instanceofLiteral(object) {
    return object;
}
function instanceofUnaryExpression(object) {
    return object;
}
function instanceofUpdateExpression(object) {
    return object;
}
function instanceofBinaryExpression(object) {
    return object;
}
function instanceofAssignmentExpression(object) {
    return object;
}
function instanceofLogicalExpression(object) {
    return object;
}
function instanceofMemberExpression(object) {
    return object;
}
function instanceofConditionalExpression(object) {
    return object;
}
function instanceofCallExpression(object) {
    return object;
}
function instanceofNewExpression(object) {
    return object;
}
function instanceofSequenceExpression(object) {
    return object;
}
function instanceofTemplateLiteral(object) {
    return object;
}
function instanceofTaggedTemplateExpression(object) {
    return object;
}
function instanceofClassExpression(object) {
    return object;
}
function instanceofMetaProperty(object) {
    return object;
}
function instanceofIdentifier(object) {
    return object;
}
function instanceofAwaitExpression(object) {
    return object;
}
function instanceofImportExpression(object) {
    return object;
}
function instanceOfExpr(x) {
    return (instanceofThisExpression(x) ||
        instanceofArrayExpression(x) ||
        instanceofObjectExpression(x) ||
        instanceofFunctionExpression(x) ||
        instanceofArrowFunctionExpression(x) ||
        instanceofYieldExpression(x) ||
        instanceofLiteral(x) ||
        instanceofUnaryExpression(x) ||
        instanceofUpdateExpression(x) ||
        instanceofBinaryExpression(x) ||
        instanceofAssignmentExpression(x) ||
        instanceofLogicalExpression(x) ||
        instanceofMemberExpression(x) ||
        instanceofConditionalExpression(x) ||
        instanceofCallExpression(x) ||
        instanceofNewExpression(x) ||
        instanceofSequenceExpression(x) ||
        instanceofTemplateLiteral(x) ||
        instanceofTaggedTemplateExpression(x) ||
        instanceofClassExpression(x) ||
        instanceofMetaProperty(x) ||
        instanceofIdentifier(x) ||
        instanceofAwaitExpression(x) ||
        instanceofImportExpression(x));
}
exports.instanceOfExpr = instanceOfExpr;
function getAllRequireStringsAsList(ast) {
    var list = [];
    estraverse_1.traverse(ast, {
        enter: function (node, parentNode) {
            if (node.type === "CallExpression"
                && node.callee.type === "Identifier"
                && node.callee.name === "require"
                && node.arguments
                && node.arguments.length > 0
                && node.arguments[0].type === "Literal") {
                list.push(node.arguments[0].value.toString());
            }
        }
    });
    return list;
}
exports.getAllRequireStringsAsList = getAllRequireStringsAsList;
function isForLoopParent(parent) {
    switch (parent.type) {
        case "ForStatement":
        case "ForInStatement":
            return false;
        default:
            return true;
    }
}
exports.isForLoopParent = isForLoopParent;
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
// export function createDecl(varStr: string, , kindStr: varLetConst): VariableDeclaration {
//     let varDecl: VariableDeclaration;
//     varDecl = {
//         type: "VariableDeclaration",
//         declarations: [
//             {
//                 type: "VariableDeclarator",
//                 id: {
//                     type: "Identifier",
//                     name: varStr
//                 }, init: {
//                     type: "CallExpression",
//                     callee: {
//                         type: "Identifier",
//                         name: "require"
//                     },
//                     arguments: [
//                         {
//                             type: "Literal",
//                             value: importStr,
//                             raw: `'${importStr}'`
//                         }
//                     ]
//                 },
//             }
//         ],
//         kind: kindStr
//     };
//     return varDecl;
// }
