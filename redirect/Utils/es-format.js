#!/usr/local/bin/ts-node
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const escodegen_1 = require("escodegen");
const esprima_1 = require("esprima");
const process_1 = require("process");
const shebang_regex_1 = __importDefault(require("shebang-regex"));
let i = 0;
process_1.argv.shift();
process_1.argv.shift();
let paths = [];
let isModule = false;
switch (process_1.argv.length) {
    case 0:
        console.log("no arguments supplied!");
        process.exit(1);
        break;
    case 1:
        if (!(process_1.argv[0].charAt(0) === '-')) {
            paths.push(process_1.argv[0]);
        }
        else {
            console.log("saw beginning of flag but no argument");
            process.exit(2);
        }
        break;
    default:
        if (process_1.argv[0] === '-e' || process_1.argv[0] === '--esm') {
            isModule = true;
            process_1.argv.shift();
            paths.push(process_1.argv[1]);
        }
        process_1.argv.forEach(e => paths.push(e));
        break;
}
console.log(`PATHS: ${paths}`);
paths.forEach(e => {
    try {
        let shebang = '';
        let program;
        let curr = fs_1.readFileSync(e).toString();
        if (shebang_regex_1.default.test(curr)) {
            shebang = shebang_regex_1.default.exec(curr)[0];
            curr = curr.replace(shebang, '');
        }
        if (isModule) {
            program = esprima_1.parseModule(curr);
        }
        else {
            program = esprima_1.parseScript(curr);
        }
        fs_1.renameSync(e, e + 'OLD');
        let out = escodegen_1.generate(program);
        if (shebang) {
            out = shebang + '\n' + out;
        }
        fs_1.writeFileSync(e, out);
    }
    catch (er) {
        console.log(`simething went wrong in ${e} with error ${er}...`);
    }
});
// argv.forEach(e=> {
//     console.log(`${i}:  ${e}`);
//     i++
// });
