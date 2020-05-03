Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
exports.flattenDecls = function (js) {
    var leaveFlatten = {
        leave: function (node, parent) {
            var vdcln;
            var flattened = [];
            if (parent !== null && parent.type === "ForStatement") {
                return; //handled elsewhere
            }
            if (node.type === 'VariableDeclaration') {
                vdcln = node;
                if (vdcln.declarations.length > 1) {
                    vdcln.declarations.forEach(function (decl) {
                        var ls = [];
                        ls.push(decl);
                        var flat = {
                            kind: vdcln.kind,
                            type: vdcln.type,
                            declarations: ls
                        };
                        flattened.push(flat);
                    });
                    var body_1;
                    var pNode = void 0; // = parentNode;
                    pNode = parent;
                    if ("Program" === pNode.type) {
                        body_1 = pNode.body;
                    }
                    else if (pNode.type === "BlockStatement") {
                        body_1 = pNode.body;
                    }
                    else if (pNode.type === "ForStatement") {
                        return;
                    }
                    else {
                        throw new Error("don't know why it got here ");
                    }
                    var indexof_1 = body_1.indexOf(node);
                    flattened.reverse().forEach(function (e) {
                        body_1.splice(indexof_1, 0, e);
                    });
                    indexof_1 = body_1.indexOf(node);
                    body_1.splice(indexof_1, 1);
                }
            }
        }
    };
    estraverse_1.traverse(js.getAST(), leaveFlatten);
};
