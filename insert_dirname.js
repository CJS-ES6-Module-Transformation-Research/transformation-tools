Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var esprima_1 = require("esprima");
var escodegen_1 = require("escodegen");
// let x = readFileSync('apple').toString()
var list = JSON.parse(fs_1.readFileSync('__dirname.json').toString()); //.toString()//JSON.parse( )
console.log();
console.log();
var program = esprima_1.parseModule('console.log(1);');
list.reverse().forEach(function (e) { return program.body.splice(0, 0, e); });
console.log(escodegen_1.generate(program));
