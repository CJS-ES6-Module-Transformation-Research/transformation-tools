#!/usr/local/bin/ts-node
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = void 0;
const visitors_1 = require("./visitors");
const __dirname_1 = require("./visitors/__dirname");
const requireRegistration_1 = require("./visitors/requireRegistration");
function sanitize(projectManager) {
    projectManager.forEachSource(visitors_1.requireStringSanitizer);
    projectManager.forEachSource(visitors_1.jsonRequire);
    projectManager.forEachSource(visitors_1.flattenDecls);
    projectManager.forEachSource(requireRegistration_1.requireRegistration);
    projectManager.forEachSource(visitors_1.accessReplace);
    projectManager.forEachSource(visitors_1.collectDefaultObjectAssignments);
    projectManager.forEachSource(__dirname_1.addLocationVariables);
}
exports.sanitize = sanitize;
//
// argv.shift();
// argv.shift();
//
//
// // argv[0] = ``
// // argv[1] = ``
//
// const pwd = process.cwd();// dirname(argv.shift());
//
// let source: string, dest: string, inPlace: boolean
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
//         argv[2] = source;
//         argv[3] = dest;
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
