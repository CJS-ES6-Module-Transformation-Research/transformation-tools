#!/usr/local/bin/ts-node
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var esprima_1 = require("esprima");
var AST_Factory_1 = require("../../depr/ast/AST_Factory");
var lodash_1 = __importDefault(require("lodash"));
exports.accessDetectTransformer = function (imports) {
    return {
        enter: function (node, parent) {
            if (node.type === 'CallExpression') {
                var calleeID = node.callee;
                if ((calleeID.name === 'require') && (parent.type !== "VariableDeclarator")) {
                    var identifier = void 0;
                    if ((parent.type === 'CallExpression') || (parent.type === 'MemberExpression') || (parent.type === 'AssignmentExpression')) {
                        identifier = extract(node);
                    }
                    else if (parent.type === "ExpressionStatement") {
                        return;
                    }
                    else {
                        throw new Error(parent.type);
                    }
                    if (identifier) {
                        switch (parent.type) {
                            case "CallExpression":
                                parent.callee = identifier;
                                break;
                            case "MemberExpression":
                                parent.object = identifier;
                                break;
                            case "AssignmentExpression":
                                parent.right = identifier;
                                break;
                        }
                    }
                }
            }
        }
    };
    function extract(expr) {
        var requireStr = "" + expr.arguments[0].value;
        var cleaned = '';
        var alphaNum = 'qwertyuioplkjhgfdsazxcvbnm';
        alphaNum += alphaNum.toUpperCase() + '1234567890';
        for (var i = 0; i < requireStr.length; i++) {
            var j = requireStr[i];
            if (!lodash_1.default.includes(alphaNum, j)) {
                cleaned += '_';
            }
            else {
                cleaned += j;
            }
        }
        var idName = "_Import_Access_Variable_for_" + cleaned;
        imports[requireStr] = idName;
        return {
            type: "Identifier",
            name: idName
        };
    }
};
var singleAssign = 'const x = require("declared")';
var sideEffect = 'require("sideEffect")';
var assign = "let assign; \nassign = require('assignReqS');";
var propAccess;
var propAccessInvocation;
var invocation;
var invocationArgs;
propAccess = "require('propFS').readSync";
propAccessInvocation = "require('propFS').readSync('hello.txt')";
invocation = "require('anInvokable')()";
invocationArgs = "require('anInvokable')(\"invocation arg\")";
var list = [];
var scpt = esprima_1.parseScript(singleAssign + "\n    " + sideEffect + "\n    " + assign + "\n   let propaccess = " + propAccess + "\n   let propaccess = " + propAccess + ".prop2\n   let propaccessInvoke = " + propAccessInvocation + "\n   var invoked = " + invocation + "\n    " + invocationArgs + "\n    ");
exports.populateAccessDecls = function (reqStrMap, body) {
    for (var reqStr in reqStrMap) {
        var vName = reqStrMap[reqStr];
        body.splice(0, 0, AST_Factory_1.createRequireDecl(vName, reqStr, "const"));
    }
};
