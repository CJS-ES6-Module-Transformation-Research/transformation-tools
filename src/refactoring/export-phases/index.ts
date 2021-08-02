import {JSFile, ModuleAPIMap} from "../../filesystem";
import {API_TYPE} from "../utility";
import {DECL_FACTORY, id} from "../../utility";
import {ExportDefaultDeclaration, ExportNamedDeclaration, ExportSpecifier} from "estree";
import spec = Mocha.reporters.spec;

export function exporter(js: JSFile) {
    let exportMap: { [m: string]: string } = js.getIntermediate().getExportMap()
    let api = js.getApi()
    let exportStmt: (ExportDefaultDeclaration | ExportNamedDeclaration) = null
    switch (api.getType()) {
        case API_TYPE.named_only:
            let specifiers:ExportSpecifier[] = []
            Object.keys(exportMap).forEach(name=>{
                specifiers.push( exSpecFactory(exportMap[name],name))
            })
            exportStmt = {
                type:"ExportNamedDeclaration",
                specifiers:specifiers
            };

            break;
        case API_TYPE.default_only:
            exportStmt =DECL_FACTORY.createDefaultExport(js.getDefaultExport().name)
            break;
    }
    if (exportStmt){
        js.getBody().push(exportStmt)
    }
}

function exSpecFactory(local: string, name: string = local): ExportSpecifier {
    return {
        type: "ExportSpecifier",
        local: id(local),
        exported: id(name)
    }
}