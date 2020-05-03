Object.defineProperty(exports, "__esModule", { value: true });
var esprima_1 = require("esprima");
var jj = function (j) {
    JSON.stringify(j, null, 3);
};
var cl = function (j) { return console.log(jj(j)); };
var drname = "import { fileURLToPath } from 'url';\nimport { dirname } from 'path';\nconst __filename  = fileURLToPath(import_meta_url)\nconst __dirname = dirname(__filename)";
var module;
console.log(JSON.stringify(esprima_1.parseModule(drname), null, 3));
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
