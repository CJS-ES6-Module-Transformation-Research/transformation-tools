import {
    AssignmentExpression,
    CallExpression,
    Expression,
    Literal,
    MemberExpression,
    Node,
    ObjectExpression,
    Pattern,
    Property
} from 'estree'
import {replace, traverse, Visitor} from "estraverse";
import {parseScript, Program, Syntax} from "esprima";
import {generate} from "escodegen";
import {JSFile} from "../../../abstract_representation/project_representation/javascript/JSFile";
import {isExpr} from "../../../abstract_representation/es_tree_stuff/astTools";
import {createAnExport} from "../../../abstract_representation/es_tree_stuff/exportsTools";
import {DEFAULT_EXPORT_STRING, ExportData, ExportInstance} from "./types";




let program = `
module.exports = "hello world"
module.exports.hello = "world" 
exports.asdf = 3
x.exports = 32;
module.hello = 33

`
let ast = parseScript(program);

export function exportTransform(js: JSFile) {
    let exportKV: ExportData = {names: [], hasDefault: false};
    let properties: Property[] = []
    let defaultVisitor: Visitor = {
        enter: (node: Node, parent: Node) => {
            let child: Node

            if (node.type === "AssignmentExpression") {
                child = node.left;
                child = node.left;

                if (child.type === "MemberExpression"
                    && child.object.type === "Identifier"
                    && child.property.type === "Identifier"
                    && child.object.name
                    && child.object.name === 'module'
                    && child.property.name === 'exports') {
                    exportKV.hasDefault = true
                    let anExp = {
                        isDefault: true,
                        expr: node.right,
                        isNamed: false,
                        alias: node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING,
                        identifier: node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING,
                        type: node.right.type
                    }
                    exportKV.names.push(anExp)
                    properties.push(createProp(anExp))
                    return createAnExport(anExp);

                }
            }
        }
    }

    // let namedVisitor0: Visitor = {
    //     enter: (node: Node, parent: Node) => {
    //         let child: Node
    //
    //         if (node.type === "AssignmentExpression") {
    //             child = node.left;
    //
    //             if (node.type === "AssignmentExpression"
    //                 && child.type === "MemberExpression"
    //                 && child.object.type === "MemberExpression"
    //                 && child.object.object.type === "Identifier"
    //                 && child.object.property.type === "Identifier"
    //                 && child.object.object.name === "module"
    //                 && child.property.type === "Identifier"
    //             ) {
    //                 let anExp = {
    //                     identifier: `${child.property.name}`,
    //                     isDefault: false,
    //                     expr: node.right,
    //                     isNamed: true,
    //                     alias: `__${child.property.name}_namedExport`,
    //                     type: node.right.type
    //                 };
    //                 exportKV.names.push(anExp)
    //                 properties.push(createProp(anExp))
    //                 return createAnExport(anExp);
    //             }
    //         }
    //     }
    // }
    //
    // let namedVisitor1: Visitor = {
    //     enter: (node: Node, parent: Node) => {
    //         let child: Node
    //
    //         if (node.type === "AssignmentExpression") {
    //             child = node.left;
    //
    //             if (node.type === "AssignmentExpression"
    //                 && child.type === "MemberExpression"
    //                 && child.object.type === "Identifier"
    //                 && child.property.type === "Identifier"
    //                 && child.object.name === "exports"
    //             ) {
    //                 let anExp = {
    //                     isDefault: false,
    //                     identifier: `${child.property.name}`,
    //                     expr: node.right,
    //                     isNamed: true,
    //                     alias: `__${child.property.name}_namedExport`,
    //                     type: node.right.type
    //                 }
    //                 exportKV.names.push(anExp)
    //                 properties.push(createProp(anExp))
    //                 return createAnExport(anExp);
    //             }
    //         }
    //     }
    // }


    replace(js.getAST(), {});

    if (!exportKV.hasDefault && properties) {
        js.getAST().body.push({
            type: "ExportDefaultDeclaration",
            declaration: {
                type: "ObjectExpression",
                properties: properties
            }


        })
    }


}


function createProp(ex: ExportInstance): Property {

    return {
        kind: "init",
        method: false,
        type: Syntax.Property,

        shorthand: true,
        computed: false,
        key: {
            type: "Identifier",
            name: ex.identifier
        },

        value: {
            type: "Identifier",
            name: ex.identifier
        }
    };
}

// replace(depr.ast, visitor)
// console.log(generate(depr.ast))

// program = `module.exports = 32; `
// console.log(JSON.stringify(parseScript(program), null, 5))


// console.log(JSON.stringify(parseModule(`
// // let x = 99
// export {x as fghj}
// export default value
// export const y = 32
// export default {a,b , c : f}
// `), null, 5));



let exportKV: ExportData = {names: [], hasDefault: false};


let defaultVisitor: Visitor = {
    enter: (node: Node, parent: Node) => {
        let child: Node

        if (node.type === "AssignmentExpression") {
            child = node.left;
            child = node.left;

            if (child.type === "MemberExpression"
                && child.object.type === "Identifier"
                && child.property.type === "Identifier"
                && child.object.name
                && child.object.name === 'module'
                && child.property.name === 'exports') {
                exportKV.hasDefault = true

                let anExp = {
                    isDefault: true,
                    expr: node.right,
                    isNamed: false,
                    alias: node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING,
                    identifier: node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING,
                    type: node.right.type
                }

                return createAnExport(anExp);

            }
        }
    }
}


// let namedVisitor0: Visitor = {
//     enter: (node: Node, parent: Node) => {
//         let child: Node
//
//         if (node.type === "AssignmentExpression") {
//             child = node.left;
//
//             if (child.type === "MemberExpression"
//                 && child.object.type === "MemberExpression"
//                 && child.object.object.type === "Identifier"
//                 && child.object.property.type === "Identifier"
//                 && child.object.object.name === "module"
//                 && child.property.type === "Identifier"
//             ) {
//                 console.log(`
//                  ${generate(node.right)}
//                  ${generate(parent)}`)
//                 let anExp = {
//                     identifier: `${child.property.name}`,
//                     isDefault: false,
//                     expr: node.right,
//                     isNamed: true,
//                     alias: `__${child.property.name}_namedExport`,
//                     type: node.right.type
//                 };
//                 exportKV.names.push(anExp)
//                 return createAnExport(anExp);
//             }
//         }
//     }
// }
//
// let namedVisitor1: Visitor = {
//     enter: (node: Node, parent: Node) => {
//         let child: Node
//
//         if (node.type === "AssignmentExpression") {
//             child = node.left;
//
//             if (child.type === "MemberExpression"
//                 && child.object.type === "Identifier"
//                 && child.property.type === "Identifier"
//                 && child.object.name === "exports"
//             ) {
//                 console.log(`
//                  ${generate(node.right)}
//                  ${generate(parent)}`)
//
//                 let anExp = {
//                     isDefault: false,
//                     identifier: `${child.property.name}`,
//                     expr: node.right,
//                     isNamed: true,
//                     alias: `__${child.property.name}_namedExport`,
//                     type: node.right.type
//                 }
//                 exportKV.names.push(anExp)
//                 return createAnExport(anExp);
//             }
//         }
//     }
// }


const namedVisitor: Visitor = {
    enter: (node: Node, parent: Node) => {

        if (node.type === "AssignmentExpression" && node.left.type === "MemberExpression") {
            let child: MemberExpression = node.left;
            if (
                (child.object.type === "MemberExpression"
                    && child.object.object.type === "Identifier"
                    && child.object.property.type === "Identifier"
                    && child.object.object.name === "module"
                    && child.property.type === "Identifier")
                ||
                (child.object.type === "Identifier"
                    && child.property.type === "Identifier"
                    && child.object.name === "exports")

            ) {
                let identifier = `${getName(node, parent, child)}`;
                let alias = `__${identifier}_namedExport`

                return {
                    type: "ExportNamedDeclaration",
                    declaration: {
                        type: "VariableDeclaration",
                        declarations: [{
                            type: "VariableDeclarator",
                            id: {type: "Identifier", name: alias},
                            init: node.right
                        }],
                        kind: "const"
                    },
                    specifiers: [
                        {
                            type: "ExportSpecifier",
                            exported: {
                                type: "Identifier",
                                name: identifier
                            },
                            local: {
                                type: "Identifier",
                                name: alias
                            }
                        }
                    ],
                    source: null //todo verify source can be null
                }
            }
        }
    }
}


export function getName(node: AssignmentExpression, parent: Node, child: MemberExpression) {
    if (child.object.type === "MemberExpression"
        && child.object.object.type === "Identifier"
        && child.object.property.type === "Identifier"
        && child.object.object.name === "module"
        && child.property.type === "Identifier") {
        return child.property.name
    } else if (child.object.type === "Identifier"
        && child.property.type === "Identifier"
        && child.object.name === "exports") {
        return child.property.name
    }
}


function printProperties(obj: ObjectExpression) {
    obj.properties.forEach(e => {
            if (e.type === "Property") {
                if (e.key.type === "Identifier") {


                    let m: MemberExpression = {
                        type: "MemberExpression",
                        object: {type: "Identifier", name: "module"},
                        computed: e.computed,
                        property: {type: "Identifier", name: "exports"}
                        // property: {
                        //     type: "MemberExpression",
                        //     object: ,
                        //     computed: true,
                        //     property: e.key,
                        // }

                    }


                    let as: AssignmentExpression;
                    if (isExpr(e.value.type)) {
                        as = {
                            type: "AssignmentExpression",
                            left: m,
                            right: (e.value as Expression),
                            operator: "="

                        }
                        console.log(generate(as))

                    } else {
                        console.log("TYPE OF " + e.key.name + "'s value is:  " + e.value.type)
                    }
                } else {
                    //if not identirfier
                    console.log(e.type)
                }
            }

        }
    )
}


program =
    `
module.exports = {
a:b,
c:d,
e
};
module.exports = "hello world"
module.exports.hello = "world" 
exports.asdf = 3
x.exports = 32;

module.exports = {
hello:"world",
turing:"complete",
three:asx,
four:3
 }

module.hello = 33
x.exports.hello = yjack
`
// try {
//     ast = parseScript(program)
//     printProperties(collectDefaultObjectAssignments(ast)[0])
// } catch (e) {
//     console.log(e)
// }


// console.log(JPP(
//     parseScript(`
// // let x
// // v[exec()] = 32
// // u = v[fn()]
// // let v = {
// // "":"w"
// // }
//
// module.exports = {
// a:require(x),
// c:3,
// z:'hrllo',
// cz:id,
// zc:{_object:expression}
// };
//
// `)))


let scpt = parseScript(`
if (32 ===0){
    module.exports = {zero:0}
    if (-5 ===0){
    module.exports = {one:1}
}
function alpha(romeo){
module.exports = {romeo}
}
}
module.exports = {
a:require(x),
c:3,
z:'hrllo',
cz:id,
zc:{_object:expression},
zZ:zz
};
let x = 32
`)


export interface NamedExports {
    [key: string]: Expression
}

export interface ExportAliases {
    [key: string]: string
}

export interface ExportInfo {
    exports: NamedExports
    aliases: ExportAliases
}

export interface DefaultExport {
    expr: Expression
    identifier: string
    type: string
    alias: string

}

function processNamedExports(exportInfo: ExportInfo) {
    let namedEX: NamedExports = exportInfo.exports;
    let aliases: ExportAliases = exportInfo.aliases;
   
    function getAllNamed(js: JSFile) {


        const namedVisitor: Visitor = {
            enter: (node: Node, parent: Node) => {

                if (node.type === "AssignmentExpression" && node.left.type === "MemberExpression") {
                    let child: MemberExpression = node.left;
                    if (
                        (child.object.type === "MemberExpression"
                            && child.object.object.type === "Identifier"
                            && child.object.property.type === "Identifier"
                            && child.object.object.name === "module"
                            && child.property.type === "Identifier")
                        ||
                        (child.object.type === "Identifier"
                            && child.property.type === "Identifier"
                            && child.object.name === "exports")

                    ) {
                        let identifier = `${getName(node, parent, child)}`;
                        let alias = ` _${identifier}_namedExport`
                        namedEX[identifier] = node.right;
                        if (js.namespaceContains(identifier)) {
                            aliases[identifier] = alias;
                        }
                    }
                }
            }
        }
        traverse(js.getAST(), namedVisitor);

    }

    return getAllNamed;
}

function hasDefaultExport(ast: Program) {

    let count = 0;
    let default_: DefaultExport = null;
    let defaultVisitor: Visitor = {
        enter: (node: Node, parent: Node) => {
            let child: Node

            if (node.type === "AssignmentExpression") {
                child = node.left;
                child = node.left;

                if (child.type === "MemberExpression"
                    && child.object.type === "Identifier"
                    && child.property.type === "Identifier"
                    && child.object.name
                    && child.object.name === 'module'
                    && child.property.name === 'exports') {
                    exportKV.hasDefault = true

                    // let anExp = {
                    //     isDefault: true,
                    //     expr: node.right,
                    //     isNamed: false,
                    //     alias: node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING,
                    //     identifier: node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING,
                    //     type: node.right.type
                    // }
                    count++
                    if (count > 1) {
                        throw new Error('multiple default exports!')
                    }

                    let defstring = node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING
                    // return createAnExport(anExp);
                    default_ = {
                        identifier: defstring,
                        alias: defstring,
                        expr: node.right,
                        type: node.right.type

                    }
                }
            }
        }
    }
    traverse(ast, defaultVisitor)
    return count === 1;
}
