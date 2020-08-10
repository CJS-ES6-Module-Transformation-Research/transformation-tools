// #!/usr/local/bin/ts-node
//
// import {parseModule, parseScript} from 'esprima'
// import {generate} from 'escodegen'
// import yargs from 'yargs'
// import {readFileSync} from "fs";
// import {ExportNamedDeclaration, Program} from "estree";
//
// let args = yargs.option('echo', {})
//     .option('p', {demandOption: true, choices: ['s', 'm']})
//     // .option('m',{})
//     // .command('s','',(args)=>{args.demandCommand()})
//     // .command('m',  '')
//     .argv;
// // let anex:ExportNamedDeclaration = {type: "ExportNamedDeclaration",specifiers:[] }
// // console.log (generate(anex ))
//
// let programString = readFileSync(0);
// let program: Program;
// switch (args.p) {
//     case "s":
//         program = parseScript(programString.toString())
//         break;
//     case "m":
//         program = parseModule(programString.toString())
//         break;
// }
// // console.log(`${JSON.stringify(program,null,3)}\n\n${args.echo === true? 'src: '+generate(program): '' }`)
//
