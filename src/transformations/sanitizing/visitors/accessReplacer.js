#!/bin/env ts-node
Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var AST_Factory_1 = require("../../../../../___DEPR___/ast/AST_Factory");
var lower = 'qwertyuioplkjhgfdsazxcvbnm';
var upper = 'QWERTYUIOPLKJHGFDSAZXCVBNM';
var numeric = '1234567890';
var alphaNumericString = "" + lower + upper + numeric;
function accessReplace(js) {
    var runTraversal = function () {
        var imports = {};
        var visitor = {
            enter: function (node, parent) {
                if (node.type === 'CallExpression'
                    && node.callee.type === "Identifier"
                    && node.callee.name === "require" && parent.type !== "VariableDeclarator") {
                    var identifier = extract(node.arguments[0].value.toString());
                    if ("CallExpression" === parent.type ||
                        "MemberExpression" === parent.type ||
                        "AssignmentExpression" === parent.type
                    //        isValidParentType(parent)
                    ) {
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
                            // case "VariableDeclarator":
                            //     parent.init = identifier;
                            //     return;
                        }
                    }
                    else if (parent.type === "ExpressionStatement") {
                        return;
                    }
                    else {
                        throw new Error(parent.type);
                    }
                }
                else if (parent === null) {
                    return;
                }
                if ((parent.type === "ForStatement" && parent.init.type === "VariableDeclaration"
                    || parent.type === "ForInStatement" && parent.left.type === "VariableDeclaration")
                    && node.type === "VariableDeclaration"
                    && node.declarations.length > 0
                    && ((parent.type === "ForStatement" && node === parent.init)
                        || (parent.type === "ForInStatement" && node === parent.left))) {
                    node.declarations.forEach(function (e) {
                        if (e.init.type === "CallExpression"
                            && e.init.callee.type === "Identifier"
                            && e.init.callee.name === "require"
                            && e.init.arguments && e.init.arguments[0] !== null
                            && e.init.arguments[0].type === "Literal") {
                            var lit = e.init.arguments[0].value.toString();
                            var id = extract(lit);
                            e.init = id;
                        }
                    });
                }
            }
        };
        function isValidParentType(parent) {
            switch (parent.type) {
                case 'CallExpression':
                case 'MemberExpression':
                case 'AssignmentExpression':
                    // case    "VariableDeclarator":
                    return true;
                default:
                    return false;
            }
        }
        function extract(requireStr) {
            var cleaned = cleanValue(requireStr);
            var idName = "_Import_Access_Variable_for_" + cleaned;
            if (idName === "_Import_Access_Variable_for____lib" || idName === "_Import_Access_Variable_for_fs") {
                throw new Error();
            }
            imports[requireStr] = idName;
            return {
                type: "Identifier",
                name: idName
            };
        }
        var declaratorVisitor = {
            enter: function (node, parent) {
                if (parent === null) {
                    return;
                }
                if ((parent.type === "ForStatement" && parent.init.type === "VariableDeclaration"
                    || parent.type === "ForInStatement" && parent.left.type === "VariableDeclaration")
                    && node.type === "VariableDeclaration"
                    && node.declarations.length > 0
                    && ((parent.type === "ForStatement" && node === parent.init)
                        || (parent.type === "ForInStatement" && node === parent.left))) {
                    node.declarations.forEach(function (e) {
                        if (e.init.type === "CallExpression"
                            && e.init.callee.type === "Identifier"
                            && e.init.callee.name === "require"
                            && e.init.arguments && e.init.arguments[0] !== null
                            && e.init.arguments[0].type === "Literal") {
                            var lit = e.init.arguments[0].value.toString();
                            var id = extract(lit);
                            e.init = id;
                        }
                    });
                }
            }
        };
        estraverse_1.traverse(js.getAST(), visitor);
        // traverse(js.getAST(), declaratorVisitor)
        return imports;
    };
    var imports = runTraversal();
    populateAccessDecls(imports, js.getAST().body);
}
exports.accessReplace = accessReplace;
function populateAccessDecls(reqStrMap, body) {
    for (var reqStr in reqStrMap) {
        var vName = reqStrMap[reqStr];
        body.splice(0, 0, AST_Factory_1.createRequireDecl(vName, reqStr, "const"));
    }
}
function cleanValue(requireStr) {
    var replaceDotJS = new RegExp("(.json)|(.js)", 'g'); // /[\.js|]/gi
    var illegal = new RegExp("([^" + alphaNumericString + "_])", "g"); ///[alphaNumericString|_]/g
    var cleaned = requireStr.replace(replaceDotJS, '');
    cleaned = cleaned.replace(illegal, "_");
    return cleaned;
}
