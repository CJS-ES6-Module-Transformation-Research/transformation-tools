import yargs, {Argv, CommandModule} from 'yargs'


interface TransformationOptions {
    src: string
    target?: string
    in_place: boolean
    suffix?: string
}

// let options: TransformationOptions = parse(yargs)


//FIXME NCP IS SYNCHRONOUS


//
//
// function parse(yargs): TransformationOptions {
//     const mod = cli_parse(yargs)
//     if (!mod['in-place'] && !mod["out"]) {
//         console.log(`Please either choose an output directory --out <out-dir> or use the flag --in-place`)
//         process.exit(1);
//     }
//     let opts: TransformationOptions = {
//         in_place: mod["in-place"],
//         src: mod.in,
//         suffix: mod.suffix,
//         target: mod.out
//     }
//     return opts;
//
//
//     function cli_parse(yargs) {
//         return yargs
//             .option({
//                 "in": {
//                     desc: "--in <input-proj> specifies input project path",
//                     type: "string",
//                     nargs: 1,
//                     alias: ["input"],
//                     demandOption: true
//                 },
//                 "out": {
//                     desc: "--out <out-dir> specifies output directory for transformed project",
//                     type: "string",
//                     alias: ['o'],
//                     nargs: 1
//                 },
//                 "in-place": {
//                     desc: "omits the 'sanitize' step.", type: "string"
//                 },
//                 "suffix": {desc: "suffix for keeping copies in-place", type: "string"}
//             }).argv;
//     }
// }


let copyCommandModule: CommandModule = {
    command: "tf-copy <source> <dest>",
    builder: commandBuilder,
    describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project, copying the result to a destination.",
    handler(args: yargs.Arguments<{}>): void {
    }
}

let inPlaceCommandModule: CommandModule = {
    command: "tf-proj <source> <dest> [suffix]",
    builder: commandBuilder,
    describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project directory in-place.",
    handler(args: yargs.Arguments<{}>): void {
    }
}

function commandBuilder(args: Argv<{}>): Argv<{}> {
    return args.option('', {});
};

let arv = yargs
    .command(copyCommandModule)
    .command(inPlaceCommandModule)
    .argv;

console.log(arv)



