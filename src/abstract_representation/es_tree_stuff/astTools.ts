import {
    ArrayExpression,
    ArrowFunctionExpression,
    AssignmentExpression, AwaitExpression,
    BinaryExpression,
    CallExpression,
    ClassExpression,
    ConditionalExpression,
    FunctionExpression, Identifier, ImportExpression,
    Literal,
    LogicalExpression,
    MemberExpression, MetaProperty,
    NewExpression, Node,
    ObjectExpression,
    SequenceExpression,
    TaggedTemplateExpression,
    TemplateLiteral,
    ThisExpression,
    UnaryExpression,
    UpdateExpression,
    VariableDeclaration,
    YieldExpression,
    VariableDeclarator, Expression, AssignmentOperator, Statement
} from "estree";
import {Program} from "esprima";
import {traverse} from "estraverse";
import {varLetConst} from "../../Types";

// export function isARequireDeclartor(node: VariableDeclarator) {
//     return (node.init.type === "CallExpression"
//         && node.init.callee.type === "Identifier"
//         && node.init.callee.name === "require"
//         && node.init.arguments && node.init.arguments[0] !== null
//         && node.init.arguments[0].type === "Literal");
// }
//
//
// export function isARequire(node: (VariableDeclarator | CallExpression)) {
//     if (node.type === "VariableDeclarator") {
//         (node.init.type === "CallExpression"
//             && node.init.callee.type === "Identifier"
//             && node.init.callee.name === "require"
//             && node.init.arguments && node.init.arguments[0] !== null
//             && node.init.arguments[0].type === "Literal")
//         return true;
//     } else if
//     (node.type === "CallExpression"
//         && node.callee.type === "Identifier"
//         && node.callee.name === "require"
//         && node.arguments[0].type === "Literal") {
//         return true;
//     }
//
//
//     return false;
//
// }


export function isExpr(val: string): boolean {
    switch (val) {
        case     "ThisExpression":
        case       "ArrayExpression":
        case       "ObjectExpression":
        case       "FunctionExpression":
        case    "ArrowFunctionExpression":
        case       "YieldExpression":
        case      "Literal":
        case       "UnaryExpression":
        case  "UpdateExpression":
        case       "BinaryExpression":
        case     "AssignmentExpression":
        case      "LogicalExpression":
        case          "MemberExpression":
        case            "ConditionalExpression":
        case       "CallExpression":
        case            "NewExpression":
        case            "SequenceExpression":
        case            "TemplateLiteral":
        case       "TaggedTemplateExpression":
        case           "ClassExpression":
        case           "MetaProperty":
        case            "Identifier":
        case     "AwaitExpression":
        case     "ImportExpression":
            return true;
        case "ObjectPattern":
        case "ArrayPattern":
        case "AssignmentPattern":
        case "RestElement":
            return false;
        default:
            throw new Error(` unreachable code. type is ${val}`);
    }
}

//
// function instanceofThisExpression(object: any): object is ThisExpression {
//     return object;
// }
//
// function instanceofArrayExpression(object: any): object is ArrayExpression {
//     return object;
// }
//
// function instanceofObjectExpression(object: any): object is ObjectExpression {
//     return object;
// }
//
// function instanceofFunctionExpression(object: any): object is FunctionExpression {
//     return object;
// }
//
// function instanceofArrowFunctionExpression(object: any): object is ArrowFunctionExpression {
//     return object;
// }
//
// function instanceofYieldExpression(object: any): object is YieldExpression {
//     return object;
// }
//
// function instanceofLiteral(object: any): object is Literal {
//     return object;
// }
//
// function instanceofUnaryExpression(object: any): object is UnaryExpression {
//     return object;
// }
//
// function instanceofUpdateExpression(object: any): object is UpdateExpression {
//     return object;
// }
//
// function instanceofBinaryExpression(object: any): object is BinaryExpression {
//     return object;
// }
//
// function instanceofAssignmentExpression(object: any): object is AssignmentExpression {
//     return object;
// }
//
// function instanceofLogicalExpression(object: any): object is LogicalExpression {
//     return object;
// }
//
// function instanceofMemberExpression(object: any): object is MemberExpression {
//     return object;
// }
//
// function instanceofConditionalExpression(object: any): object is ConditionalExpression {
//     return object;
// }
//
// function instanceofCallExpression(object: any): object is CallExpression {
//     return object;
// }
//
// function instanceofNewExpression(object: any): object is NewExpression {
//     return object;
// }
//
// function instanceofSequenceExpression(object: any): object is SequenceExpression {
//     return object;
// }
//
// function instanceofTemplateLiteral(object: any): object is TemplateLiteral {
//     return object;
// }
//
// function instanceofTaggedTemplateExpression(object: any): object is TaggedTemplateExpression {
//     return object;
// }
//
// function instanceofClassExpression(object: any): object is ClassExpression {
//     return object;
// }
//
// function instanceofMetaProperty(object: any): object is MetaProperty {
//     return object;
// }
//
// function instanceofIdentifier(object: any): object is Identifier {
//     return object;
// }
//
// function instanceofAwaitExpression(object: any): object is AwaitExpression {
//     return object;
// }
//
// function instanceofImportExpression(object: any): object is ImportExpression {
//     return object;
// }
//
//
// export function instanceOfExpr(x: Node) {
//     return (instanceofThisExpression(x) ||
//         instanceofArrayExpression(x) ||
//         instanceofObjectExpression(x) ||
//         instanceofFunctionExpression(x) ||
//         instanceofArrowFunctionExpression(x) ||
//         instanceofYieldExpression(x) ||
//         instanceofLiteral(x) ||
//         instanceofUnaryExpression(x) ||
//         instanceofUpdateExpression(x) ||
//         instanceofBinaryExpression(x) ||
//         instanceofAssignmentExpression(x) ||
//         instanceofLogicalExpression(x) ||
//         instanceofMemberExpression(x) ||
//         instanceofConditionalExpression(x) ||
//         instanceofCallExpression(x) ||
//         instanceofNewExpression(x) ||
//         instanceofSequenceExpression(x) ||
//         instanceofTemplateLiteral(x) ||
//         instanceofTaggedTemplateExpression(x) ||
//         instanceofClassExpression(x) ||
//         instanceofMetaProperty(x) ||
//         instanceofIdentifier(x) ||
//         instanceofAwaitExpression(x) ||
//         instanceofImportExpression(x));
// }
//
// export function getAllRequireStringsAsList(ast: Program): string[] {
//     let list: string[] = [];
//
//     traverse(ast, {
//         enter: (node, parentNode) => {
//             if (node.type === "CallExpression"
//                 && node.callee.type === "Identifier"
//                 && node.callee.name === "require"
//                 && node.arguments
//                 && node.arguments.length > 0
//                 && node.arguments[0].type === "Literal") {
//                 list.push(node.arguments[0].value.toString());
//             }
//         }
//     });
//     return list;
// }
//
// export function isForLoopParent(parent: Node) {
//     switch (parent.type) {
//         case "ForStatement":
//         case "ForInStatement":
//             return false;
//         default:
//             return true;
//     }
// }

export function createRequireDecl(varStr: string, importStr: string, kindStr: varLetConst): VariableDeclaration {
    let varDecl: VariableDeclaration;
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
                            raw: `'${importStr}'`
                        }
                    ]
                },
            }
        ],
        kind: kindStr
    };
    return varDecl;
}


//
// export function createNamedAssignment(named: string, assignable: Expression, op: AssignmentOperator = "="): Statement {
//     return {
//         type: "ExpressionStatement",
//         expression: {
//             type: "AssignmentExpression",
//             operator: op,
//             left: {
//                 type: "MemberExpression",
//                 computed: false,
//                 object: {
//                     type: "MemberExpression",
//                     computed: false,
//                     object: {
//                         type: "Identifier",
//                         name: "module"
//                     },
//                     property: {
//                         type: "Identifier",
//                         name: "exports"
//                     }
//                 },
//                 property: {
//                     type: "Identifier",
//                     name: named
//                 }
//             },
//             right: assignable
//         }
//     };
//
// }






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





