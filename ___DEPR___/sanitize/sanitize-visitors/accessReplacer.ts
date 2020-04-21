#!/usr/local/bin/ts-node
import {RequireAccessIDs} from "../../Types";
import {CallExpression, Identifier, Literal, Node, VariableDeclaration} from 'estree'
import {parseScript} from 'esprima'
import {createRequireDecl} from "../../depr/ast/AST_Factory";
import {AccessRequire, mutator, varLetConst, WrappedReturnVisitor} from "../../depr/ast/transformationTools";
import _ from 'lodash'

export let accessDetectTransformer: WrappedReturnVisitor<RequireAccessIDs> = function (imports: RequireAccessIDs) {
    return {
        enter:
            (node: Node, parent: Node) => {
                if (node.type === 'CallExpression') {
                    let calleeID = (node.callee as Identifier)
                    if ((calleeID.name === 'require') && (parent.type !== "VariableDeclarator")) {
                        let identifier: Identifier;
                        if ((parent.type === 'CallExpression') || (parent.type === 'MemberExpression') || (parent.type === 'AssignmentExpression')) {
                            identifier = extract(node);
                        } else if (parent.type === "ExpressionStatement") {
                            return;
                        } else {
                            throw new Error(parent.type)
                        }

                        if (identifier) {
                            switch (parent.type) {
                                case "CallExpression":
                                    parent.callee = identifier
                                    break;
                                case "MemberExpression":
                                    parent.object = identifier
                                    break;
                                case "AssignmentExpression":
                                    parent.right = identifier
                                    break;
                            }
                        }
                    }
                }
            }
    }

    function extract(expr: CallExpression): Identifier {
        let requireStr = `${(expr.arguments[0] as Literal).value}`
        let cleaned  = '';
        let alphaNum = 'qwertyuioplkjhgfdsazxcvbnm'
        alphaNum+= alphaNum.toUpperCase() + '1234567890'

        for (let i = 0; i < requireStr.length;i++){
            let j = requireStr[i];
            if (!_.includes(alphaNum,j)){
                cleaned+='_';
            }else {
                cleaned+=j;
            }
        }
        let idName = `_Import_Access_Variable_for_${cleaned}`
        imports[requireStr] = idName;
        return {
            type: "Identifier",
            name: idName
        }
    }
}


let singleAssign = 'const x = require("declared")'
let sideEffect = 'require("sideEffect")'
let assign = `let assign; \nassign = require('assignReqS');`
let propAccess: string;
let propAccessInvocation: string;
let invocation: string;
let invocationArgs: string;

propAccess = `require('propFS').readSync`
propAccessInvocation = `require('propFS').readSync('hello.txt')`

invocation = `require('anInvokable')()`
invocationArgs = `require('anInvokable')("invocation arg")`

let list: AccessRequire[] = [];
let scpt = parseScript(
    `${singleAssign}
    ${sideEffect}
    ${assign}
   let propaccess = ${propAccess}
   let propaccess = ${propAccess}.prop2
   let propaccessInvoke = ${propAccessInvocation}
   var invoked = ${invocation}
    ${invocationArgs}
    `)

export const populateAccessDecls:mutator<RequireAccessIDs> = (reqStrMap: RequireAccessIDs, body: Node[])=> {
    for (const reqStr in reqStrMap) {
        let vName: string = reqStrMap[reqStr];
        body.splice(0, 0, createRequireDecl(vName, reqStr, "const"))
    }
}
