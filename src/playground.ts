import {
    ImportSpecifier,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportExpression,
    Literal,
    Identifier,
    Expression,
    Statement,
    Pattern,
    AssignmentExpression,
    ExpressionStatement
} from 'estree'
import {} from 'estraverse'
import {generate} from 'escodegen'
import {parseScript, parseModule, Program} from 'esprima'

let is: ImportSpecifier = {
    type: "ImportSpecifier",
    imported: {
        name: "importSpecifier",
        type: "Identifier"
    },
    local: {
        name: "localSpecifier",
        type: "Identifier"
    }
}
let is2: ImportSpecifier = {
    type: "ImportSpecifier",
    imported: {
        name: "importSpecifier",
        type: "Identifier"
    },
    local: {
        name: "localSpecifier",
        type: "Identifier"
    }
}
let ids: ImportDefaultSpecifier = {
    type: "ImportDefaultSpecifier",
    local: {
        name: "defaultSpecifier",
        type: "Identifier"
    }
}
let ins: ImportNamespaceSpecifier = {
    type: "ImportNamespaceSpecifier",
    local: {
        name: "namespaceSpecifier",
        type: "Identifier"
    }
}
let x: ImportDeclaration = {
    type: "ImportDeclaration",
    specifiers: [is, is2, ids, ins],
    source: {
        type: "Literal",
        value: "chai"
    }
}


function a(): Expression | Pattern {
    let x: AssignmentExpression = {
        left: {type: "Identifier", name: "x"},
        type: "AssignmentExpression",
        right: {type: "Literal", value: "4"},
        operator: "="
    }
    return x;
}

function b(x: Expression) {
    console.log(generate(x));
}
import * as estree from 'estree'
import {instanceOfExpr, isExpr} from "./ast_tools/astTools";
let p = a()
console.log()
if (instanceOfExpr(p)  ) {
    b(p as Expression);
}
// console.log(generate( {
//     type: "ImportDeclaration",
//     specifiers: [is,is2],
//     source: {
//
//         type: "Literal",
//         value: "chai"
//     }
// }))

// console.log(generate( {
//     type: "ImportDeclaration",
//     specifiers: [ids],
//     source: {
//
//         type: "Literal",
//         value: "chai"
//     }
// }))
// console.log(generate( {
//     type: "ImportDeclaration",
//     specifiers: [ins  ],
//     source: {
//
//         type: "Literal",
//         value: "chai"
//     }
// }))
// x.specifiers.splice(0,1)
// console.log(generate(x))
