var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
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
let copyCommandModule = {
    command: "tf-copy <source> <dest>",
    builder: commandBuilder,
    describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project, copying the result to a destination.",
    handler(args) {
    }
};
let inPlaceCommandModule = {
    command: "tf-proj <source> <dest> [suffix]",
    builder: commandBuilder,
    describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project directory in-place.",
    handler(args) {
    }
};
function commandBuilder(args) {
    return args.option('', {});
}
;
let arv = yargs_1.default
    .command(copyCommandModule)
    .command(inPlaceCommandModule)
    .argv;
console.log(arv);
