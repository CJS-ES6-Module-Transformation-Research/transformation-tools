Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const esprima_1 = require("esprima");
const ExportsBuilder_1 = require("../../export_transformations/ExportsBuilder");
let exportBuilder = new ExportsBuilder_1.ExportBuilder();
let pr = esprima_1.parseScript('');
const namedVisitor = {
    leave: (node, parent) => {
        let asgmt_node;
        if (node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression") {
            asgmt_node = node.expression;
        }
        if (asgmt_node && asgmt_node.left.type === "MemberExpression") {
            let child = asgmt_node.left;
            if ((child.object.type === "MemberExpression"
                && child.object.object.type === "Identifier"
                && child.object.property.type === "Identifier"
                && child.object.object.name === "module"
                && child.property.type === "Identifier")
                ||
                    (child.object.type === "Identifier"
                        && child.property.type === "Identifier"
                        && child.object.name === "exports")) {
                let identifier = `${getName(asgmt_node, child)}`;
                let alias = ` ${identifier}_namedExport`;
                exportBuilder.registerName({ name: identifier, alias: alias }, asgmt_node.right);
                return {
                    type: "VariableDeclaration",
                    kind: "var",
                    declarations: [{
                            type: "VariableDeclarator",
                            id: { type: "Identifier", name: alias },
                            init: asgmt_node.right
                        }]
                };
                //
                // return {
                //     type: "ExportNamedDeclaration",
                //     declaration: {
                //         type: "VariableDeclaration",
                //         declarations: [{
                //             type: "VariableDeclarator",
                //             id: {type: "Identifier", name: alias},
                //             init: asgmt_node.right
                //         }],
                //         kind: "const"
                //     },
                //     specifiers: [
                //         {
                //             type: "ExportSpecifier",
                //             exported: {
                //                 type: "Identifier",
                //                 name: identifier
                //             },
                //             local: {
                //                 type: "Identifier",
                //                 name: alias
                //             }
                //         }
                //     ],
                //     source: null //todo verify source can be null
                // }
            }
        }
    }
};
function getName(node, child) {
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
let x = esprima_1.parseScript(`
module.exports = 32
module.exports.name = 'name'
module.exports.object = {a:b , c}
exports.objectE = {a:b , c}
exports.hello = "hello world" 

`);
console.log(x);
estraverse_1.replace(x, namedVisitor);
// exportBuilder.build().forEach(e => {
//     x.body.push(e)
// });
// console.log(generate(x))
