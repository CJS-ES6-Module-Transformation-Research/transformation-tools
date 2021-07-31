import {generate} from "escodegen";
import {parseScript} from "esprima";
import {Program} from "estree";
import {Namespace, JSFile,ModuleAPIMap} from '../../filesystem'
import {ProjectManager, ProjConstructionOpts} from '../../control'
import {getAccessedProperties} from "./accessed_properties";
import {forcedDefaults} from "./forced_defaults";
import {readIn} from "./readIn";
import {getShadowVars} from "./shadow_variables";

import chalk from 'chalk'
 import {API_TYPE} from "../utility";
import {assert} from "chai";
import {getReassignedPropsOrIDs} from "../utility/getReassigned";
import {Intermediate} from "../../utility/Intermediate";

const {red, green, blue} = chalk
let log: { [key: string]: (...x) => void } = {}
log.red = (...x) => console.log(...x.map(e => red(e)))
log.green = (...x) => console.log(...x.map(e => green(e)))
log.blue = (...x) => console.log(...x.map(e => blue(e)))

export function runAnalyses(pm: ProjectManager) {


    pm.forEachSource(readIn)

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
