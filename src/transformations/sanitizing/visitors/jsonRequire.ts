import {JSFile, JSONFile, TransformableProject} from "../../../abstract_representation/project_representation";
import {traverse, Visitor} from "estraverse";
import {dirname, join} from "path";
import relative from "relative";
import {ProjectTransformFunction} from "../../Transformer";

export const jsonRequire:ProjectTransformFunction = function (project: TransformableProject) {
    return function (js: JSFile): void {

        let re: RegExp = new RegExp('.+\.json$');

        let visitor: Visitor = {
            enter: (node, parent) => {
                if (node.type === "CallExpression"
                    && node.callee.type === "Identifier"
                    && node.callee.name === "require"
                    && node.arguments[0].type === "Literal"
                    && re.test(node.arguments[0].value.toString())) {
                    const requireString = node.arguments[0].value.toString();
                    // const file = join(js.getDir(), js.getRelative());
                    // const dir = ;
                    const joinedJson = join(dirname(js.getAbsolute()), requireString);
                    const suffix: string = ".export.js";

                    const json = relative(js.getDir(), joinedJson, null)
                    let jsonFile: JSONFile = project.getJSON(json);

                    const fileData = "module.exports = " + jsonFile.getText();
                    // let outfile = joinedJson + suffix;


                    project.addJS(json + suffix,fileData)
                    node.arguments[0].value = requireString + suffix
                }
            }
        }
        traverse(js.getAST(), visitor);
    }
}