import {
    CallExpression,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier,
    Property
} from 'estree'
import {parseModule} from "esprima";
import relative from "relative";

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
