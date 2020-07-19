Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenDecls = void 0;
const estraverse_1 = require("estraverse");
/**
 * TransformFunction that does Variable Declaration Declarator flattening.
 * @param js the JSFile to transform.
 */
exports.flattenDecls = function (js) {
    let leaveFlatten = {
        leave: (node, parent) => {
            let vdcln;
            let flattened = [];
            if (parent !== null && parent.type === "ForStatement") {
                return; //handled elsewhere
            }
            if (node.type === 'VariableDeclaration') {
                vdcln = node;
                //test to see if flattening is necessary
                if (vdcln.declarations.length > 1) {
                    vdcln.declarations.forEach((decl) => {
                        //add declarator to be flattened.
                        let ls = [];
                        ls.push(decl);
                        let flat = {
                            kind: vdcln.kind,
                            type: vdcln.type,
                            declarations: ls
                        };
                        //add to flatten decl list.
                        flattened.push(flat);
                    });
                    let body;
                    let pNode; // = parentNode;
                    pNode = parent;
                    // get body or code block
                    if ("Program" === pNode.type) {
                        body = pNode.body;
                    }
                    else if (pNode.type === "BlockStatement") {
                        body = pNode.body;
                    }
                    else if (pNode.type === "ForStatement") {
                        return;
                    }
                    else {
                        throw new Error("don't know why it got here ");
                    }
                    // insert back into body array
                    let indexof = body.indexOf(node);
                    flattened.reverse().forEach((e) => {
                        body.splice(indexof, 0, e);
                    });
                    indexof = body.indexOf(node);
                    body.splice(indexof, 1);
                }
            }
        }
    };
    estraverse_1.traverse(js.getAST(), leaveFlatten);
};
