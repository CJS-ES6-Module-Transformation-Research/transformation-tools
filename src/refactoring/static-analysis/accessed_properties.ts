import {traverse, Visitor} from "estraverse";
import {JSFile} from "../../filesystem";
import {isShadowVariable} from "./shadow_variables";
import {Node} from 'estree'
import {Intermediate} from "../../utility/Intermediate";


function forceDefaults(node, im: Intermediate): void {
    let listOfVars = im.getListOfIDs()
    switch (node.type) {

        case "LogicalExpression":
            if (node.left.type === "Identifier"
                && listOfVars.includes(node.left.name)) {
                im.addForcedDefault(node.left.name, "logic expr")

                // TODO FIXME js.report().addForcedDefault(js, demap.fromId[node.left.name], "condition")
            }
            if (node.right.type === "Identifier"
                && listOfVars.includes(node.right.name)) {
                // TODO FIXME js.report().addForcedDefault(js, demap.fromId[node.right.name], "condition")

                im.addForcedDefault(node.right.name)

            }
            break;
        case "UpdateExpression":

            let arg = node.argument
            if (arg.type === "Identifier"
                //TODO ADD TEST FOR THIS
                && listOfVars.includes(arg.name)) {
                im.addForcedDefault(arg.name, "update")

                // TODO FIXME js.report().addForcedDefault(js, arg.name, "update")
            }
            break;
        case "ConditionalExpression":
            if (node.consequent.type === "Identifier"
                && listOfVars.includes(node.consequent.name)) {
                im.addForcedDefault(node.consequent.name, "condition")

                // TODO FIXME 	js.report().addForcedDefault(js, node.consequent.name, "condition")
            }
            if (node.alternate.type === "Identifier"
                && listOfVars.includes(node.alternate.name)) {

                im.addForcedDefault(node.alternate.name, "condition")
                // TODO FIXME 	js.report().addForcedDefault(js, demap.fromId[node.alternate.name], "condition")
            }


            break;


    }
}


export function getAccessedProperties(js: JSFile): void {
    // let listOfProps = [];
     let intermediate:Intermediate = js.getIntermediate()
    let listOfShadowIDs: { [ID: string]: number[] } = {}
    let listOfVars = intermediate.getListOfIDs()
    let ast = js.getAST()
    let shadows = intermediate.getShadowVars()
    let accessed = intermediate.getPropReads()
    let idTagger: (node: Node, parent: Node) => string = js.getIdTagger()
    let fctStack: string[] = [];
    let fctStackVisits = (operation: 'enter' | 'leave') => {
        let stackOperator: 'push' | 'pop' = operation === "enter" ? 'push' : 'pop'
        return (node: Node, parent: Node) => {
            let tag
            switch (node.type) {
                case "FunctionDeclaration": // we're entering a function
                    tag = idTagger(node, parent)
                    if (stackOperator === 'push') {
                        fctStack.push(tag);
                    } else {
                        fctStack.pop();

                    }
                    break;
                case "FunctionExpression": // we're entering a function
                    tag = idTagger(node, parent)
                    if (stackOperator === 'push') {
                        fctStack.push(tag);
                    } else {
                        fctStack.pop();
                    }
                    break;
                case "ArrowFunctionExpression": // we're entering a function
                    tag = idTagger(node, parent)
                    if (stackOperator === 'push') {
                        fctStack.push(tag);
                    } else {
                        fctStack.pop();

                    }
                    break;

            }
        }
    }
    let z: { [s: string]: string[] } = {}
    let _stack: Visitor = {
        enter: fctStackVisits('enter'),
        leave: fctStackVisits('leave')
    }
    const propAccessVisitor: Visitor = {
        enter: (node, parent) => {
            _stack.enter(node, parent)
            if (node.type === "MemberExpression") {

                if (node.object.type === "Identifier" && node.property.type === "Identifier") {
                    let lov = listOfVars.includes(node.object.name)

                    let shad = isShadowVariable(node.object.name, fctStack, shadows, listOfShadowIDs)

                    if (shad) {

                    }

                    if (lov && !shad) {
                        if (!z[node.object.name]) {
                            z[node.object.name] = []
                        }
                        z[node.object.name].push(node.property.name)
                    }
                }
                if (node.object.type === "Identifier"
                    && node.property.type === "Identifier"
                    && listOfVars.includes(node.object.name)
                    && (!isShadowVariable(node.object.name, fctStack, shadows, listOfShadowIDs)//FIXME this has toe end up in it somewhere
                    )

                    /*containsNode( )*/) {
                    let name = node.object.name

                    // if (!mapOfRPIs[name]) {
                    // 	mapOfRPIs[name] = {
                    // 		allAccessedProps: [],//new Set(),
                    // 		potentialPrimProps: [],//new Set(),
                    // 		refTypeProps: [],//new Set(),
                    // 		forceDefault: false
                    // 	};
                    // }
                    if (parent
                        && parent.type === "AssignmentExpression"
                        && parent.left === node
                    ) {
                        // TODO FIXME 	js.report().addForcedDefault(js, demap.fromId[name], 'property_assignment')
                        intermediate.addForcedDefault(name, "reassignment of module id")
                    }
                    // if (!mapOfRPIs[name].allAccessedProps.includes(node.property.name)) {
                    // 	mapOfRPIs[name].allAccessedProps.push(node.property.name)
                    // }


                    if (!accessed[node.object.name]) {
                        accessed[node.object.name] = []
                    }
                    if (!(accessed[node.object.name].includes(node.property.name))) {
                        accessed[node.object.name].push(node.property.name)
                    }

                    // if ( !(accessed[name].includes(node.property.name))) {
                    // 	accessed[name].push(node.property.name)
                    // }


                }

            }
            forceDefaults(node, intermediate);
        }, leave: _stack.leave
    };
    traverse(ast, propAccessVisitor);
    intermediate.setShadowVarsFromList(listOfShadowIDs, js.getIDMap())



}