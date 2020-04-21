// #!/Users/sam/.nvm/versions/node/v12.16.0/bin/ts-node
//
// import {existsSync} from "fs";
// import {resolve} from "path";
// import {sanitize} from "../depr/sanitize/sanitize";
// import {generateProjectData} from "./projectStructurBuilder";
// import {replaceJS} from "../depr/io/readOut";
// import {ASTTransformer} from "../depr/ast/transformationTools";
// import {transformImports} from "../depr/import_transformations/transform_import";
//
// console.log("TEST0")
// export default function (args: string[]) {
//     let len = -1
//
//
//     function verifyArgs(arr: string[]): boolean {
//         if (arr.length < 3) {
//             console.log("Must pass 2 arguments: source project and target location for new project")
//         } else if (!existsSync(arr[2])) {
//             console.log(`Project directory root ${arr[2]} does not exist!`)
//         } else if (arr.length >= 4 && existsSync(arr[3])) {
//             console.log(`BAD STATE: ${arr[3]} cannot already exist in the filesystem.`)
//         } else {
//             return false
//         }
//         return true;
//     }
//
//
//     if (verifyArgs(args)) {
//         console.log('exit')
//         process.exit(3)
//     }
//
//
//     const projectName: string = resolve(args[2])
//
//     let projectTarget: string = ''
//     let project
//     if (args[3]) {
//         projectTarget = resolve(args[3]);
//         project = generateProjectData(projectName, projectTarget);
//     } else {
//         project = generateProjectData(projectName);
//     }
//     console.log("TARGET " + projectTarget)
//
//     let transformer: ASTTransformer = new ASTTransformer(project.asts)
//     sanitize(transformer);
//
// //TODO     program.body.reverse().forEach((dirname) => program.body.splice(0, 0, dirname))
// //TODO     find a better place (not replaceJS) for string replace
//
//     transformImports(transformer)
//     console.log("TARGET " + projectTarget)
//     replaceJS(project.asts, project.project.files, projectName, projectTarget)
//
// }
// console.log("TEST1 ")
