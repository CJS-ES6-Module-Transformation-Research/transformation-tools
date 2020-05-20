import {traverse, Visitor, VisitorOption} from "estraverse";
import {
    Node,
    MemberExpression,
    AssignmentExpression,
    ExpressionStatement,
    Expression,
    Pattern,
    Directive,
    Statement, ModuleDeclaration, ClassExpression, FunctionExpression
} from 'estree'
import {parseScript} from "esprima";
import {generate} from "escodegen";
import {JSFile} from "../../abstract_representation/project_representation";
import {ExportBuilder} from "transformations/export_transformations/ExportsBuilder";
import {Namespace} from "abstract_representation/project_representation/javascript/Namespace";
import {aliases} from "typings/dist/aliases";

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

            // console.log(generate(parent))
        }
    }
}
const visitor: Visitor = {
    enter: exportAccessGetter
}
const defaultExport: exportNaming = {name: 'defaultExport', alias: 'defaultExport'};

export interface exportNaming {
    name: string
    alias: string
}

function getAssignableNameForDefault(assignable: Expression, namespace: Namespace): exportNaming {
    switch (assignable.type) {
        case "ClassExpression":
        case "FunctionExpression":
            if (assignable.id.name) {
                return {name: assignable.id.name, alias: namespace.generateBestName(assignable.id.name).name}
            } else {

                return defaultExport;
            }
            break;

    }
    return {name: 'defaultExport', alias: generate('defaultExport')};
}

function getAssignebaleValue(assignable: Expression): string {
    throw new Error('todo')
}

function extractNameFromValue(assignable: Expression, namespace: Namespace, prop: string = ''): exportNaming {

    if (prop) {
        return {
            name: prop,
            alias: namespace.generateBestName(prop).name
        }
    }
    switch (assignable.type) {
        case "Identifier":
            return {
                name: assignable.name,
                alias: namespace.generateBestName(assignable.name).name
            }
        case "MemberExpression":
            let splits: string = generate(assignable).replace(/\./, '_')
            return {
                name: splits,
                alias: namespace.generateBestName(splits).name
            }
    }

}

function overTopLevel(body: Array<Directive | Statement | ModuleDeclaration>) {
    let js: JSFile;
    let exportBuilder: ExportBuilder = js.getExportBuilder()

    //js.getAST().
    body.forEach((value, index, array) => {
        // console.log(generate(((value as ExpressionStatement).expression as AssignmentExpression).right))

        if (value.type === "ExpressionStatement"
            && value.expression.type === "AssignmentExpression") {
            let assigned: Pattern = value.expression.left;
            let assignable: Expression = value.expression.right;

            let anExportName: exportNaming

            if (assigned.type === "MemberExpression") {
                let memex: MemberExpression = assigned;


//module.exports.y = x
                if (memex.object.type === "MemberExpression"
                    && memex.property.type === "Identifier"
                    && memex.object.object.type === "Identifier"
                    && memex.object.property.type === "Identifier"
                    && memex.object.object.name === "module"
                    && memex.object.property.name === "exports"

                ) {
                    let mod, ex, prop;
                    mod = memex.object.object.name
                    ex = memex.object.property.name
                    prop = memex.property.name
                    anExportName = extractNameFromValue(assignable, js.getNamespace(), prop);
                    exportBuilder.registerName(anExportName,assignable )
                    console.log(`${mod}.${ex}.${prop} = ${generate(assignable)};`)
                } else if (memex.object.type === "Identifier" && memex.property.type === "Identifier") {
                    let mod, ex, prop;
                    if (memex.object.name === "module" && memex.property.name === "exports") {
                        mod = memex.object.name
                        ex = memex.property.name

                        let regName = getAssignableNameForDefault(assignable, js.getNamespace());
                        exportBuilder.registerDefault(regName, assignable)

                        console.log(`${mod}.${ex} = ${generate(assignable)};`)
                    } else if (memex.object.name === "exports") {
                        ex = memex.object.name;
                        prop = memex.property.name
                        console.log(`${ex}.${prop} = ${generate(assignable)};`)
                        anExportName = extractNameFromValue(assignable, js.getNamespace(), prop);
                        exportBuilder.registerName(anExportName,assignable )

                    }
                }
                // else if (memex.object.type === "Identifier"
                //     && memex.object.name === "module") {
                //     if (memex.property.type === "MemberExpression"
                //         && memex.property.object.type === "Identifier"
                //         && memex.property.object.name === "exports"
                //         && memex.property.property.type === "Identifier") {
                //         let named = memex.property.property.name;
                //         console.log(`named detection in named module.exports: ${named}`)
                //
                //     }
                //exports.y = x
            }
            // else if (memex.object.type === "Identifier"
            //     && memex.object.name === "exports"
            //     && memex.property.type === "Identifier"
            // ) {
            //     let named = memex.property.name;
            //     console.log(`named detection in named exports: ${named}`)
            // } else {
            //     console.log(`ignored: ${generate(memex)}\n\n${memex}`)
            //
            // }
            // }

        }
    });


}

function hasExports(testNode: Node): boolean {
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
            if (hasExports(node)) {

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

//
// function isTopLevelMemberExp(node: Node, parent: Node): boolean {
//     return parent
//         && parent.type === "ExpressionStatement"
//         && node.type === "AssignmentExpression"
//         && node.left.type === "MemberExpression"
// }


function testHasDefault(node: Node, parent: Node): boolean {

    let child: MemberExpression

    if (isTopLevelMemberExp1Arg(node)) {
        child = ((node as AssignmentExpression).left as MemberExpression);
        ;
    } else {
        return false;
    }
}

interface defaultExport {
    isObject: boolean
    identifier?: string
    rhs: Expression
}

interface namedExport {
    identifier: string
    declaration_alias: string
    rhs: Expression
}

function isTopLevelMemberExp1Arg(node: Node): boolean {
    if (!node || node.type !== "ExpressionStatement") {
        return false;
    }

    let child = node.expression;
    return node
        && child.type === "AssignmentExpression"
        && child.left.type === "MemberExpression"
}

function getMemExFromStmt(node: AssignmentExpression): MemberExpression {


    if (node.type === "AssignmentExpression"
        && node.left.type === "MemberExpression") {
        return node.left;
    }
}

function getDefault(node: AssignmentExpression): defaultExport {
    let mmx = getMemExFromStmt(node);
    if (!mmx) {
        return;
    }
    //builder ???
    throw new Error('todo?')

}

// function getNamed(node: MemberExpression): namedExport | string {
//     throw new Error('todo?')
// }

//lhs of default
function isModuleDotExportsLHS(memex: MemberExpression) {
    let choice = memex.object.type === "Identifier"
        && memex.property.type === "Identifier"
        && (memex.object.name === "module"
            && memex.property.name === "exports")

}

//named
function isExportsDotNamed(memex: MemberExpression): boolean {
    return (memex.object.type === "Identifier"
        && memex.property.type === "Identifier"
        && (memex.object.name === "exports"))
}


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

function hasDefaultExport(js: JSFile) {

    let hasDefault: boolean = false;
    // js.getAST()
    traverse(ast, {
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
module.exports.gamma = 'gamma'
exports.hello = 'hello_owrld' 
module.exports = function(a){return; }
module.exports = function aFunc(a){return; }

module.exports.unnamedFunc = function(a){return; }
module.exports.namedFunc = function aFunc(a){return; }

module.exports.alpha = 99
module.exports.beta = 'beta'
`)
overTopLevel(ast.body)
console.log('\n\n')
// ast.body.forEach(e=>console.log(generate(e)))

console.log('\n\n')
// ast.body.forEach(e=>console.log(` ${e.type ? generate( (((e as ExpressionStatement).expression) as AssignmentExpression).right):e.type}`))

process.exit(0)
// ast = parseScript(`
// module.exports = 32
// module.exports.alpha = 'gamma'
//
// exports.hello=" world"
//
// `)
// console.log(JSON.stringify(ast,null,4))


//
//
// console.log(" true: " + hasDefaultExport(null))
//
// ast = parseScript(`
// module.exports = {a:"",b:3}
// `)
//
//
// console.log(" true: " + hasDefaultExport(null))
//
// ast = parseScript(`
// module.exports.val = 32
// module.exports.d = "x"
// module.exports.v.x = {a:"",b:3}
// `)
// console.log(" false: " + hasDefaultExport(null))
//
//
// ast = parseScript(`
// let x = module.exports
// x = module.exports
// `)
//
// console.log(" false: " + hasDefaultExport(null))
// ast = parseScript(`
// let x = module.exports
// x = module.exports
// module.exports
// `)
// console.log(" false:  " + hasDefaultExport(null))
