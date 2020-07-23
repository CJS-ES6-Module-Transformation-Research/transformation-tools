Object.defineProperty(exports, "__esModule", { value: true });
exports.runTransform = void 0;
// import {projectReader, TransformableProject} from "../abstract_representation/project_representation";
const exec_transform_1 = require("./import_transformations/exec_transform");
const exportTransformMain_1 = require("./export_transformations/visitors/exportTransformMain");
const ProjectManager_1 = require("src/abstract_fs_v2/ProjectManager");
const sanitize_project_1 = require("transformations/sanitizing/sanitize_project");
// argv.shift();
// argv.shift();
// argv[0] = ``
// argv[1] = ``
// const pwd = process.cwd();// dirname(argv.shift());
//
// let source: string, dest: string, inPlace: boolean
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
//             console.log(`Target directory was not found: creating... `)
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
// let opts = {
//     target_dir: dest,
//         suffix: '.bak',
//     isModule: false,
//     write_status: inPlace ? "in-place" : "copy"
// }
function runTransform(source, opts) {
    let projectManager = new ProjectManager_1.ProjectManager(source, opts);
    sanitize_project_1.sanitize(projectManager);
    exec_transform_1.importTransforms(projectManager);
    projectManager.forEachSource(exportTransformMain_1.transformBaseExports);
    projectManager.writeOut();
    console.log("finished.");
}
exports.runTransform = runTransform;
// runTransform();
