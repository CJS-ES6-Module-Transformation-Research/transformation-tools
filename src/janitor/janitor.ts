import {ProjectManager} from "../abstract_fs_v2/ProjectManager";
import pt1 from "./pass0";

// export const tf : (pm:ProjectManager)=>void =     (pm:ProjectManager) => {
// 	pm.forEachSource(pt1);
// };
export const clean = (pm:ProjectManager) => {
	pm.forEachSource(pt1);
};
export {clean as default}