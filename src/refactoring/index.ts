import {ProjectManager} from "../control";
import {runAnalyses} from "./static-analysis";
import {add__dirname} from "./__dirname";
import {exporter} from "./export-phases";
import {importer} from "./import-phases";
import {PackageJSON} from "../filesystem";

export {clean} from './janitor'
export * as clean_phases from './janitor-phases/index'
export * from './utility'

export function refactor(pm:ProjectManager){
    runAnalyses(pm)
     pm.forEachSource(exporter)
    pm.forEachSource(importer)
    pm.forEachPackage((pkg:PackageJSON)=>pkg.makeModule())
}