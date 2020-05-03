Object.defineProperty(exports, "__esModule", { value: true });
var esprima_1 = require("esprima");
try {
    console.log(JSON.stringify(esprima_1.parseModule('import "hello"\n'), null, 5));
}
catch (e) {
    console.log(e);
}
var is = {
    type: "ImportSpecifier",
    imported: {
        name: "importSpecifier",
        type: "Identifier"
    },
    local: {
        name: "localSpecifier",
        type: "Identifier"
    }
};
var is2 = {
    type: "ImportSpecifier",
    imported: {
        name: "importSpecifier",
        type: "Identifier"
    },
    local: {
        name: "localSpecifier",
        type: "Identifier"
    }
};
var ids = {
    type: "ImportDefaultSpecifier",
    local: {
        name: "defaultSpecifier",
        type: "Identifier"
    }
};
var ins = {
    type: "ImportNamespaceSpecifier",
    local: {
        name: "namespaceSpecifier",
        type: "Identifier"
    }
};
var x = {
    type: "ImportDeclaration",
    specifiers: [is, is2, ids, ins],
    source: {
        type: "Literal",
        value: "chai"
    }
};
var ex1 = {
    type: "CallExpression",
    callee: { type: "Identifier", name: "key" },
    arguments: []
};
var ap = {
    type: "Property",
    key: {
        type: "Literal",
        value: 3
    },
    shorthand: false,
    computed: false,
    value: { type: "Identifier", name: "value" },
    kind: "init",
    method: false
};
