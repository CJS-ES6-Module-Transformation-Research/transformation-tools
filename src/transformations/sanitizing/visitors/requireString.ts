import {generate} from "escodegen";
import {traverse, Visitor} from "estraverse";
import {Node, SimpleLiteral} from "estree";
import {TransformFunction} from "../../../abstract_fs_v2/interfaces";
import {JSFile} from "../../../abstract_fs_v2/JSv2";
import {RequireStringTransformer} from "../requireStringTransformer";


/**
 * Require string sanitizer visitor. Type of TransformFunction.
 * @param js a JSFile
 */
export const requireStringSanitizer: TransformFunction = function (js: JSFile) {
    // let requireStringTF: RequireStringTransformer = new RequireStringTransformer(dirname(js.getAbsolute()), js.getParent().getPackageJSON().getMain())
    let rst: RequireStringTransformer = new RequireStringTransformer(js)
    let re: RegExp = new RegExp('.+\.json$');

    let visitor: Visitor = {
        enter: function (node: Node): void {


            if (node.type === "CallExpression"
                && node.callee.type === "Identifier"
                && node.callee.name === "require"
                && node.arguments[0].type === "Literal") {
                let literal:SimpleLiteral = (node.arguments[0] as SimpleLiteral )

                // console.log(`import ing in ${js.getRelative()}  from m${literal.value.toString()}   which is in dir: ${_dir.getRelative()}`)
                let requireString: string = rst.getTransformed(literal.value.toString()) //requireStringTF.getTransformed(literal.value.toString(),js.getParent())
                if (re.test(requireString)) {
                    requireString =  js.createCJSFromIdentifier(requireString)
                    // literal.value = requireString
                    // literal.raw = `'${requireString}'`
                }
            // else {
            //         literal.value = requireString
            //         literal.raw = `'${requireString}'`
            //     }
            node.arguments[0] = {type:"Literal",value: requireString}
            // console.log (generate(node))
            // console.log(node.argume nnts[0] .toString() )
            }
        }
    };
    traverse(js.getAST(), visitor)
}

