// #!/usr/local/bin/ts-node
import {parseScript, Syntax} from "esprima";
import {traverse} from "estraverse";
import {BaseNode, BaseNodeWithoutComments, Comment, Expression, MemberExpression, Node, Program} from 'estree'

let ast:Program


ast = parseScript(`

//one thing
console.log('hello world')
/**
* javadoc. 
*/
var __filename = url.fileURLToPath(import_meta)

//EOF
`, {loc: true, comment: true, range: true}, (n: BaseNodeWithoutComments | BaseNode | Node, meta) => {
    // console.log(`meta: ${JSON.stringify(meta,null,3)}\n\n`)
    try {
        let x = (n as Comment)
        // console.log((x ))
    } catch (e) {
        // console.log(n )
    }

// let x = n.type=== "Line"
})
//
// import {parse, parseFile,SM } from 'spidermonkey'
// var sm = new SM({ shell: "js" });
traverse(ast, {
    leave: (node: Node | BaseNodeWithoutComments, parentNode) => {
        try {
            let z = node as Comment
            // console.log(z)
        } catch (e) {

        }

    }
})
// console.log(generate(ast,{comment:true}))

ast = parseScript(
    ` 
//hello  
//attach? 
module.exports.x = 3 

// module.exports.y = {}
// if(true){
// module.exports = 33 
// }

`, {comment: true, loc: true}
)
// console.log(JSON.stringify(ast ,null,3))
traverse(ast, {
    enter: (node, parentNode) => {
        console.log(`type:${node.type}\t${node.leadingComments} > || > ${node.trailingComments }`)

        node.trailingComments= [{type:"Line",value: "hello ",}]
    }, leave: ( node, parentNode) => {

    }
})
traverse(ast, {
    enter: (node, parentNode) => {
        console.log(`type:${node.type}\t${node.leadingComments} > || > ${node.trailingComments }`)
    }, leave: ( node, parentNode) => {

    }
})
// let data_ = sm.parse(data)
// console.log(data_ )
// let q = (((((ast.body[0] as ExpressionStatement).expression)as AssignmentExpression).left)as MemberExpression)
// q.computed = true
// console.log(ast )


const MODULE_EXPORTS: MemberExpression = {
    type: "MemberExpression",
    object: {
        type: Syntax.Identifier,
        name: "module"
    },
    property: {
        type: Syntax.Identifier,
        name: "exports"
    },
    computed: false
}

function EXPORTS_DOT(expr: Expression | string): MemberExpression {
    let _expr
    if (typeof expr === 'string') {
        _expr = {
            type: Syntax.Identifier,
            name: expr
        }
    } else {
        _expr = expr
    }
    return {
        type: "MemberExpression",
        object: {
            type: Syntax.Identifier,
            name: "exports"
        },
        property: _expr,
        computed: false
    };
}

let expr: Expression | string
// console.log(typeof expr)


// console.log(ast.comments)
// console.log(JSON.stringify(ast,null,3))
// let disp = ast.body[0] as VariableDeclaration
// console.log(JSON.stringify(disp.declarations,null,3))




