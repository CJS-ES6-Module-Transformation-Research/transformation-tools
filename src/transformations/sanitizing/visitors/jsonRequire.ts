import {JSFile, JSONFile, TransformableProject} from "../../../abstract_representation/project_representation";
import {traverse, Visitor} from "estraverse";
import {dirname, join} from "path";
import relative from "relative";
import {ProjectTransformFunction} from "../../Transformer";
import {normalize, resolve} from 'path'

export const jsonRequire: ProjectTransformFunction = function (project: TransformableProject) {
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
                    // console.log(joinedJson)
                    // console.log(`getdir\t`+js.getDir())
                    // console.log(`getdir\t`+js.getRelative())
                    // console.log(joinedJson.replace(js.getDir(),''))
                    // console.log(relative(js.getDir(), joinedJson, null))


                    const json = joinedJson.replace(js.getDir(), '')
                        .substr(1)//relative(js.getDir(), joinedJson, null)
                    let jsonFile: JSONFile
                    try {
                        jsonFile = project.getJSON(json);
                    } catch (err) {

                        console.log(`getJson threw ex : ${json}`)
                        console.log(`error was ${err}`)
                    }

                    let fileData = "module.exports = "
                    try {
                        fileData += jsonFile.getText();
                        // let outfile = joinedJson + suffix;
                    } catch (e4) {
                        console.log(`JSON : ${json}`)
                        console.log('caught getText exception.')
                        console.log("has file data:  "+(fileData!=='') +'\n'+e4);
                        throw e4;
                    }
                    try {
                        project.addJS(json + suffix, fileData)
                        node.arguments[0].value = requireString + suffix
                    } catch (err) {
                        console.log(`addJS of ${json + suffix} threw exception...`)
                        console.log(` ^ tried to create file but failed\nwith error ${err}\n\n`);
                        throw err;
                    }
                }
            }
        }
        traverse(js.getAST(), visitor);
    }
}