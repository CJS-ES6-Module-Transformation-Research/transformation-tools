Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveFlatten = function (node, parentNode) {
    var vdcln;
    var flattened = [];
    if (parentNode !== null && parentNode.type === "ForStatement") {
        //todo if CONTAINS REQUIRE not doable ??
        return;
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
                console.log(flat);
                flattened.push(flat);
            });
            var body_1;
            var pNode = void 0; // = parentNode;
            // @ts-ignore
            pNode = parentNode;
            if ("Program" === pNode.type) {
                body_1 = pNode.body;
            }
            else if (pNode.type === "BlockStatement") {
                body_1 = pNode.body;
            }
            else if (pNode.type === "ForStatement") {
                //todo if CONTAINS REQUIRE not doable ??
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
};
