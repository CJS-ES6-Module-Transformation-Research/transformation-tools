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

export const _transformBaseExports: TransformFunction = (js: JSFile) => {
    const exportBuilder = js.getExportBuilder();
    const namespace = js.getNamespace();
    let leave = (node: (Directive | Statement | ModuleDeclaration)): (Directive | Statement | ModuleDeclaration) => {
        let rVal = node;

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
                            exportBuilder.registerDefault({name: name, alias: name}, assignmentNode.right)
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
                        exportBuilder.registerDefault({name: name, alias: name}, assignmentNode.right)

                        return decl// {type:"ExpressionStatement", expression:assignmentNode.right} ;
                    default:
                        break;

                }
                let defExpt = namespace.generateBestName('defaultExport');

                let the_names = {
                    name: 'defaultExport',
                    alias: defExpt.name
                }

                exportBuilder.registerDefault(the_names, assignmentNode.right);
                //TODO ensure there are no accesses... do this as a sanitize step.
                // const varDecl: VariableDeclaration = {
                //     type: "VariableDeclaration",
                //     kind: "const",
                //     declarations: [
                //
                //     ]
                // }
                let declarator: VariableDeclarator = {
                    type: "VariableDeclarator",
                    id: defExpt,
                    init: assignmentNode.right
                }
                rVal = {
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

                    exportBuilder.registerName({
                            name: memex.property.name,
                            alias: best
                        }, assignmentNode.right
                    );
                    const declarator: VariableDeclarator = {
                        type: "VariableDeclarator",
                        id: {type: "Identifier", name: best},
                        init: assignmentNode.right
                    };
                    rVal = {
                        type: "VariableDeclaration",
                        kind: 'const',
                        declarations: [declarator]
                    };
                } else if (memex.object.type === "Identifier"
                    && memex.property.type === "Identifier"
                    && memex.object.name === "exports") {


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


                    rVal = varDecl;
                }
            }


        }
        ;
        return rVal;
    }
    js.getAST().body.forEach((node, index, array) => {
        let val
            = leave(node);

        if (val !== null) {
            array[index] = val
        }

    })
}
