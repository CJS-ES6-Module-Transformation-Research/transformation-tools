import {traverse, Visitor, VisitorOption} from "estraverse";
import {Node} from 'estree'
import {parseScript} from "esprima";
import {generate} from "escodegen";

export function getModuleExportsAccesses() {


}

let count = 0;

let exportAccessGetter: visitFunc = (node, parent) => {
    if (node.type === "MemberExpression") {//&& parent.type !=="AssignmentExpression"
        if (
            node.object.type === "Identifier"
            && node.property.type === "Identifier"
            && ((node.object.name === "module" && node.property.name === "exports")
            || node.object.name === "exports")
        ) {
            count++
            // console.log(`NODE, PARENT`)
            // console.log(generate(node))
            console.log(generate(parent))
            // console.log(``)
        }
    }
}
const visitor: Visitor = {
    enter: exportAccessGetter
}

function hasIt(testNode: Node): boolean {
    let hasModEx = false;
    traverse(testNode, {
        enter: (node, parent) => {
            if (node.type === "MemberExpression") {//&& parent.type !=="AssignmentExpression"
                if (
                    node.object.type === "Identifier"
                    && node.property.type === "Identifier"
                    && ((node.object.name === "module" && node.property.name === "exports")
                    || node.object.name === "exports")
                ) {
                    hasModEx = true;
                }
            }
        }
    })
    return hasModEx;
}

const metaVisitor: Visitor = {
    enter: (node, parent) => {
        if (node.type === "MemberExpression" && parent.type !== "MemberExpression") {
            if (hasIt(node)) {

                if (parent.type !== "AssignmentExpression" || (parent.type === "AssignmentExpression" && parent.left !== node)) {
                    count++
                    console.log(`Detected: 
                    The Node: ${generate(node)}
                    The Parent: ${generate(parent)}
                             `)

                }

            }
        } else if (node.type === "Identifier" && node.name === "exports"&& parent.type !== "MemberExpression") {
            count++
            console.log(`Detected: 
                    The Node: ${generate(node)}
                    The Parent: ${generate(parent)}
                             `)
        }
    }
}

type visitFunc = (node: Node, parentNode: Node | null) => VisitorOption | Node | void;


let program: string = `
//red herrings 
module.exports.hello = "hello"
exports.world =  "world"

//1,2
module.exports = module.exports.hello+" "+exports.world
//3
exports.hello_world = module.exports +"world"

//4
if(module.exports){
//5
if(exports){
//6
module.exports.log("hello_world");

}else{
//7
let u = module.exports
//8
let v = exports
//9
let w = module.exports.hello_world
}
}

//10,11 
module.exports.fun(module.exports.arg);

`
let ast = parseScript(program)
traverse(ast, metaVisitor);

console.log(`count: ${count}`)