#!/bin/env ts-node
Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var astTools_1 = require("../../../abstract_representation/es_tree_stuff/astTools");
var lower = 'qwertyuioplkjhgfdsazxcvbnm';
var upper = 'QWERTYUIOPLKJHGFDSAZXCVBNM';
var numeric = '1234567890';
var alphaNumericString = "" + lower + upper + numeric;
function accessReplace(js) {
    var runTraversal = function () {
        var imports = {};
        var visitor = {
            leave: function (node, parent) {
                if (isARequire(node) && parent.type) {
                    //!== "VariableDeclarator") {
                    var require_1 = node;
                    var requireString = require_1.arguments[0].value.toString();
                    var identifier = extract(requireString, js.getNamespace());
                    if ("CallExpression" === parent.type ||
                        "MemberExpression" === parent.type ||
                        "AssignmentExpression" === parent.type ||
                        ("VariableDeclarator" === parent.type && parent.id.type === "ObjectPattern")) {
                        console.log("PARENT: " + parent.type + "\t THIS: " + node.type + "\t " + identifier.name);
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
                    else if (parent.type === "ExpressionStatement"
                        || (parent.type === "VariableDeclarator"
                            && parent.id.type !== "ObjectPattern")) {
                        return;
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
                        }
                        console.log("unexpected type for  parent: " + parent.type + "\n                            Node type " + node.type + " on require string: " + requireString + " : " + imports[requireString]);
                    }
                }
                else if (parent === null) {
                    return;
                }
                if (isForLoopAccess(node, parent)
                    && node.type === "VariableDeclaration") {
                    node.declarations.forEach(function (e) {
                        extractRequireDataForAccess(e, extract, js);
                    });
                }
            }
        };
        function extract(requireStr, ns) {
            var cleaned = cleanValue(requireStr);
            var idName = "_moduleAccess_" + cleaned;
            var identifier;
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
        return imports;
    };
    var imports = runTraversal();
    populateAccessDecls(imports, js.getAST().body);
}
exports.accessReplace = accessReplace;
function populateAccessDecls(reqStrMap, body) {
    var reverse = [];
    for (var reqStr in reqStrMap) {
        var vName = reqStrMap[reqStr];
        reverse[reqStr] = vName;
        reverse.push(astTools_1.createRequireDecl(vName, reqStr, "const"));
    }
    reverse.reverse().forEach(function (e) {
        body.splice(0, 0, e);
    });
}
function cleanValue(requireStr) {
    var replaceDotJS = new RegExp("(.json)|(.js)", 'g'); // /[\.js|]/gi
    var illegal = new RegExp("([^" + alphaNumericString + "_])", "g"); ///[alphaNumericString|_]/g
    var cleaned = requireStr.replace(replaceDotJS, '');
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
    return ((parent && (parent.type === "ForStatement" && parent.init.type === "VariableDeclaration"
        || parent.type === "ForInStatement" && parent.left.type === "VariableDeclaration")
        && node.type === "VariableDeclaration"
        && node.declarations.length > 0
        && ((parent.type === "ForStatement" && node === parent.init)
            || (parent.type === "ForInStatement" && node === parent.left))));
}
function extractObjectData(oPatt, obj) {
    var key = oPatt.obj.key;
    var val = obj; // (oPatt.obj as Property).value
    var vd = {
        type: "VariableDeclarator",
        id: key,
        init: val
    };
    var vn = {
        type: "VariableDeclaration",
        kind: "const",
        declarations: [vd]
    };
    return vn;
}
function extractRequireDataForAccess(e, extract, js) {
    if ((e.init.type === "CallExpression"
        && e.init.callee.type === "Identifier"
        && e.init.callee.name === "require"
        && e.init.arguments && e.init.arguments[0] !== null
        && e.init.arguments[0].type === "Literal")) {
        var id = extract(getRequireStringFromDecl(e), js.getNamespace());
        e.init = id;
    }
}
function toAssignOrDecl(typeName, id, value) {
    if (typeName === "ExpressionStatement") {
        var as = {
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
        var variableDeclarator = {
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
