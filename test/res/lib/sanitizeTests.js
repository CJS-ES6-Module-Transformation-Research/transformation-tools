Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    dirs: ['sanitize', 'depr.sanitize/lib', 'depr.sanitize/src'],
    files: ['sanitze/index.js', 'depr.sanitize/lib.js', "depr.sanitize/lib/index.js", 'depr.sanitize/src/index.js'],
    js: {
        topLevelRequire: "require('./);",
        requireDeco: "var x = require('fs')",
        requireDeclAccess: "var readSync = require('fs').readSync;",
        requireAssign: "let x;\nx = require('lodash')",
        requireAssignAccess: "let y;\ny = require('fs').readSync;",
        requireInvokeCall: "require('./')(\"hello\")",
        requireInvokeCallAssign: "let x;\nx = require('./')(\"hello\")",
        orderDependentMultiDecl: "const a = 1, b = a + 1, c = b + 2, d = c * 5",
        declWithRequireOnSide: "var x = 3, fs = require('fs')\n`var os = require('.'), w = 3` ",
        declRequireSandwich: "var z = 2, fs = require('fs'), k = 32; ",
        requireDeclSandwich: "var fs = require('fs'), x = 3, z =require('.');",
        namedObjectDecl: "const {readSync} = require('fs)",
        sideEffect: "require(./index);\n",
    }
};
