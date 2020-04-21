// import {test_root} from '../../Utils/Dirs'

import {JSFile} from "./filesystem/JS";
import {ProcessProject} from './filesystem/FileProcessing'
import {TransformableProject} from "./filesystem/FS";


import {requireStringSanitizer} from "./visitors/sanitize/requireString";
import {accessReplace} from "./visitors/sanitize/accessReplacer";
import {flattenDecls} from "./visitors/sanitize/declFlattener";
import {collectDefaultObjectAssignments} from './visitors/sanitize/exportObjectNamer';
import {Transformer} from "./tools/transformation_tools/Transformer";
let test_root = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/fixtures/test_dir"

import { transformImport} from './visitors/import/import_replacement'
import {exportTransform} from "./visitors/exports/exportCollector";

const arg1: string = `${test_root}_2`
console.log("script start")
let project: TransformableProject = ProcessProject(arg1)
console.log("finished reading in")

let transformer = Transformer.ofProject(project);


// project.forEachSource((js:JSFile)=> {new RequireStringSanitizer().walk(js)})
// project.forEachSource((js:JSFile)=> {new  DeclarationFlattener().walk(js)})
// project.forEachSource((js:JSFile)=> {new  AccessReplacer().walk(js)})
// project.forEachSource((js:JSFile)=> {new  ImportTransformer().walk(js)})
//
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