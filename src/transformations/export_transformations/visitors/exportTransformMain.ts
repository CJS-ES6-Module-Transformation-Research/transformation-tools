import {TransformFunction} from "../../Transformer";
import {JSFile} from "../../../abstract_representation/project_representation";
import {
    AssignmentExpression, ClassDeclaration,
    Directive, EmptyStatement, FunctionDeclaration, FunctionExpression,
    MemberExpression,
    ModuleDeclaration,
    Statement, VariableDeclaration,
    VariableDeclarator
} from "estree";
import {generate} from "escodegen";

export const transformBaseExports: TransformFunction = (js: JSFile) => {
    const exportBuilder = js.getExportBuilder();
    const namespace = js.getNamespace();
    let leave = (node: (Directive | Statement | ModuleDeclaration)): (Directive | Statement | ModuleDeclaration) => {


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
                            exportBuilder.registerName({name:name,alias:name} )
                            exportBuilder.registerDefault({name: name, type: "Identifier"} )
                            return FD
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
                        exportBuilder.registerName({name:name,alias:name} )
                        exportBuilder.registerDefault({name: name, type: "Identifier"} )

                        return decl// {type:"ExpressionStatement", expression:assignmentNode.right} ;
                    default:
                        break;

                }
                let defExpt = namespace.generateBestName('defaultExport');



                exportBuilder.registerDefault(defExpt );
                console.log('logging  ' +  'defex '+' '+ defExpt.name)

                const declarator: VariableDeclarator = {
                    type: "VariableDeclarator",
                    id: defExpt,
                    init: assignmentNode.right
                }
                    return {
                    type: "VariableDeclaration",
                    kind: 'const',
                    declarations: [declarator]
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
                    let best = namespace.generateBestName(memex.property.name).name
                    namespace.addToNamespace(best)
console.log('logging  ' + best +' '+ memex.property.name)
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
                        type: "VariableDeclaration",
                        kind: 'const',
                        declarations: [declarator]
                    };
                } else if (memex.object.type === "Identifier"
                    && memex.property.type === "Identifier"
                    && memex.object.name === "exports") {


                    const best = namespace.generateBestName(memex.property.name).name

                    namespace.addToNamespace(best);
                    exportBuilder.registerName({
                            name: memex.property.name,
                            alias: best
                        }
                    )
                    return   {
                        type: "VariableDeclaration",
                        kind: 'const',
                        declarations: [{
                            type: "VariableDeclarator",
                            id: {type: "Identifier", name: `${best}`},
                            init: assignmentNode.right
                        }]
                    };
                 }
            }


        }
    }
    js.getAST().body.forEach((node, index, array) => {
        let val
            = leave(node);

        if (val) {
            array[index] = val
        }

    })
}