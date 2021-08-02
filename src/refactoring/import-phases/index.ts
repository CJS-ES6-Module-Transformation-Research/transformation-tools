import {JSFile, ModuleAPIMap} from "../../filesystem";
import {ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier} from "estree";
import {API, API_TYPE} from "../utility";
import {id} from "../../utility";

export function importer(js: JSFile) {


    let inter = js.getIntermediate()
    let MP = ModuleAPIMap.getInstance()
    let ms2id = inter.ms_to_id
    let order = inter.load_order

    let sorted = order.map(ms => {
        let id = ms2id[ms]
        return {ms: ms, id: id, api: MP.resolveSpecifier(js, ms)}
    })
    let imports:ImportDeclaration[]


    if (js.usesNamed()) {
        addNamedImports(js)//TODO write
        imports= null
        throw new Error('wrong js value for names ')
    } else {
        imports =  addDefaultImports(sorted)
    }
    js.getBody().splice(0,0,...imports)
}

function addNamedImports (js: JSFile): ImportDeclaration[]  {
return null
}


function addDefaultImports(sorted:{ ms: string; id: string, api: API }[]):ImportDeclaration[] {
  return  sorted.map((obj: { ms: string; id: string, api: API }) => {
        let imp: ImportDeclaration = {
            type: "ImportDeclaration",
            specifiers: [],
            source: {type: "Literal", value: `${obj.ms}`}
        }

        if (!obj.id) {
            return imp;
        } else {
            let specifier: ImportNamespaceSpecifier | ImportDefaultSpecifier = null;
            if (obj.api.getType() === API_TYPE.named_only) {
                specifier = {type: "ImportNamespaceSpecifier", local: id(obj.id)}

            } else if (obj.api.getType() === API_TYPE.default_only) {
                specifier = {type: "ImportDefaultSpecifier", local: id(obj.id)}

            } else {
                return null;
            }
            imp.specifiers.push(specifier)
            return imp;
        }

    }).filter(x => x !== null)
}
