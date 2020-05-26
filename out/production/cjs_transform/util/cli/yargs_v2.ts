// import {Arguments, Argv, CommandModule, Options} from "yargs";
//
// const commandBuilder = (args: Argv) => {
//     return args
//         .option({
//             "input": {
//                 describe: "input directory: requires EXACTLY one value.",
//                 nargs: 1,
//                 type: "string",
//                 demandOption: true
//
//             }
//         })
//         .check((argv1, aliases) => {
//
//             if (argv1['in-place'] && argv1['out']) {
//
//                 throw new Error("Must provide exactly ONE of options: 'out' or 'in-place' options.")
//             } else if (!argv1['in-place'] && !argv1.out) {
//                 throw new Error("Must provide exactly one of options: 'out' or 'in-place' options.")
//             }
//
//             if (typeof argv1.out === "object") {
//                 throw new Error("Please provide only one option for 'out'")
//             }
//             if (typeof argv1.suffix === "object") {
//                 throw new Error("Please provide only one option for 'suffix'")
//             }
//             if (typeof argv1.input === "object") {
//                 throw new Error("Please provide only one option for 'input'")
//             }
//
//
//             return argv1;
//
//         })
// };
//
// const outOpt: dotOption = (arg, name, options) => {
//     return arg.option({
//         'out': {
//             describe: "output directory: requires EXACTLY one value unless" +
//                 " the in-place flag is set, then it should not be used.",
//             nargs: 1
//         }
//     }
// }
//
//
// const inPlaceOpt: dotOption = (arg, name, options) => {
//     return arg.option('in-place', {
//         describe: "in-place is a flag to tell the transformation to occur on the current input files." +
//             " use --suffix to specify a suffix for the old files.",
//     })
// }
//
// const inPlaceOpt2: dotOption = (arg, name, options) => {
//     return arg.option(, ''
// :
//     {
//     }
// }
// )
// }
//
//
// const suffixOpt: dotOption = (arg, name, options) => {
//     return arg.option('suffix', {
//         describe: "in-place suffix for old files if running in place. Requires EXACTLY one value.",
//         nargs: 1,
//         type: "string"
//     })
// }
// let keyopt: yargsOptions = {}
//
// const inPlace: WithNameOption = {
//     name: 'in-place',
//     opt: {
//         describe: "in-place is a flag to tell the transformation to occur on the current input files. use --suffix " +
//             "to specify a suffix for the old files.",
//     }
// }
//
//
// const sanitize: CommandModule = {
//     command: 'sanitize',
//     builder: commandBuilder,
//     handler: args => {
//     }
// }
//
//
// const importCmd: CommandModule = {
//     command: 'import',
//     builder: commandBuilder,
//     handler: args => {
//     }
// }
//
//
// const exportCmd: CommandModule = {
//     command: 'export',
//     builder: commandBuilder,
//     handler: args => {
//     }
// }
//
//
// const runAll: CommandModule = {
//     command: 'run-all',
//     builder: commandBuilder,
//     handler: args => {
//     }
// }
// export type yargV<T> = { [key in keyof Arguments<T>]: Arguments<T>[key] }
// export type yargs_factory = (yargs: Argv<{}>) => yargV<{}>
//
// export const yargParse: yargs_factory = (yargs: Argv<{}>) => {
//     return yargs
//         .command(sanitize)
//         .command(importCmd)
//         .command(exportCmd)
//         .command(runAll)
//         .strict()
//         .argv
// }
