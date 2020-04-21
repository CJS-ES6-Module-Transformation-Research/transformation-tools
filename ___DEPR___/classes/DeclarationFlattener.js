var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Walker_1 = require("../../../tools.transformation_tools/Walker");
var DeclarationFlattener = /** @class */ (function (_super) {
    __extends(DeclarationFlattener, _super);
    function DeclarationFlattener() {
        var _this = _super.call(this, false) || this;
        _this.enter = function () { };
        _this.leave = function (node, parentNode) {
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
                        flattened.push(flat);
                    });
                    var body_1;
                    var pNode = void 0; // = parentNode;
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
        _this.postTraversal = function () { };
        return _this;
    }
    return DeclarationFlattener;
}(Walker_1.Walker));
exports.DeclarationFlattener = DeclarationFlattener;
