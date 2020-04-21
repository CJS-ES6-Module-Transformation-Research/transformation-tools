import {mkdirSync} from "fs";
import {ProjectData, ProjectFS} from "../../src/Types";
import {traverseProject} from "../fsys/walker";
import {createASTs} from "../ast/CreateASTs";


function initProjectFS(projectName: string, projectTarget: string, project: ProjectFS) {
    mkdirSync(projectTarget, {recursive: true})
    let dirs: string[] = project.dirs.map((d) => d.relative)
    dirs.forEach((d) => {
        try {
            mkdirSync(`${projectTarget}/${d}`, {recursive: true})
        } catch (err) {
            console.log(`FAILURE: ${err}`)
        }
        mkdirSync(d, {recursive: true})
    })
}


export function generateProjectData(projectName: string, projectTarget: string=''): ProjectData {
    let project: ProjectFS = traverseProject(projectName)

    if (projectTarget) {
        initProjectFS(projectName, projectTarget, project)
    }
    let astdata = createASTs(project)

    return {
        project: project,
        asts: astdata
    }
}

