Object.defineProperty(exports, "__esModule", { value: true });
const ProjectManager_1 = require("src/abstract_fs_v2/ProjectManager");
const pwd = `/Users/sam/Dropbox/Spring_20/research_proj/DEV_UTIL_DATA_HAS_DB/COMPLEX_FS_TO_PARSE`;
const owd = `/Users/sam/Dropbox/Spring_20/research_proj/DEV_UTIL_DATA_HAS_DB/__x`;
let pm = new ProjectManager_1.ProjectManager(pwd, {
    write_status: "in-place",
    isModule: false,
    suffix: '',
    target_dir: owd
});
pm.writeOut();
