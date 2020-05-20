import {MemberExpression, Program} from "estree";
import {traverse, Visitor} from "estraverse";
import {parseScript} from "esprima";
import {generate} from "escodegen";


let ast: Program
let program: string

function detect(ast: Program) {
    let visitor: Visitor = {
        enter: (node, parent) => {
            let memex: MemberExpression;
            let value
            if (node.type === "AssignmentExpression" &&
                node.left.type === "MemberExpression") {
                memex = node.left;
                value = node.right;

                if (memex && memex.type === "MemberExpression"
                    && memex.object.type === "MemberExpression"

                    // && memex.property.object.type === "Identifier"
                    // && memex.property.object.name === "exports"
                ) {

                    if( memex.object.object.type === "Identifier"

                    && memex.object.object.name === "module"){
                        console.log('missing link:\t  '+generate(node ))


                    }else if( memex.property.type === "Identifier"){
                        console.log('module .exports only')

                        console.log(generate(node))

                    }else{
                        console
                            .log('property is memex2 ')
                        console.log(generate(node))

                    }

                } else if (memex.property.type === "Identifier") {
                    console.log('nothing after mod.exp')

                    console.log(generate(node))

                }

            }else if(node.type === 'ExpressionStatement'
            &&node.expression.type ==="CallExpression"
            && node.expression.callee.type === "MemberExpression"
            && node.expression.callee.object.type ==="Identifier"
            && node.expression.callee.property.type ==="Identifier"
                &&node.expression.callee.object.name ==="module"
                &&node.expression.callee.property.name ==="exports"
            ){
                console.log (`callexp`)
                console.log(generate(node))

            }

        }
    }
    traverse(ast, visitor)
}


ast = parseScript(`
 module.exports = 32;
 module.exports.hello = "hello" 
 module.exports()
  
  module.exports = function(){}
  module.exports = function(a){return a;}
  module.exports =  function helloWorld(a){ 
  return a;
  }
`)
// detect(ast)
console.log(JSON.stringify(parseScript('module.exports()'),null,4))
console.log('\n')

console.log(JSON.stringify(parseScript('module.exports.myFunc()'),null,4))
console.log('\n')


console.log(JSON.stringify(parseScript('module.exports.myObj.myFunc()'),null,4))