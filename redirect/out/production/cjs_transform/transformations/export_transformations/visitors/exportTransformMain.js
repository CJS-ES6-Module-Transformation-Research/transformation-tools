Object.defineProperty(exports, "__esModule", { value: true });
exports.transformBaseExports = void 0;
const estraverse_1 = require("estraverse");
const esprima_1 = require("esprima");
function createVarDeclFromNameVal(best, rhs) {
    return {
        node: {
            type: "VariableDeclaration",
            kind: 'let',
            declarations: [{
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: `${best}` },
                    init: rhs
                }]
        }
    };
}
exports.transformBaseExports = (js) => {
    const exportBuilder = js.getExportBuilder();
    const namespace = js.getNamespace();
    function extractFromNamespace(name, rhs) {
        if (rhs.type === "Identifier") {
            exportBuilder.registerName({
                name: name,
                alias: rhs.name
            });
            return { option: estraverse_1.VisitorOption.Remove };
        }
        else {
            let previousName = exportBuilder.getByName(name);
            if (previousName) {
                let reassignment = {
                    type: "ExpressionStatement",
                    expression: {
                        type: "AssignmentExpression",
                        left: previousName,
                        right: rhs,
                        operator: '='
                    }
                };
                return { node: reassignment }; //reassignment;
            }
            else {
                const best = namespace.generateBestName(name).name;
                namespace.addToNamespace(best);
                exportBuilder.registerName({
                    name: name,
                    alias: best
                });
                return createVarDeclFromNameVal(best, rhs);
            }
        }
    }
    let leave = (node) => {
        let assignmentNode;
        if (node.type === "ExpressionStatement" &&
            node.expression.type === "AssignmentExpression") {
            assignmentNode = node.expression;
            if (node.expression.left.type === "MemberExpression"
                && node.expression.left.object.type === "Identifier"
                && node.expression.left.property.type === "Identifier"
                && node.expression.left.object.name === 'module'
                && node.expression.left.property.name === 'exports') {
                let name = '';
                switch (assignmentNode.right.type) {
                    case "FunctionExpression":
                        if (assignmentNode.right.id
                            && assignmentNode.right.id.name) {
                            let short = assignmentNode.right;
                            let FD = {
                                async: short.async,
                                type: "FunctionDeclaration",
                                body: short.body,
                                id: short.id,
                                params: short.params,
                                generator: short.generator
                            };
                            name = assignmentNode.right.id.name;
                            exportBuilder.registerName({ name: name, alias: name });
                            exportBuilder.registerDefault({ name: name, type: "Identifier" });
                            return { node: FD };
                        }
                        break;
                    case "ClassExpression":
                        let decl = {
                            id: assignmentNode.right.id,
                            body: assignmentNode.right.body,
                            type: "ClassDeclaration",
                            superClass: assignmentNode.right.superClass
                        };
                        name = assignmentNode.right.id.name;
                        exportBuilder.registerName({ name: name, alias: name });
                        exportBuilder.registerDefault({ name: name, type: "Identifier" });
                        return { node: decl }; // {type:"ExpressionStatement", expression:assignmentNode.right} ;
                    default:
                        break;
                }
                let defExpt = namespace.generateBestName('defaultExport');
                exportBuilder.registerDefault(defExpt);
                return createVarDeclFromNameVal(defExpt.name, assignmentNode.right);
            }
            else if (assignmentNode.left.type === "MemberExpression") {
                let memex = assignmentNode.left;
                assignmentNode = assignmentNode = node.expression;
                //module
                if (memex.object.type === "MemberExpression"
                    && memex.object.object.type === "Identifier"
                    && memex.object.property.type === "Identifier"
                    && memex.object.object.name === "module"
                    && memex.object.property.name === "exports"
                    && memex.property.type === "Identifier") {
                    return extractFromNamespace(memex.property.name, assignmentNode.right);
                }
                else if (memex.object.type === "Identifier"
                    && memex.property.type === "Identifier"
                    && memex.object.name === "exports") {
                    return extractFromNamespace(memex.property.name, assignmentNode.right);
                }
            }
        }
    };
    let toDelete = [];
    let body = js.getAST().body;
    body.forEach((node, index, array) => {
        // console.log(JSON.stringify(array,null,3))
        let val = leave(node);
        // console.log(val)
        if (val !== undefined) {
            // console.log(' undefined '+index)
            if (val && val.option && val.option === estraverse_1.VisitorOption.Remove) {
                // console.log(' delete '+index)
                toDelete.push(node);
            }
            else if (val.node) {
                // console.log(' node ')
                array[index] = val.node;
            }
        }
    });
    toDelete.forEach(e => {
        body.splice(body.indexOf(e), 1);
    });
};
const moduleExportsAccess = (js) => {
    const exportBuilder = js.getExportBuilder();
    const namespace = js.getNamespace();
    let visitor = {
        leave: (node, parent) => {
            if (node.type === "MemberExpression") {
                if (parent && parent.type === "MemberExpression") {
                    if (parent.object === node
                        //TODO WORK ON AND VERIFY
                        && node.object.type === "Identifier" // module
                        && node.property.type === "Identifier" //exports
                        && node.object.name === 'module'
                        && node.property.name === 'exports') {
                        let parentProperty = parent.property;
                        let id;
                        switch (parentProperty.type) {
                            case "MemberExpression":
                                id = parentProperty.property.type === "Identifier"
                                    ? parentProperty.property : null;
                                break;
                            case "Identifier":
                                id = parentProperty;
                                break;
                            case "NewExpression":
                            case "CallExpression":
                                id = parentProperty.callee.type === "Identifier" ?
                                    parentProperty.callee : null;
                                break;
                        }
                        if (id) {
                            return exportBuilder.getByName(id.name);
                        }
                        else {
                            throw new Error('unhandled edge case: parent type is: ' + parentProperty.type);
                        }
                        //todo determine how to differentiate default exports
                    }
                    else {
                        let name;
                        if (node.object.type === "MemberExpression" //nesting--node.object is module.exports
                            && node.object.object.type === "Identifier" //module
                            && node.object.property.type === "Identifier" //exports
                            && node.object.object.name === "module"
                            && node.object.property.name === "exports"
                            && node.property.type === "Identifier" //name
                        ) {
                            //TODO check the name against namespace and exports
                            name = node.property.name;
                        }
                        else if (node.object.type === "Identifier"
                            && node.property.type === "Identifier"
                            && node.object.name === "exports"
                            && ((parent && parent.type !== "MemberExpression") || !parent)) {
                            name = node.property.name;
                        }
                        let byName = exportBuilder.getByName(name);
                        if (name && byName) {
                            return byName;
                        }
                    }
                }
                else {
                    return exportBuilder.getDefaultIdentifier();
                }
            }
        }
    };
};
//module access test vals (+)
let str = JSON.stringify(esprima_1.parseScript(`
if (module.exports){}
module.exports
let v = module.exports
module.exports()
new module.exports()

if(module.exports.x){}
module.exports.x
new module.exports.x() 
module.exports.x()
module.exports.x(c)
module.exports.x.y
`).body, null, 4);
// console.log(str)
