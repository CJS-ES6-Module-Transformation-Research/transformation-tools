Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const esprima_1 = require("esprima");
const escodegen_1 = require("escodegen");
// let x = readFileSync('apple').toString()
let list = JSON.parse(fs_1.readFileSync('__dirname.json').toString()); //.toString()//JSON.parse( )
console.log();
console.log();
let program = esprima_1.parseModule('console.log(1);');
list.reverse().forEach((e) => program.body.splice(0, 0, e));
console.log(escodegen_1.generate(program));
