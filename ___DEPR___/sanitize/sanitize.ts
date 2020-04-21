import {generateProjectData} from "../depr.scripts/projectStructurBuilder";
import {ProjectData, RequireAccessIDs} from "../Types";
import {replaceJS} from "../depr/io/readOut";
import {ASTTransformer} from "../depr/ast/transformationTools";
import {requireStringSanitizer} from "./sanitize-visitors/requireString";
import {leaveFlatten} from "./sanitize-visitors/declFlattener";
import {accessDetectTransformer, populateAccessDecls} from "./sanitize-visitors/accessReplacer";
import {generate} from "escodegen";

//OLD SIG = projectName: string, projectTarget: string | null
// export function depr.sanitize(project: ProjectData) {
export function sanitize(transformer: ASTTransformer) {


    console.log("Starting SANITIZE Operations")

    transformer.transformWrapped(requireStringSanitizer)


    transformer.currentPrograms().forEach(e => console.log(`${e.name}
${e.program}\n\n`))

    transformer.transformWithVisitors({leave: leaveFlatten})


    transformer.currentPrograms().forEach(e => console.log(`${e.name}
${e.program}\n\n`))

    transformer
        .transformWithTypeReturn<RequireAccessIDs>(accessDetectTransformer,
            {
                supplier: function (): RequireAccessIDs {
                    let x = {};
                    return x;
                },
                mutator: populateAccessDecls
            });


    transformer.currentPrograms().forEach(e => console.log(`${e.name}
${e.program}\n\n`))

    console.log("Finished SANITIZE Operations")

}




