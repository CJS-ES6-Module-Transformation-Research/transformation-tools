 import {transformImport} from "./visitors/import_replacement";
import {dirname} from './visitors/__dirname'
 import {ProjectManager} from "src/abstract_fs_v2/ProjectManager";
 export function importTransforms(projectManager:ProjectManager){

     projectManager.forEachSource(transformImport);
     projectManager.forEachSource(dirname);
}

