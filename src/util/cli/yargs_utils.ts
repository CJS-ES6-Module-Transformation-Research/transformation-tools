import {CommandModule} from "yargs";
import * as yargs from "yargs";

const sanitizeCommand: CommandModule = {
    builder: args => {
        return args.options('sanitize', {nargs: 0});
    },
    command: "sanitize",
    describe: "Preprocessor for import/export transformations",
    handler: args => {
    }
};
const importCommand: CommandModule = {
    builder: args => {
        return args // .options('import', {nargs: 0});
    },
    command: "import",
    describe: "import-only transformations",
    handler: args => {
    }
};
const exportCommand: CommandModule = {
    builder: args => {
        return args //  .options(' ', {nargs: 0});
    },
    command: "export",
    describe: "export-only transformations",
    handler: args => {
    }
};
// const runInPlace: CommandModule = {
//     builder: args => {
//         return args //.options(runInPlace.command.toString(), {nargs: 1});
//     },
//     command: "i <suffix>",
//     describe: "run in place, expects a suffix",
//     handler: args => {
//     },
//
// };

// const overWriteInPlace: CommandModule = {
//     builder: args => {
//         return args.options(overWriteInPlace.command.toString(), {nargs: 0});
//     },
//     aliases: 'f',
//     command: "overwrite",
//     describe: "run in place, expects a suffix",
//     handler: args => {
//     }
// };

const setIn: CommandModule = {
    builder: args => {
        {

        }
        return args
        // .options(setIn.command.toString(), {
        //     nargs: 1
        // ,demandOption:true,
        // type:"string"});
    },
    command: "in <in>",
    describe: "set input to program",
    handler: args => {
    }
};

// const setOut: CommandModule = {
//     builder: args => {
//         if (!args.argv.out || (args.argv.out === "true"))
//             throw new Error("exc")
//         return args;//.
//         // return args  .options(setOut.command.toString(), {
//         //         nargs: 1,
//         //         demandOption:true,
//         //         type:"string"
//         //     }
//         // );
//     },
//     command: "output <out>",
//     describe: "set output directory to program",
//     handler: args => {
//     }
// };

const outType: CommandModule = {
    command: "",
    //aliases:,
    handler: args => args,
    describe: "set what type of output (in-place or target directory). In-place requires a suffix unless otherwise specified.",
    builder: args => {
        return args
            .option('i <suffix>', {type: 'string', nargs: 1, describe: "in place. specify a suffix or --no-suffix "})
            .option('out-dir <out-dir>', {type: 'string', nargs: 1, describe: "specifies out directory root"})
            .option('no-suffix ', {type: 'string', nargs: 0, describe: "specifies no suffix"})
    }
}

type supported_command = 'sanitize' | 'import' | 'export';

export interface supported_commands {
    sanitize: supported_command
    import: supported_command
    export: supported_command
}

// function parseYargs(args, cmds: supported_commands = {
//     sanitize: "sanitize",
//     import: "import",
//     export: "export"
// }) {
//     args
//         // .command(runInPlace)
//         //
//         // .command(overWriteInPlace)
//
//
//         .command(setIn)
//
//     // .command(setOut)
//
//
//     if (cmds['sanitize']) {
//         args = args
//             .command(sanitizeCommand)
//     }
//     if (cmds['import']) {
//         args = args
//             .command(importCommand)
//
//     }
//
//     if (cmds['export']) {
//         args = args
//             .command(exportCommand)
//     }
//     let argz = args.argv
//     console.log(argz)
//
//     return argz
// }


// const mod =
export const cli_parse = (yargs) => {
    return yargs
        // .command('cmd <commandName>','desc',args=>{return args })
        .choices('commandName',['execute'])
        .demandCommand()
        // .command('out <outPut>','desc',args=>{return args })
        // .choices('out',['in-place', 'out-dir'])
        .demandCommand()
        .option({
        // "_cmd___": {
        //     type: "string",
        //     demandOption: true,
        //     nargs: 1,
        //     choices: ['execute', 'sanitize', 'import', 'export', 'run-all']
        // },
        "in": {
            desc: "--in <input-proj> specifies input project path",
            type: "string",
            nargs: 1,
            alias: ["input"],
            // demandOption: true
        },
        "out": {
            desc: "--out <out-dir> specifies output directory for transformed project",
            type: "string",
            alias: ['o'],
            nargs: 1
        },
        "no-sanitize": {desc: "omits the 'sanitize' step."},
            // "const-exports":{"const-exports <fname> [varnames]"},
        "in-place": {desc: "omits the 'sanitize' step.", type: "string"}
    }).argv;
}
const mod = cli_parse(yargs)

const inputPath: string = mod.in;
const output: string = mod.out;
if (!mod['in-place'] && !mod["out"]) {
    console.log(`Please either choose an output directory --out <out-dir> or use the flag --in-place`)
    process.exit(1);
}

const no_sanitize = mod["no-sanitize"]

switch (mod.cmd) {
    case "sanitize":
        break;
        if (no_sanitize) break;
    case "import":
        break;
    case "export":
        break;
    case "run-all":
    case "execute":

        break;
    default:
        break;
}


// .option("base_command <input>", {
//     type: "string",
//     demandOption: true,
//     nargs: 1,
//     choices: ['sanitize', 'import', 'export', 'run all']
// }).demandCommand()
// .command("out","",args => {})

// .option().argv
console.log(JSON.stringify(mod, null, 3))
