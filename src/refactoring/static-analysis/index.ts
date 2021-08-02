import {JSFile, ModuleAPIMap} from '../../filesystem'
import {ProjectManager} from '../../control'
import {getAccessedProperties} from "./accessed_properties";
import {forcedDefaults} from "./forced_defaults";
import {readIn, removeModuleDotExports} from "./readIn";
import {getShadowVars} from "./shadow_variables";

import chalk from 'chalk'
import {API_TYPE} from "../utility";
import {assert} from "chai";
import {getReassignedPropsOrIDs} from "../utility/getReassigned";
import {metavariables} from "./metavariables";

const {red, green, blue} = chalk
let log: { [key: string]: (...x) => void } = {}
log.red = (...x) => console.log(...x.map(e => red(e)))
log.green = (...x) => console.log(...x.map(e => green(e)))
log.blue = (...x) => console.log(...x.map(e => blue(e)))

export function runAnalyses(pm: ProjectManager) {


    pm.forEachSource(readIn)
    pm.forEachSource(removeModuleDotExports, 'removing module.exports*.*')
    pm.forEachSource((js:JSFile)=>{
        let int = js.getIntermediate()
        int.load_order.forEach((ms,index:number,array:string[])=>{
            if (ms.endsWith('.json')){
                let cjs = js.createCJSFromIdentifier(ms)
                array[index]=  cjs
                let _id = int.ms_to_id[ms]
                delete int.ms_to_id[ms]
                int.ms_to_id[cjs] = _id
                delete int.id_to_ms[ms]
                int.id_to_ms[cjs] = _id
            }
        })
    })
    pm.forEachSource(metavariables, 'metavariables')
    pm.forEachSource(getShadowVars)
    // log.green( 	JSON.stringify(im.getShadowVars(),null,3))
    pm.forEachSource(getAccessedProperties)
    // log.green( 	JSON.stringify(im ,null,3))


    pm.forEachSource(forcedDefaults)
    pm.forEachSource(getReassignedPropsOrIDs)
    // pm.forEachSource(e => console.log(e.getIntermediate()))
    let mmp = ModuleAPIMap.getInstance();
    pm.forEachSource((js) => {
        let interm = js.getIntermediate();
        let fds = interm.forcedDefaultMap;
        if (fds) {
            Object.keys(fds).forEach((fd) => {
                if (fds[fd]) {
                    let ms = interm.id_to_ms[fd];
                    let api = mmp.resolveSpecifier(js, ms);
                    api.setType(API_TYPE.default_only, true);
                    assert(api.getType() === API_TYPE.default_only);
                }
            });
        }
        // pm.
    });
    let todoisdoine = process.argv[7] && true;
    pm.forEachSource((js) => {
        if (!todoisdoine) {
            return;//TODO no idea
        }
        let inter = js.getIntermediate();
        let propreads = inter.getPropReads();
        let allProps = Object.keys(propreads).map(key => {
            return [key, inter.id_to_ms[key], propreads[key]];
        });
        allProps.forEach((allprop: [string, string, string[]]) => {
            let _api = mmp.resolveSpecifier(js, allprop[1]);
            let exported_props = _api.getExports();
            let imported_props = allprop[2];
            if (!imported_props.every(prop => exported_props.includes(prop))) {
                console.log("Forced DEFAULT: ", allprop[0], allprop[1]);
                _api.setType(API_TYPE.default_only, true);
            }
        });
    });
}

//
export * from './accessed_properties'
export * from './forced_defaults'
export * from './readIn'
export * from './shadow_variables'
export * from './tagger'
export * from './util/SequenceNumber'
