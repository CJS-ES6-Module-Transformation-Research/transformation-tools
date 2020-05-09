var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var esprima_1 = require("esprima");
var relative_1 = __importDefault(require("relative"));
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
var proj_dir = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform";
var test_root = proj_dir + "/test/res/fixtures/test_proj";
var path_1 = require("path");
var files = [
    'index.js',
    'lib.js',
    'lib/index.js',
    'src/index.js',
    'test/default.test.js',
    'test/fixt/parcel.js',
    'package.json'
];
var relativeRequirePath = {};
relativeRequirePath['index.js'] = './test/test_dat.json';
relativeRequirePath['lib.js'] = './test/test_dat.json';
relativeRequirePath['lib/index.js'] = '../test/test_dat.json';
relativeRequirePath['src/index.js'] = '../test/test_dat.json';
relativeRequirePath['test/default.test.js'] = './test_dat.json';
relativeRequirePath['test/fixt/parcel.js'] = '../test_dat.json';
relativeRequirePath['package.json'] = './test/test_dat.json';
//
// relativeRequirePath['index.js'] = './package.json';
// relativeRequirePath['lib.js'] = './package.json';
// relativeRequirePath ['lib/index.js'] = '../package.json';
// relativeRequirePath ['src/index.js'] = '../package.json';
// relativeRequirePath['test/default.test.js'] = '../package.json';
// relativeRequirePath['test/fixt/parcel.js'] = '../../package.json';
// relativeRequirePath['package.json'] = './package.json';
for (var x_1 in relativeRequirePath) {
    var file = path_1.join(test_root, x_1);
    var dir = path_1.dirname(file);
    var pkg = relativeRequirePath[x_1];
    var withPackage = dir + '/' + pkg;
    var withJoinPackage = path_1.join(dir, pkg);
    console.log("WORKING ON FILE " + x_1);
    console.log("\twith join\" " + withJoinPackage);
    console.log("\twith join\" " + relative_1.default(test_root, withJoinPackage, null) + "\n\n\n");
    //existsSync()
}
// let re:RegExp = new RegExp('.+\.json$');
// const files : string[]= ['index.js','lib.js','lib/index.js','src/index.js','test/default.test.js','test/fixt/parcel.js','package.json']
