import {readFileSync} from "fs";
import {parseModule} from "esprima";
import {generate} from "escodegen";

// let x = readFileSync('apple').toString()

let list: [] = JSON.parse(readFileSync('__dirname.json').toString())//.toString()//JSON.parse( )
console.log()
console.log()
let program = parseModule('console.log(1);')
list.reverse().forEach((e) => program.body.splice(0, 0, e))
console.log(generate(program))