#!/bin/env ts-node
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessReplace = void 0;
const estraverse_1 = require("estraverse");
const astTools_1 = require("../../../abstract_representation/es_tree_stuff/astTools");
const lower = 'qwertyuioplkjhgfdsazxcvbnm';
const upper = 'QWERTYUIOPLKJHGFDSAZXCVBNM';
const numeric = '1234567890';
const alphaNumericString = `${lower}${upper}${numeric}`;
/**
 * TransformFunction to replace 'accesses' of require calls.
 * @param js the JSFile to transform.
 */
function accessReplace(js) {
    let requireTracker = js.getRequireTracker();
    let runTraversal = function () {
        let imports = {};
        let visitor = {
            leave: (node, parent) => {
                if (isARequire(node) && parent.type) {
                    let require = node;
                    let requireString = require.arguments[0].value.toString();
                    let tracked = requireTracker.getIfExists(requireString);
                    let identifier;
                    if (tracked) {
                        identifier = tracked.identifier;
                    }
                    else {
                        identifier = extract(requireString, js.getNamespace());
                        requireTracker.insertBlind(identifier.name, requireString, true);
                    }
                    //gets the appropriate identifier for the require for a require string access variable.
                    //check is call expression and not single-identifier declarator
                    if ("CallExpression" === parent.type ||
                        "MemberExpression" === parent.type ||
                        "AssignmentExpression" === parent.type ||
                        ("VariableDeclarator" === parent.type && parent.id.type === "ObjectPattern")) {
                        switch (parent.type) {
                            case "CallExpression":
                                parent.callee = identifier;
                                return;
                            case "MemberExpression":
                                parent.object = identifier;
                                return;
                            case "AssignmentExpression":
                                parent.right = identifier;
                                return;
                            case "VariableDeclarator":
                                if (parent.id.type === "ObjectPattern") {
                                    parent.init = identifier;
                                }
                                else {
                                    return node;
                                }
                        }
                    }
                    else {
                        switch (parent.type) {
                            case "NewExpression":
                            case "IfStatement":
                            case "WhileStatement":
                            case "DoWhileStatement":
                            case "ForStatement":
                            case "LogicalExpression":
                            case "ConditionalExpression":
                            case "SwitchCase":
                                return identifier;
                                break;
                            case "FunctionDeclaration":
                            case "FunctionExpression":
                            case "ArrowFunctionExpression":
                                //not needed here because parent would be body
                                break;
                            case "VariableDeclarator":
                                return;
                            default: //TODO run thru types again
                                return;
                        }
                    }
                }
                else if (parent === null) {
                    return;
                }
                //if there is a variable declaration of any type inside a for loop
                if (isForLoopAccess(node, parent)
                    && node.type === "VariableDeclaration") {
                    node.declarations.forEach((e) => {
                        extractRequireDataForAccess(e, extract, js);
                    });
                }
            }
        };
        function extract(requireStr, ns) {
            let cleaned = cleanValue(requireStr);
            let idName = `_moduleAccess_${cleaned}`;
            let identifier;
            if (imports[requireStr] === undefined) {
                identifier = ns.generateBestName(idName);
                // identifier = {type:"Identifier", name:imports[requireStr]}
                imports[requireStr] = identifier.name;
            }
            else {
                identifier = { type: "Identifier", name: imports[requireStr] };
            }
            return identifier;
        }
        estraverse_1.replace(js.getAST(), visitor);
        js.getAST().body.forEach(e => {
            estraverse_1.traverse(e, {
                enter: (node, parent) => {
                    if (parent !== null && node.type === "VariableDeclaration") {
                        node.declarations.forEach(e => {
                            extractRequireDataForAccess(e, extract, js);
                        });
                    }
                }
            });
        });
        return imports;
    };
    let imports = runTraversal();
    populateAccessDecls(imports, js.getAST().body, js.getNamespace());
}
exports.accessReplace = accessReplace;
function populateAccessDecls(reqStrMap, body, names) {
    let reverse = [];
    for (const reqStr in reqStrMap) {
        let vName = reqStrMap[reqStr];
        reverse[reqStr] = vName;
        names.addToNamespace(vName);
        reverse.push(astTools_1.createRequireDecl(vName, reqStr, "const"));
    }
    reverse.reverse().forEach(e => {
        body.splice(0, 0, e);
    });
}
function cleanValue(requireStr) {
    let replaceDotJS = new RegExp(`(\.json)|(\.js)`, 'g'); // /[\.js|]/gi
    let illegal = new RegExp(`([^${alphaNumericString}_])`, "g"); ///[alphaNumericString|_]/g
    let cleaned = requireStr.replace(replaceDotJS, '');
    cleaned = cleaned.replace(illegal, "_");
    return cleaned;
}
function getRequireStringFromDecl(node) {
    if (node.init.type === "CallExpression"
        && node.init.callee.type === "Identifier"
        && node.init.callee.name === "require"
        && node.init.arguments && node.init.arguments[0] !== null
        && node.init.arguments[0].type === "Literal") {
        return node.init.arguments[0].value.toString();
    }
}
function isForLoopAccess(node, parent) {
    return ((parent && (parent.type === "ForStatement" && parent.init && parent.init.type === "VariableDeclaration"
        || parent.type === "ForInStatement" && parent.left && parent.left.type === "VariableDeclaration")
        && node.type === "VariableDeclaration"
        && node.declarations.length > 0
        && ((parent.type === "ForStatement" && node === parent.init)
            || (parent.type === "ForInStatement" && node === parent.left))));
}
function extractObjectData(oPatt, obj) {
    let key = oPatt.obj.key;
    let val = obj; // (oPatt.obj as Property).value
    let vd = {
        type: "VariableDeclarator",
        id: key,
        init: val
    };
    let vn = {
        type: "VariableDeclaration",
        kind: "const",
        declarations: [vd]
    };
    return vn;
}
function extractRequireDataForAccess(e, extract, js) {
    if ((e.init && e.init.type === "CallExpression"
        && e.init.callee.type === "Identifier"
        && e.init.callee.name === "require"
        && e.init.arguments && e.init.arguments[0] !== null
        && e.init.arguments[0].type === "Literal")) {
        let id = extract(getRequireStringFromDecl(e), js.getNamespace());
        e.init = id;
    }
}
function toAssignOrDecl(typeName, id, value) {
    if (typeName === "ExpressionStatement") {
        let as = {
            type: "AssignmentExpression",
            left: id,
            right: value,
            operator: "="
        };
        return {
            type: "ExpressionStatement",
            expression: as
        };
    }
    else if (typeName === "VariableDeclaration") {
        let variableDeclarator = {
            type: "VariableDeclarator",
            id: id,
            init: value
        };
        return {
            type: "VariableDeclaration",
            kind: "const",
            declarations: [variableDeclarator],
        };
    }
    else {
        throw new Error("unexpected state");
    }
}
function makeAMembery(objID, propID) {
    return {
        type: "MemberExpression",
        computed: false,
        object: objID,
        property: propID
    };
}
function isARequire(node) {
    return node.type === "CallExpression"
        && node.callee.type === "Identifier"
        && node.callee.name === "require";
}
