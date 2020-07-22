 import {transformImport} from "./visitors/import_replacement";
import {addLocationVariables} from '../sanitizing/visitors/__dirname'
 import {ProjectManager} from "../../abstract_fs_v2/ProjectManager";
 export function importTransforms(projectManager:ProjectManager){

     projectManager.forEachSource(transformImport);
     projectManager.forEachSource(addLocationVariables);
}

