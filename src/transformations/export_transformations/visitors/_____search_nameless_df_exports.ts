import {JSFile} from "../../../abstract_representation/project_representation";
import {TransformFunction} from "../../Transformer";
import {replace, traverse, Visitor, VisitorOption} from "estraverse";
import {
    AssignmentExpression,
    MemberExpression,
    Node,
    Program,
    Statement,
    VariableDeclaration,
    VariableDeclarator
} from "estree";
import {ExportBuilder} from "../ExportsBuilder";
import {parseScript} from "esprima";
import {generate} from "escodegen";


export const transformBaseExports: TransformFunction = (js: JSFile) => {
    const exportBuilder = js.getExportBuilder();
    const namespace = js.getNamespace();
    let visitor: Visitor = {
        enter: (node, parent) => {
            if (parent === null) {
                console.log(node)
                return VisitorOption.Skip
            }
        },
        leave: (node: Node, parent: Node): Node | VisitorOption => {

            let assignmentNode: AssignmentExpression;

if(parent.type&& parent === null){

    // console.log(parent.expression.type)

    // process.exit(0)
}
            if (


                // parent.type&&
                parent === null&&

                node.type === "ExpressionStatement" &&
                node.expression.type === "AssignmentExpression") {
                assignmentNode = node.expression;

                if (node.expression.left.type === "MemberExpression"
                    && node.expression.left.object.type === "Identifier"
                    && node.expression.left.property.type === "Identifier"
                    && node.expression.left.object.name === 'module'
                    && node.expression.left.property.name === 'exports') {

                    let name = '';
                    switch (assignmentNode.right.type) {
                        case   "FunctionExpression":
                            name = assignmentNode.right.id.name
                            exportBuilder.registerDefault({name: name, alias: name}, assignmentNode.right)
                            console.log(`returning value${generate(assignmentNode.right)}`)
                            return assignmentNode.right
                        case   "ClassExpression":

                            name = assignmentNode.right.id.name
                            exportBuilder.registerDefault({name: name, alias: name}, assignmentNode.right)
                            console.log(`returning value${generate(assignmentNode.right)}`)

                            console.log('register default as class/func decl')
                            return assignmentNode.right;
                        default:
                            let defExpt = namespace.generateBestName('defaultExport');
                            namespace.addToNamespace(defExpt.name)
                            exportBuilder.registerDefault({
                                name: 'defaultExport',
                                alias: defExpt.name
                            }, assignmentNode.right);
                            //TODO ensure there are no accesses... do this as a sanitize step.
                            const varDecl: VariableDeclaration = {
                                type: "VariableDeclaration",
                                kind: "const",
                                declarations: [
                                    {
                                        type: "VariableDeclarator",
                                        id: defExpt,
                                        init: assignmentNode.right
                                    }
                                ]
                            }
                            return varDecl

                    }

                } else if (assignmentNode.left.type === "MemberExpression") {

                    let memex: MemberExpression = assignmentNode.left;

                    if (memex.type === "MemberExpression") {
                        if (memex.object.type === "MemberExpression") {
                            //module
                            console.log("memex has a memex")
                            if (
                                memex.object.object.type === "Identifier"
                                && memex.object.property.type === "Identifier"
                                && memex.object.object.name === "module"
                                && memex.object.property.name === "exports"
                                && memex.property.type === "Identifier"

                            ) {
                                let best = namespace.generateBestName(memex.property.name).name
                                namespace.addToNamespace(best)
                                console.log(`found MEMEX NAMNEDD is = to ${memex.property.name}`)
                                exportBuilder.registerName({
                                        name: memex.property.name,
                                        alias: best
                                    }, assignmentNode.right
                                );
                                const declarator:VariableDeclarator={
                                    type: "VariableDeclarator",
                                    id: {type: "Identifier", name: best},
                                    init: assignmentNode.right
                                };
                                let declarators = []
                                declarators.push(declarator);
                                const varDecl: VariableDeclaration = {
                                    type: "VariableDeclaration",
                                    kind: 'const',
                                    declarations: declarators
                                }
                                console.log(parent.type)
                                let slashes = `1----------`
                                console.log('node:\n ' + `${JSON.stringify(node, null, 4)}`)
                                console.log('node:\n ' + `${node.type}`)
                                console.log(generate(node))
                                console.log(`${slashes}${slashes}`)

                                console.log(`return ing code ${generate(varDecl)}`)
                                return varDecl;
                            }
                        } else {
                            console.log('memex has an id on obj ')
                            //identifiers
                            assignmentNode = assignmentNode = node.expression;

                            if (memex.object.type === "Identifier"
                                && memex.property.type === "Identifier"
                                && memex.object.name === "exports") {
                                console.log('found: ' + memex.property.name)
                                console.log(`export naming`);
                                let best = namespace.generateBestName(memex.property.name).name

                                namespace.addToNamespace(best);


                                exportBuilder.registerName({
                                        name: memex.property.name,
                                        alias: best
                                    }, assignmentNode.right
                                )
                                const varDecl: VariableDeclaration = {
                                    type: "VariableDeclaration",
                                    kind: 'const',
                                    declarations: [{
                                        type: "VariableDeclarator",
                                        id: {type: "Identifier", name: `${best}`},
                                        init: assignmentNode.right
                                    }]
                                };
                                let slashes = `2----------`
                                console.log(generate(node))
                                console.log(`${slashes}${slashes}`)

                                console.log(`return ing code ${generate(varDecl)}`)
                                return varDecl;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                } else {
                    console.log( 'null???  ')
                };
            } else {
              return null;
            }
            ;
        }
    };
    js.getAST().body.forEach((value
        , index
        , array) => {
        // replace = visitor.leave(value, null);
        //
        // if (replace !== VisitorOption.Skip) {
        //     console.log(`replacing: ${generate(value)}  `)
        //     console.log(`with \t${generate(replace)}`)
        //     // console.log(`with \t${JSON.stringify(replace,null,4)}`)
        //     array[index] = replace as Statement;
        console.log(value.type)
        console.log(index)
        console.log(array)
        replace(value, visitor)
        console.log(`${array}\n\n`)

        // }
    });

    // replace(js.getAST(), visitor)

}


let js = new JSFile('', '', '', 'script', `
 let hello = 9;
 module.exports.world = 900
 module.exports.hello = function x(){}
 if(true){
    for (i=0; false; i++){
    console.log(i)
    }
 }
 function w(){return 3;}
 // module.exports = {a:b}
 `)
// let builder: ExportBuilder = new ExportBuilder()
// transformBaseExports(js);
// let built = builder.build()
// console.log(JSON.stringify(built,null,4))
// console.log(generate(built.named_exports))
// console.log(generate(built.default_exports))

