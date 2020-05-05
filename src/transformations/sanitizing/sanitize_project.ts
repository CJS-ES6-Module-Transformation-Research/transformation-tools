import {Transformer} from "../Transformer";
import {accessReplace, collectDefaultObjectAssignments, flattenDecls, requireStringSanitizer,jsonRequire} from "./visitors";
import {argv} from "process";
import {projectReader, TransformableProject} from "../../abstract_representation/project_representation";
import {existsSync} from "fs";


export function santiize(transformer: Transformer) {

  transformer.transform(requireStringSanitizer)
  transformer.transformWithProject(jsonRequire)
  transformer.transform(flattenDecls)
  transformer.transform(accessReplace)
  transformer.rebuildNamespace()
  transformer.transform(collectDefaultObjectAssignments)

}


const pwd = argv.shift();
argv.shift();

let source: string, dest: string, inPlace: boolean

switch (argv.length) {
  case 0:
    console.log("no arguments supplied");
    process.exit(1);
  case 1:
    let arg = argv.shift();
    if (arg === '-i') {
      console.log('please provide a project to transform')
    } else {
      console.log('please confirm you want to do this in place with the -i flag prior to your directory.')
    }
    process.exit(1);
  case 2:
    let first = argv.shift()
    let second = argv.shift()
    if (first === '-i') {
      inPlace = true;
      source = second;
      dest = source;
    } else {
      inPlace = false;
      source = first;
      dest = second;
    }
    if (!existsSync(dest)){
      console.log(`Source directory ${source} was not found. Please check input data.`)
    }

    break;
  default: {
    console.log('could not parse arguments--try again')
    process.exit(1);
  }
}
let project: TransformableProject = projectReader(source, 'script')
let transformer:Transformer = Transformer.ofProject(project);
santiize(transformer)
if (inPlace) {
  project.writeOutInPlace('.pre-transform')
}else{
  project.writeOutNewDir(dest)

}
console.log("finished.")