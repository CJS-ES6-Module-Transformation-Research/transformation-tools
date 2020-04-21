
import {ProcessProject} from '../abstract_representation/project_representation/FileProcessing'
import {TransformableProject} from "../abstract_representation/project_representation/FS";
import {requireStringSanitizer} from "./sanitizing/visitors/requireString";
import {accessReplace} from "./sanitizing/visitors/accessReplacer";
import {flattenDecls} from "./sanitizing/visitors/declFlattener";
import {collectDefaultObjectAssignments} from './sanitizing/visitors/exportObjectNamer';
import {Transformer} from "./Transformer";
let test_root = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/fixtures/test_dir"

import { transformImport} from './import_transformations/visitors/import_replacement'
import {exportTransform} from "./export_transformations/visitors/exportCollector";

const arg1: string = `${test_root}_2`
console.log("script start")
let project: TransformableProject = ProcessProject(arg1)
console.log("finished reading in")

let transformer = Transformer.ofProject(project);



// console.log('about to tf')
transformer.transform(requireStringSanitizer)
// console.log('about to tf1')
//
transformer.transform(flattenDecls)
// console.log('about to tf2')
transformer.transform(accessReplace)

transformer.rebuildNamespace()

transformer.transform(collectDefaultObjectAssignments)
// console.log('about to write out')
transformer.transform(transformImport)
transformer.transform(exportTransform)
project.writeOut()