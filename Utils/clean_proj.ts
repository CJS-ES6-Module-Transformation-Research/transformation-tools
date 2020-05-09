const binary = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/clean`
import {execFileSync} from 'child_process'

export function cleanProject() {
    return execFileSync(binary).toString();
}

export default cleanProject;