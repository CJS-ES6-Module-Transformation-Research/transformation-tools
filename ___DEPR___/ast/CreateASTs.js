Object.defineProperty(exports, "__esModule", { value: true });
// export function createASTs(project: ProjectFS): AstFile[] {
//
//     return project.files
//         .filter((f) => f.ftype === FILE_TYPE.JS)
//         .map((file) => {
//             try {
//                 let program: string = readFileSync(file.full)
//                     .toString()
//                 let shebang: string = '';
//                 if (shebangRegex.test(program)) {
//                     shebang = shebangRegex.exec(program)[0]
//                 }
//
//                 if (shebang){
//                     program.replace(shebang,'');
//                 }
//                     return {
//                         dir: file.dir,
//                         filePath: file.relative,
//                         shebang: shebang,
//                         ast: parseScript(program.split('\n')[0]
//                             .startsWith("#!")
//                             ? program
//                                 .replace(program
//                                     .split('\n')[0], '')
//                             : program)
//                     }
//             } catch (err) {
//                 console.log(`ERROR: ${err} in file: ${file.relative}`)
//                 throw new Error(`ERROR: ${err} in file: ${file.relative}`)
//             }
//         })
// }
