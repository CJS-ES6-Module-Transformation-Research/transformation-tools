import {projectReader, TransformableProject} from "../../abstract_representation/project_representation";
import {Transformer} from "../Transformer";
import {accessReplace, collectDefaultObjectAssignments, flattenDecls, requireStringSanitizer,} from "./visitors";
import {test_root} from "../../../index";

const arg1: string = `${test_root}_2`
console.log("script start")
let project: TransformableProject = projectReader(arg1)
console.log("finished reading in")

let transformer = Transformer.ofProject(project);



// console.log('about to tf')
transformer.transform(requireStringSanitizer);
// console.log('about to tf1')
//
transformer.transform(flattenDecls)
// console.log('about to tf2')
transformer.transform(accessReplace);
transformer.transform(collectDefaultObjectAssignments);

project.writeOut('.old')