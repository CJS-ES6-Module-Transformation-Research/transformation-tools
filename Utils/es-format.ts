#!/usr/local/bin/ts-node
import {readFileSync, existsSync, writeFileSync, renameSync} from "fs";
import {generate} from 'escodegen';
import {parseScript, parseModule, Program} from 'esprima';
import {argv} from 'process';
import shebangRegex from "shebang-regex";
import {sanitize} from "../src/transformations/sanitizing/sanitize_project";
let i = 0;
argv.shift();
argv.shift();
let paths: string[] = [];

let isModule = false;

switch (argv.length) {
    case 0:
        console.log("no arguments supplied!");
        process.exit(1);
        break;
    case 1:
        if (!(argv[0].charAt(0) === '-')) {
            paths.push(argv[0])
        } else {
            console.log("saw beginning of flag but no argument");
            process.exit(2);
        }
        break;
    default:
        if (argv[0] === '-e' || argv[0] === '--esm') {
            isModule = true;
            argv.shift();
            paths.push(argv[1])
        }
        argv.forEach(e => paths.push(e))

        break;
}
console.log(`PATHS: ${paths}`)
paths.forEach(e=>{
    try {
        let shebang = '';
        let program:Program;
        let curr = readFileSync(e).toString()
        if (shebangRegex.test(curr)){
            shebang = shebangRegex.exec(curr)[0];
            curr = curr.replace(shebang, '');
        }
        if (isModule){
            program = parseModule(curr);
        }else {
            program = parseScript(curr) ;
        }
        renameSync(e, e+'OLD');
        let out = generate(program);
        if (shebang){
            out = shebang + '\n'+out
        }
        writeFileSync(e,out)
    }catch (er) {
        console.log(`simething went wrong in ${e} with error ${er}...`)
    }
});
// argv.forEach(e=> {
//     console.log(`${i}:  ${e}`);
//     i++
// });
