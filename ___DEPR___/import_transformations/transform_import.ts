import {ProjectData} from "../Types";
import {ASTTransformer} from "../ast/transformationTools";
import {ImportTransformReport, importVisitor, mutator_imports} from "./import-visitor";

export function transformImports(transformer:ASTTransformer) {

console.log("Starting Import Transformations")
    transformer.transformWithTypeReturn<ImportTransformReport[]>(importVisitor,mutator_imports)
    transformer.currentPrograms().forEach(e=>console.log(`${e.name}
${e.program}\n\n`))
    console.log("Finished Import Transformations")

}