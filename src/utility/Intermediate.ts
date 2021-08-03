import {Identifier, Node, VariableDeclaration} from "estree";
import {ShadowVariableMap} from "./types";
import {API, API_TYPE} from "../refactoring/utility";
import {JSFile} from "../filesystem";
import {declare, id} from "./factories";

type S2<T> = { [p: string]: T }

export class Intermediate {

    private shadowVarMap: { [p: string]: string[] } = {};
    // readonly declCounts: S2<number>;
    // readonly import_decls: (ExpressionStatement | VariableDeclaration)[];
    private exportMap: S2<string>;
    readonly id_to_ms: S2<string>;
    readonly load_order: string[];
    readonly ms_to_id: S2<string>;
    readonly id_aliases: { [p: string]: string[] };
    readonly shadows: ShadowVariableMap = {};
    // readonly rpiMap: { [id: string]: ReqPropInfo }
    readonly forcedDefaultMap: { [p: string]: boolean }
    readonly propReads: { [p: string]: string[] }

    constructor(  id_to_ms: { [id: string]: string }, ms_to_id: { [ms: string]: string }, load_order: string[]) {
        // this.id_aliases = id_aliases
        // this.declCounts = declCounts
        // this.exportMap = exportMap
        this.id_to_ms = id_to_ms
        this.ms_to_id = ms_to_id
        // this.import_decls = import_decls
        this.load_order = load_order
        this.shadows = {}
        this.propReads = {}
        this.shadows = {}
        this.forcedDefaultMap = {}


        Object.keys(this.id_to_ms).forEach(modid => {

            this.forcedDefaultMap[modid] = false;
            this.propReads[modid] = []
        })


    }

    getExportMap() {
return this.exportMap
    }

    buildExports(api: API, exportMap: { [ms: string]: string }): VariableDeclaration {
        this.exportMap = exportMap
        let exportNames: string[] = Object.keys(this.exportMap)

        this.createAPI(exportNames, api);


        return {
            type: "VariableDeclaration", kind: "var",
            declarations: exportNames
                .filter (e=> e !==exportMap['default'])
                .map(e=> exportMap[e])
                .map(id)
                .map(ident => declare(ident))
        }
    }

    private createAPI(exportNames: string[], api: API) {
        if (exportNames.length > 0) {
            if (this.exportMap['default']) {
                api.setType(API_TYPE.default_only);
            } else {
                api.setType(API_TYPE.named_only);
            }
        } else {
            api.setType(API_TYPE.none);
        }
        api.setNames(exportNames);
    }

    getShadowVars(): ShadowVariableMap {
        return this.shadows
    }


    getPropReads(): { [p: string]: string[] } {
        return this.propReads
    }

    addForcedDefault(id: string, reason: string = ''): void {
        // if(reason) {
        //     console.log(`adding ${id} as forced default with reason: ${reason}`);
        // }
        this.forcedDefaultMap[id] = true
    }


    getListOfIDs(): string[] {
        return Object.keys(this.id_to_ms)
    }

    setShadowVarsFromList(listOfShadowIDs: { [id: string]: number[] }, idMap: { [p: number]: Node }) {
        let shadowVarMap: { [id: string]: string[] } = {}

        Object.keys(listOfShadowIDs)
            .forEach(ident => {
                shadowVarMap[ident] = listOfShadowIDs[ident]
                    .map(e => (idMap[e] as Identifier).name);
            })
        this.shadowVarMap = shadowVarMap
    }
}

//
// interface IEData {
//     declCounts: { [key: string]: number }
//     load_order: string[]
//     id_to_ms: { [str: string]: string }
//     ms_to_id: { [str: string]: string }
//     id_aliases: { [str: string]: string[] }
//
//     exportMap: { [str: string]: string }
//     import_decls: (ExpressionStatement | VariableDeclaration)[]
//     shadows: ShadowVariableMap
//     // rpiMap: { [id: string]: ReqPropInfo }
//     forcedDefaultMap: { [key: string]: boolean }
//     propReads: { [key: string]: string[] }
//
// }