Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var esprima_1 = require("esprima");
var escodegen_1 = require("escodegen");
var astTools_1 = require("../../../abstract_representation/es_tree_stuff/astTools");
var exportsTools_1 = require("../../../abstract_representation/es_tree_stuff/exportsTools");
var types_1 = require("./types");
var program = "\nmodule.exports = \"hello world\"\nmodule.exports.hello = \"world\" \nexports.asdf = 3\nx.exports = 32;\nmodule.hello = 33\n\n";
var ast = esprima_1.parseScript(program);
function exportTransform(js) {
    var exportKV = { names: [], hasDefault: false };
    var properties = [];
    var defaultVisitor = {
        enter: function (node, parent) {
            var child;
            if (node.type === "AssignmentExpression") {
                child = node.left;
                child = node.left;
                if (child.type === "MemberExpression"
                    && child.object.type === "Identifier"
                    && child.property.type === "Identifier"
                    && child.object.name
                    && child.object.name === 'module'
                    && child.property.name === 'exports') {
                    exportKV.hasDefault = true;
                    var anExp = {
                        isDefault: true,
                        expr: node.right,
                        isNamed: false,
                        alias: node.right.type === "Identifier" ? node.right.name : types_1.DEFAULT_EXPORT_STRING,
                        identifier: node.right.type === "Identifier" ? node.right.name : types_1.DEFAULT_EXPORT_STRING,
                        type: node.right.type
                    };
                    exportKV.names.push(anExp);
                    properties.push(createProp(anExp));
                    return exportsTools_1.createAnExport(anExp);
                }
            }
        }
    };
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
    estraverse_1.replace(js.getAST(), {});
    if (!exportKV.hasDefault && properties) {
        js.getAST().body.push({
            type: "ExportDefaultDeclaration",
            declaration: {
                type: "ObjectExpression",
                properties: properties
            }
        });
    }
}
exports.exportTransform = exportTransform;
function createProp(ex) {
    return {
        kind: "init",
        method: false,
        type: esprima_1.Syntax.Property,
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
var exportKV = { names: [], hasDefault: false };
var defaultVisitor = {
    enter: function (node, parent) {
        var child;
        if (node.type === "AssignmentExpression") {
            child = node.left;
            child = node.left;
            if (child.type === "MemberExpression"
                && child.object.type === "Identifier"
                && child.property.type === "Identifier"
                && child.object.name
                && child.object.name === 'module'
                && child.property.name === 'exports') {
                exportKV.hasDefault = true;
                var anExp = {
                    isDefault: true,
                    expr: node.right,
                    isNamed: false,
                    alias: node.right.type === "Identifier" ? node.right.name : types_1.DEFAULT_EXPORT_STRING,
                    identifier: node.right.type === "Identifier" ? node.right.name : types_1.DEFAULT_EXPORT_STRING,
                    type: node.right.type
                };
                return exportsTools_1.createAnExport(anExp);
            }
        }
    }
};
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
var namedVisitor = {
    enter: function (node, parent) {
        if (node.type === "AssignmentExpression" && node.left.type === "MemberExpression") {
            var child = node.left;
            if ((child.object.type === "MemberExpression"
                && child.object.object.type === "Identifier"
                && child.object.property.type === "Identifier"
                && child.object.object.name === "module"
                && child.property.type === "Identifier")
                ||
                    (child.object.type === "Identifier"
                        && child.property.type === "Identifier"
                        && child.object.name === "exports")) {
                var identifier = "" + getName(node, parent, child);
                var alias = "__" + identifier + "_namedExport";
                return {
                    type: "ExportNamedDeclaration",
                    declaration: {
                        type: "VariableDeclaration",
                        declarations: [{
                                type: "VariableDeclarator",
                                id: { type: "Identifier", name: alias },
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
                };
            }
        }
    }
};
function getName(node, parent, child) {
    if (child.object.type === "MemberExpression"
        && child.object.object.type === "Identifier"
        && child.object.property.type === "Identifier"
        && child.object.object.name === "module"
        && child.property.type === "Identifier") {
        return child.property.name;
    }
    else if (child.object.type === "Identifier"
        && child.property.type === "Identifier"
        && child.object.name === "exports") {
        return child.property.name;
    }
}
exports.getName = getName;
function printProperties(obj) {
    obj.properties.forEach(function (e) {
        if (e.type === "Property") {
            if (e.key.type === "Identifier") {
                var m = {
                    type: "MemberExpression",
                    object: { type: "Identifier", name: "module" },
                    computed: e.computed,
                    property: { type: "Identifier", name: "exports" }
                    // property: {
                    //     type: "MemberExpression",
                    //     object: ,
                    //     computed: true,
                    //     property: e.key,
                    // }
                };
                var as = void 0;
                if (astTools_1.isExpr(e.value.type)) {
                    as = {
                        type: "AssignmentExpression",
                        left: m,
                        right: e.value,
                        operator: "="
                    };
                    console.log(escodegen_1.generate(as));
                }
                else {
                    console.log("TYPE OF " + e.key.name + "'s value is:  " + e.value.type);
                }
            }
            else {
                //if not identirfier
                console.log(e.type);
            }
        }
    });
}
program =
    "\nmodule.exports = {\na:b,\nc:d,\ne\n};\nmodule.exports = \"hello world\"\nmodule.exports.hello = \"world\" \nexports.asdf = 3\nx.exports = 32;\n\nmodule.exports = {\nhello:\"world\",\nturing:\"complete\",\nthree:asx,\nfour:3\n }\n\nmodule.hello = 33\nx.exports.hello = yjack\n";
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
var scpt = esprima_1.parseScript("\nif (32 ===0){\n    module.exports = {zero:0}\n    if (-5 ===0){\n    module.exports = {one:1}\n}\nfunction alpha(romeo){\nmodule.exports = {romeo}\n}\n}\nmodule.exports = {\na:require(x),\nc:3,\nz:'hrllo',\ncz:id,\nzc:{_object:expression},\nzZ:zz\n};\nlet x = 32\n");
function processNamedExports(exportInfo) {
    var namedEX = exportInfo.exports;
    var aliases = exportInfo.aliases;
    function getAllNamed(js) {
        var namedVisitor = {
            enter: function (node, parent) {
                if (node.type === "AssignmentExpression" && node.left.type === "MemberExpression") {
                    var child = node.left;
                    if ((child.object.type === "MemberExpression"
                        && child.object.object.type === "Identifier"
                        && child.object.property.type === "Identifier"
                        && child.object.object.name === "module"
                        && child.property.type === "Identifier")
                        ||
                            (child.object.type === "Identifier"
                                && child.property.type === "Identifier"
                                && child.object.name === "exports")) {
                        var identifier = "" + getName(node, parent, child);
                        var alias = " _" + identifier + "_namedExport";
                        namedEX[identifier] = node.right;
                        if (js.namespaceContains(identifier)) {
                            aliases[identifier] = alias;
                        }
                    }
                }
            }
        };
        estraverse_1.traverse(js.getAST(), namedVisitor);
    }
    return getAllNamed;
}
function hasDefaultExport(ast) {
    var count = 0;
    var default_ = null;
    var defaultVisitor = {
        enter: function (node, parent) {
            var child;
            if (node.type === "AssignmentExpression") {
                child = node.left;
                child = node.left;
                if (child.type === "MemberExpression"
                    && child.object.type === "Identifier"
                    && child.property.type === "Identifier"
                    && child.object.name
                    && child.object.name === 'module'
                    && child.property.name === 'exports') {
                    exportKV.hasDefault = true;
                    // let anExp = {
                    //     isDefault: true,
                    //     expr: node.right,
                    //     isNamed: false,
                    //     alias: node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING,
                    //     identifier: node.right.type === "Identifier" ? node.right.name : DEFAULT_EXPORT_STRING,
                    //     type: node.right.type
                    // }
                    count++;
                    if (count > 1) {
                        throw new Error('multiple default exports!');
                    }
                    var defstring = node.right.type === "Identifier" ? node.right.name : types_1.DEFAULT_EXPORT_STRING;
                    // return createAnExport(anExp);
                    default_ = {
                        identifier: defstring,
                        alias: defstring,
                        expr: node.right,
                        type: node.right.type
                    };
                }
            }
        }
    };
    estraverse_1.traverse(ast, defaultVisitor);
    return count === 1;
}
