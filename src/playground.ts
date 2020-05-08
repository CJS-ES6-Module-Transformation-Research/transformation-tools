#!/usr/local/bin/ts-node
import {
    CallExpression,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier, Literal, ObjectExpression, Pattern,
    Property, VariableDeclaration
} from 'estree'
import {parseModule, parseScript} from "esprima";
import relative from "relative";

try {
    // console.log(JSON.stringify(parseModule('import "hello"\n'), null, 5))

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
const proj_dir = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform`;
const test_root = `${proj_dir}/test/res/fixtures/test_proj`;
import {join, dirname, basename, extname, normalize} from 'path';
import {existsSync, readdirSync, readFileSync} from "fs";
import {generate} from "escodegen";

const files: string[] = [
    'index.js',
    'lib.js',
    'lib/index.js',
    'src/index.js',
    'test/default.test.js',
    'test/fixt/parcel.js',
    'package.json'
];

let relativeRequirePath = {};
relativeRequirePath['index.js'] = './test/test_dat.json';
relativeRequirePath['lib.js'] = './test/test_dat.json';
relativeRequirePath ['lib/index.js'] = '../test/test_dat.json';
relativeRequirePath ['src/index.js'] = '../test/test_dat.json';
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

// for (let x in relativeRequirePath){
//     let file = join(test_root, x);
//     let dir = dirname(file);
//     let pkg :string = relativeRequirePath[x];
//     let withPackage = dir +'/'+pkg;
//     let withJoinPackage = join(dir, pkg)
//     console.log(`WORKING ON FILE ${x}`);
//     console.log(`\twith join" ${withJoinPackage}`);
//
//     console.log(`\twith join" ${ relative(test_root, withJoinPackage,null)}\n\n\n`);
//     //existsSync()
// }
// let re:RegExp = new RegExp('.+\.json$');

// const files : string[]= ['index.js','lib.js','lib/index.js','src/index.js','test/default.test.js','test/fixt/parcel.js','package.json']
// let pathToPackage: string = `${process.cwd()}/package.json`;
// console.log(pathToPackage)
// let package_JSON = `  ${readFileSync(pathToPackage).toString()}`;
// let parsed = JSON.parse(package_JSON)
// parsed.type = "module"
// for (let key in parsed){
//     console.log(`${key} : ${JSON.stringify(parsed[key],null,3)}`)
// }
// let parsedJSON = ((parseScript(package_JSON).body[0] as VariableDeclaration).declarations[0].init as ObjectExpression);
// let propMap: object = {}
// let map = parsedJSON.properties
// // map.forEach((e: Property) => {
//     let key = e.key;
//     let val = e.value;
//     let keyString:string, valString:string
//     if (key.type === 'Literal'){
//         keyString = key.value.toString()
//     }else{
//         keyString = `NOT LITERAL--TYPE: ${key.type}`
//     }
//
//     switch (val.type){
//         case "Literal":
//             valString = val.value.toString()
//             break;
//         case "Identifier":
//             valString = val.name;
//             break;
//         case "ArrayPattern":
//             valString = val.elements.map((p:Pattern) => JSON.stringify(p,null,2)).reduce((prev, curr) => prev + curr)
//             break;
//         case "ObjectPattern":
//             valString = JSON.stringify(val,null,2)
//             break;
//         default:
//             valString = generate(val);
//             break;
//     }
//
//
//     //
//     // let lit = (e.key as Literal)
//     // let val = lit.value.toString()
//     // console.log(`${val}`)
//     propMap[keyString] = valString;//`${e.value} =>  ${e.value.type} `
// })
// for (let key in map) {
//     console.log(`${key}  :   ${map[key]}`)
// }
// console.log(parsedJSON.type)
// console.log(package_JSON)

