import {traverse, Visitor, VisitorOption} from "estraverse";
import {Node, MemberExpression} from 'estree'
import {parseScript} from "esprima";
import {generate} from "escodegen";
import {JSFile} from "../../abstract_representation/project_representation";

export function getModuleExportsAccesses() {


}

let count = 0;

let exportAccessGetter: visitFunc = (node: Node, parent: Node) => {
    if (node.type === "MemberExpression") {//&& parent.type !=="AssignmentExpression"
        if (
            node.object.type === "Identifier"
            && node.property.type === "Identifier"
            && ((node.object.name === "module" && node.property.name === "exports")
            || node.object.name === "exports")
        ) {
            count++

            console.log(generate(parent))
         }
    }
}
const visitor: Visitor = {
    enter: exportAccessGetter
}

function hasIt(testNode: Node): boolean {
    let hasModEx = false;
    traverse(testNode, {
        enter: (node: Node, parent: Node) => {
            if (node.type === "MemberExpression") {//&& parent.type !=="AssignmentExpression"
                if (
                    node.object.type === "Identifier"
                    && node.property.type === "Identifier"
                    && ((node.object.name === "module"
                    && node.property.name === "exports")
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
    enter: (node: Node, parent: Node) => {
        if (node.type === "MemberExpression" && parent.type !== "MemberExpression") {
            if (hasIt(node)) {

                if (parent.type !== "AssignmentExpression" || (parent.type === "AssignmentExpression" && parent.left !== node)) {
                    count++
                    // console.log(`Detected:
                    // The Node: ${generate(node)}
                    // The Parent: ${generate(parent)}
                    //          `)

                }

            }
        } else if (node.type === "Identifier" && node.name === "exports" && parent.type !== "MemberExpression") {
            count++
            // console.log(`Detected:
            //         The Node: ${generate(node)}
            //         The Parent: ${generate(parent)}
            //                  `)
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

function hasDefaultExport(js:JSFile){

    let hasDefault:boolean = false;
    // js.getAST()
    traverse(ast,{
        enter: (node: Node, parent: Node) => {
            let child: MemberExpression

            if (parent
                && parent.type === "ExpressionStatement"
                && node.type === "AssignmentExpression"
                && node.left.type === "MemberExpression") {
                child = node.left;

                if (
                    child.object.type === "Identifier"
                    && child.property.type === "Identifier"
                    && (child.object.name === "module"
                    && child.property.name === "exports")
                ) {

                    hasDefault = true;

                }

            }

        }
    });
    return hasDefault;
}


// traverse(ast, {
//         enter: (node: Node, parent: Node) => {
//             let child: MemberExpression
//
//             if (parent.type === "ExpressionStatement"
//                 && node.type === "AssignmentExpression"
//                 && node.left.type === "MemberExpression") {
//                 child = node.left;
//
//                 if (
//                     child.object.type === "Identifier"
//                     && child.property.type === "Identifier"
//                     && (child.object.name === "module"
//                     && child.property.name === "exports")
//                 ) {
//
//                     //true
//
//                 }
//
//             }
//
//         }
//     }
// );
// console.log("  "+hasDefaultExport(null))
ast = parseScript(`
module.exports = 32
`)


console.log(" true: "+hasDefaultExport(null))

ast = parseScript(`
module.exports = {a:"",b:3}
`)




console.log(" true: "+hasDefaultExport(null))

ast = parseScript(`
module.exports.val = 32
module.exports.d = "x"
module.exports.v.x = {a:"",b:3}
`)
console.log(" false: "+hasDefaultExport(null))


ast = parseScript(`
let x = module.exports
x = module.exports
`)

console.log(" false: "+hasDefaultExport(null))
ast = parseScript(`
let x = module.exports
x = module.exports
module.exports
`)
console.log(" false:  "+hasDefaultExport(null))
