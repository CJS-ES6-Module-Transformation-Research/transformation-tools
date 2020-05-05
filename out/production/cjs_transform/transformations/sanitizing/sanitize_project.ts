import {projectReader, TransformableProject} from "../../abstract_representation/project_representation";
import {Transformer} from "../Transformer";
import {accessReplace, collectDefaultObjectAssignments, flattenDecls, requireStringSanitizer,} from "./visitors";
import {test_root} from "../../../index";
import {rmdirSync, unlinkSync} from "fs";
import {jsonRequire} from "../../../src/transformations/sanitizing/visitors/jsonRequire";

let  arg1: string = `${test_root}_2`
console.log("script start")
arg1 = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/fixtures/test_proj`
// arg1 = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/fixtures/test_proj_inPLace`
// arg1 = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/sanitize/qccess_replace/accessFiles`

let project: TransformableProject = projectReader(arg1)
console.log("finished reading in")

let transformer = Transformer.ofProject(project);



console.log('about to tf0')
transformer.transform(requireStringSanitizer);
transformer.transform( jsonRequire(project));
console.log('about to tf1')
//
// transformer.transform(flattenDecls)
// console.log('about to tf2')
// transformer.transform(accessReplace);
// console.log('about to tf3')
//
// transformer.transform(collectDefaultObjectAssignments);
// console.log('about to write out')
// // project.display()
const writeTarget:string = '/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/fixtures/json'
// rmdirSync(writeTarget,{recursive:true});
project.writeOutNewDir(writeTarget)
// project.writeOutInPlace('.X')
console.log('post-writeout')
