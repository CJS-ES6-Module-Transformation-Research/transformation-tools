Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
const esprima_1 = require("esprima");
const escodegen_1 = require("escodegen");
let ast;
let program;
function detect(ast) {
    let visitor = {
        enter: (node, parent) => {
            let memex;
            let value;
            if (node.type === "AssignmentExpression" &&
                node.left.type === "MemberExpression") {
                memex = node.left;
                value = node.right;
                if (memex && memex.type === "MemberExpression"
                    && memex.object.type === "MemberExpression"
                // && memex.property.object.type === "Identifier"
                // && memex.property.object.name === "exports"
                ) {
                    if (memex.object.object.type === "Identifier"
                        && memex.object.object.name === "module") {
                        console.log('missing link:\t  ' + escodegen_1.generate(node));
                    }
                    else if (memex.property.type === "Identifier") {
                        console.log('module .exports only');
                        console.log(escodegen_1.generate(node));
                    }
                    else {
                        console
                            .log('property is memex2 ');
                        console.log(escodegen_1.generate(node));
                    }
                }
                else if (memex.property.type === "Identifier") {
                    console.log('nothing after mod.exp');
                    console.log(escodegen_1.generate(node));
                }
            }
            else if (node.type === 'ExpressionStatement'
                && node.expression.type === "CallExpression"
                && node.expression.callee.type === "MemberExpression"
                && node.expression.callee.object.type === "Identifier"
                && node.expression.callee.property.type === "Identifier"
                && node.expression.callee.object.name === "module"
                && node.expression.callee.property.name === "exports") {
                console.log(`callexp`);
                console.log(escodegen_1.generate(node));
            }
        }
    };
    estraverse_1.traverse(ast, visitor);
}
ast = esprima_1.parseScript(`
 module.exports = 32;
 module.exports.hello = "hello" 
 module.exports()
  
  module.exports = function(){}
  module.exports = function(a){return a;}
  module.exports =  function helloWorld(a){ 
  return a;
  }
`);
// detect(ast)
console.log(JSON.stringify(esprima_1.parseScript('module.exports()'), null, 4));
console.log('\n');
console.log(JSON.stringify(esprima_1.parseScript('module.exports.myFunc()'), null, 4));
console.log('\n');
console.log(JSON.stringify(esprima_1.parseScript('module.exports.myObj.myFunc()'), null, 4));
