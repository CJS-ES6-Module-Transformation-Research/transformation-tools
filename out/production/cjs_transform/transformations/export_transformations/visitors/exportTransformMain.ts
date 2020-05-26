import {TransformFunction} from "../../Transformer";
import {JSFile} from "../../../abstract_representation/project_representation";
import {
    AssignmentExpression,
    ClassDeclaration,
    Directive,
    FunctionDeclaration,
    FunctionExpression,
    MemberExpression,
    ModuleDeclaration,
    Statement,
    VariableDeclarator
} from "estree";
import {VisitorOption} from "estraverse";
import {collectDefaultObjectAssignments} from "../../sanitizing/visitors/exportObjectNamer";

export const transformBaseExports: TransformFunction = (js: JSFile) => {
    const exportBuilder = js.getExportBuilder();
    const namespace = js.getNamespace();
    let leave = (node: (Directive | Statement | ModuleDeclaration)): TypeSafeReturn => {


        let assignmentNode: AssignmentExpression;

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
                    case   "FunctionExpression":

                        if (assignmentNode.right.id
                            && assignmentNode.right.id.name) {
                            let short: FunctionExpression = assignmentNode.right;
                            let FD: FunctionDeclaration = {
                                async: short.async,
                                type: "FunctionDeclaration",
                                body: short.body,
                                id: short.id,
                                params: short.params,
                                generator: short.generator
                            };
                            name = assignmentNode.right.id.name
                            exportBuilder.registerName({name: name, alias: name})
                            exportBuilder.registerDefault({name: name, type: "Identifier"})
                            return {node: FD}
                        }
                        break;
                    case   "ClassExpression":
                        let decl: ClassDeclaration = {
                            id: assignmentNode.right.id,
                            body: assignmentNode.right.body,
                            type: "ClassDeclaration",
                            superClass: assignmentNode.right.superClass
                        };
                        name = assignmentNode.right.id.name
                        exportBuilder.registerName({name: name, alias: name})
                        exportBuilder.registerDefault({name: name, type: "Identifier"})

                        return {node: decl}// {type:"ExpressionStatement", expression:assignmentNode.right} ;
                    default:
                        break;

                }
                let defExpt = namespace.generateBestName('defaultExport');


                exportBuilder.registerDefault(defExpt);

                const declarator: VariableDeclarator = {
                    type: "VariableDeclarator",
                    id: defExpt,
                    init: assignmentNode.right
                }
                return {
                    node: {
                        type: "VariableDeclaration",
                        kind: 'const',
                        declarations: [declarator]
                    }
                }


            } else if (assignmentNode.left.type === "MemberExpression") {

                let memex: MemberExpression = assignmentNode.left;
                assignmentNode = assignmentNode = node.expression;


                //module
                if (memex.object.type === "MemberExpression"
                    && memex.object.object.type === "Identifier"
                    && memex.object.property.type === "Identifier"
                    && memex.object.object.name === "module"
                    && memex.object.property.name === "exports"
                    && memex.property.type === "Identifier"

                ) {


                    if (assignmentNode.right.type === "Identifier") {
                        exportBuilder.registerName({
                                name: assignmentNode.right.name,
                                alias: assignmentNode.right.name,
                            }
                        );
                        return {option: VisitorOption.Remove};
                    } else {

                        let best = namespace.generateBestName(memex.property.name).name
                        namespace.addToNamespace(best)
                        exportBuilder.registerName({
                                name: memex.property.name,
                                alias: best
                            }
                        );

                        const declarator: VariableDeclarator = {
                            type: "VariableDeclarator",
                            id: {type: "Identifier", name: best},
                            init: assignmentNode.right
                        };
                        return {
                            node: {
                                type: "VariableDeclaration",
                                kind: 'const',
                                declarations: [declarator]
                            }
                        };
                    }
                } else if (memex.object.type === "Identifier"
                    && memex.property.type === "Identifier"
                    && memex.object.name === "exports") {

                    if (assignmentNode.right.type === "Identifier") {
                        exportBuilder.registerName({
                                name: assignmentNode.right.name,
                                alias: assignmentNode.right.name
                            }
                        )
                        return {option:VisitorOption.Remove};
                    } else {
                        const best = namespace.generateBestName(memex.property.name).name

                        namespace.addToNamespace(best);
                        exportBuilder.registerName({
                                name: memex.property.name,
                                alias: best
                            }
                        )
                        return {
                            node: {
                                type: "VariableDeclaration",
                                kind: 'const',
                                declarations: [{
                                    type: "VariableDeclarator",
                                    id: {type: "Identifier", name: `${best}`},
                                    init: assignmentNode.right
                                }]
                            }
                        };


                    }
                }
            }


        }
    }
    let toDelete = []
    let body =  js.getAST().body
   body.forEach((node, index, array) => {
        // console.log(JSON.stringify(array,null,3))
        let val
            = leave(node);
        // console.log(val)
        if (val !== undefined) {
            // console.log(' undefined '+index)
            if (val && val.option && val.option === VisitorOption.Remove) {
                // console.log(' delete '+index)
                toDelete.push(node);
            } else if (val.node) {
                // console.log(' node ')
                array[index] = val.node
            }
        }
    })

    toDelete.forEach(e=>{
        body.splice(body.indexOf(e),1)
    });
}

interface TypeSafeReturn {
    node?: (Directive | Statement | ModuleDeclaration)
    option?: VisitorOption
}

//
// let js = new JSFile('', '', '', 'script', `
// function stringify (obj, options = {}) {
//   const EOL = options.EOL || 'n'
//
//   const str = JSON.stringify(obj, options ? options.replacer : null, options.spaces)
//
//   return str + EOL
// }
//
// function stripBom (content) {
//   // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
//   if (Buffer.isBuffer(content)) content = content.toString('utf8')
//   return content
// }
//
// module.exports = { stringify, stripBom }
//
//
// `)
// transformBaseExports(js)
// console.log(js.makeString())
//

// let js = new JSFile('','','','script',`
//
//
//
// module.exports = { stringify, stripBom }
//
// `)
//
// collectDefaultObjectAssignments(js)
// transformBaseExports(js)
// console.log(js.makeString())