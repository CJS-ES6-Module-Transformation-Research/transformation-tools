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
    ExpressionStatement,
    VariableDeclaration,
    MemberExpression,
    Super,
    ObjectPattern,
    AssignmentProperty,
    Directive,
    ModuleDeclaration, Property, BaseExpression, SpreadElement, NewExpression, CallExpression, VariableDeclarator
} from 'estree'
import {parseModule, parseScript} from "esprima";

try {
    console.log(JSON.stringify(parseModule('import "hello"\n'), null, 5))

} catch (e) {
    console.log(e)
}
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


// function a(): Expression | Pattern {
//     let x: AssignmentExpression = {
//         left: {type: "Identifier", name: "x"},
//         type: "AssignmentExpression",
//         right: {type: "Literal", value: "4"},
//         operator: "="
//     }
//     return x;
// }
//
// function b(x: Expression) {
//     // console.log(generate(x));
// }

import * as estree from 'estree'
import {instanceOfExpr, isExpr} from "./abstract_representation/es_tree_stuff/astTools";
import {JPP} from "../index";
import {generate} from "escodegen";
// let p = a()
// console.log()
// if (instanceOfExpr(p)  ) {
//     b(p as Expression);
// }
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





let ex1: CallExpression = {
    type: "CallExpression",
    callee: {type: "Identifier", name: "key"},
    arguments: []
}
let ap: Property = {
    type: "Property",
    key: {
        type: "Literal",
        value: 3
    },

    shorthand: false,
    computed: false,
    value: {type: "Identifier", name: "value"},
    kind: "init",
    method: false
}


