var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transformer_1 = require("../transformations/Transformer");
const process_1 = require("process");
const project_representation_1 = require("../abstract_representation/project_representation");
const sanitize_project_1 = require("../transformations/sanitizing/sanitize_project");
const yargs_1 = __importDefault(require("yargs"));
let yargv = yargs_1.default.command('run', 'help').option('i', { nargs: 1, type: "string", demandOption: true })
    .option('o', { nargs: 1, type: "string", demandOption: true }).strict().argv;
console.log(yargv);
process.exit(0);
process_1.argv.shift();
process_1.argv.shift();
// argv[0] = ``
// argv[1] = ``
const pwd = process.cwd(); // dirname(argv.shift());
let source, dest, inPlace;
//
// switch (argv.length) {
//     case 0:
//         console.log("no arguments supplied");
//         process.exit(1);
//     case 1:
//         let arg = argv.shift();
//         if (arg === '-i') {
//             console.log('please provide a project to transform')
//         } else {
//             console.log('please confirm you want to do this in place with the -i flag prior to your directory.')
//         }
//         process.exit(1);
//     case 2:
//         let first = argv.shift()
//         let second = argv.shift()
//         if (first === '-i') {
//             inPlace = true;
//             source = join(pwd, second);
//             dest = join(pwd, source);
//         } else {
//             inPlace = false;
//             source = join(pwd, first);
//             dest = join(pwd, second);
//         }
//         if (!existsSync(dest)) {
//             console.log(`Target directory ${dest} was not found: creating... `)
//         }
//        source = argv[2];
//        dest =  argv[3];
//         console.log(argv)
//         console.log()
//         break;
//     default: {
//         console.log('Args: ')
//         console.log(argv)
//         console.log('could not parse arguments--try again')
//         process.exit(1);
//     }
// }
process.exit(1);
let project = project_representation_1.projectReader(source);
let transformer = Transformer_1.Transformer.ofProject(project);
sanitize_project_1.sanitize(transformer);
// transformer.transform(transformImport)
if (inPlace) {
    project.writeOutInPlace('.pre-transform');
}
else {
    project.writeOutNewDir(dest);
}
console.log("finished.");
