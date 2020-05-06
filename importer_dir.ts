import {parseModule} from 'esprima'
import {generate,GenerateOptions} from 'escodegen'
import {readFileSync, writeFileSync} from 'fs'
import * as fs from 'fs'
// let jj = (j) => {
//    JSON.stringify(j, null, 3)
// }
// let cl = (j) => console.log(jj(j))
let drname =
    `import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename  = fileURLToPath(import_meta_url)
const __dirname = dirname(__filename)`
let module;

// console.log( JSON.stringify( parseModule(drname) ,null,3))
// generate() TODO call it
// try {
//    // let bod =
//    //  module = {
//    //      module: bod
//    //  }
//     let data:string =     JSON.stringify( parseModule(drname).body ,null,3)+"\n\n"
//
//         writeFileSync('apple', data);
// } catch (err) {
//     console.log(err.toString())
//     console.log(err)
// }

// var read = ' ';
// fs.readFile('__dirname.json', (err, dat)=>{
//    read = read + (dat.toString())
//    console.log(read)
// });
// console.log(read)
