import {JSFile} from "../../abstract_representation/project_representation";
import {Transformer} from "../../transformations/Transformer";

export function importTransforms(transformer:Transformer){
    transformer.transform((js)=>{
        if(js.namespaceContains('process')
            && !js.getImportManager().importsThis('process', 'process') ){
            js.getImportManager().createDefault('process','process')
        }
    });
}