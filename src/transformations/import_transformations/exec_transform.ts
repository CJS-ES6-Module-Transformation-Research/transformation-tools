 import {transformImport} from "./visitors/import_replacement";
import {add__dirname} from '../sanitizing/visitors/__dirname'
 import {ProjectManager} from "../../abstract_fs_v2/ProjectManager";
 export function importTransforms(projectManager:ProjectManager){

     projectManager.forEachSource(transformImport);
     projectManager.forEachSource(add__dirname);
}

