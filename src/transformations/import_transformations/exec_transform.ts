import {JSFile} from "../../abstract_representation/project_representation";
import {Transformer} from "../../transformations/Transformer";
import {transformImport} from "transformations/import_transformations/visitors/import_replacement";
import {dirname} from './__dirname'
 export function importTransforms(transformer:Transformer){
    transformer.transform((js)=>{


        // if(js.namespaceContains('process')
        //     && !js.getImportManager().importsThis('process', 'process') ){
        //     js.getImportManager().createDefault('process','process')
        // }
    })


    transformer.transform(transformImport);
    transformer.transform(dirname)
    ;
}

