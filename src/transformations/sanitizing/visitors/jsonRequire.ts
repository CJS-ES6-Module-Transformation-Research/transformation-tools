// test_resources.import {JSFile, TransformableProject} from "../../../abstract_representation/project_representation";
import {traverse, Visitor} from "estraverse";
import {SimpleLiteral} from "estree";
import path, {dirname, join} from "path";
import {existsSync} from "fs";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {TransformFunction} from "../../../abstract_fs_v2/interfaces";


/**
 * TransformFunction for creating a JSONFile from a require string of the form '*.json'.
 * @param project the TransformableProject.
 */
export const jsonRequire: TransformFunction =  function (js: JSFile): void {

        let re: RegExp = new RegExp('.+\.json$');

        let visitor: Visitor = {
            enter: (node, parent) => {
                let re: RegExp = new RegExp('.+\.json$');

                if (node.type === "CallExpression"
                    && node.callee.type === "Identifier"
                    && node.callee.name === "require"
                    && node.arguments[0].type === "Literal"
                    && re.test((node.arguments[0] as SimpleLiteral).value.toString())) {
                    (node.arguments[0] as SimpleLiteral).value = js.createCJSFromIdentifier((node.arguments[0] as SimpleLiteral).value.toString())
                }
            }
        }
        traverse(js.getAST(), visitor);

}