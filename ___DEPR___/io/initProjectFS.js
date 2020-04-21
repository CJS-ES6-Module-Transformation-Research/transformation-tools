// import {ProjectFS} from "../Types";
// import {mkdirSync} from "fs";
// import {traverseProject} from "../fsys/walker";
//
// export function initProjectFS(projectName: string, projectTarget: string): ProjectFS {
//
//
//     mkdirSync(projectTarget, {recursive: true})
//
//     let project: ProjectFS = traverseProject(projectName)
//
//
//     let dirs: string[] = project.dirs.map((d) => d.relative)
//     dirs.forEach((d) => {
//         try {
//             mkdirSync(`${projectTarget}/${d}`, {recursive: true})
//         } catch (err) {
//             // console.log( + " failed")
//         }
//         mkdirSync(d, {recursive: true})
//     })
//     project.project = projectTarget
//     return project;
// }
