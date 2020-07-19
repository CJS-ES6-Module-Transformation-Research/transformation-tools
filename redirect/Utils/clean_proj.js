Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanProject = void 0;
const binary = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/clean`;
const child_process_1 = require("child_process");
function cleanProject() {
    return child_process_1.execFileSync(binary).toString();
}
exports.cleanProject = cleanProject;
