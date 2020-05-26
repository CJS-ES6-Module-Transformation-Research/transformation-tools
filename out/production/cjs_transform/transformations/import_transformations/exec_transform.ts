 import {Transformer} from "../../transformations/Transformer";
import {transformImport} from "./visitors/import_replacement";
import {dirname} from './visitors/__dirname'
 export function importTransforms(transformer:Transformer){

    transformer.transform(transformImport);
    transformer.transform(dirname);
}

