#!/usr/local/bin/ts-node
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const esprima_1 = require("esprima");
const escodegen_1 = require("escodegen");
const yargs_1 = __importDefault(require("yargs"));
const fs_1 = require("fs");
let args = yargs_1.default.option('echo', {})
    .option('p', { demandOption: true, choices: ['s', 'm'] })
    // .option('m',{})
    // .command('s','',(args)=>{args.demandCommand()})
    // .command('m',  '')
    .argv;
let anex = { type: "ExportNamedDeclaration", specifiers: [] };
console.log(escodegen_1.generate(anex));
let programString = fs_1.readFileSync(0);
let program;
switch (args.p) {
    case "s":
        program = esprima_1.parseScript(programString.toString());
        break;
    case "m":
        program = esprima_1.parseModule(programString.toString());
        break;
}
console.log(`${JSON.stringify(program, null, 3)}\n\n${args.echo === true ? 'src: ' + escodegen_1.generate(program) : ''}`);
