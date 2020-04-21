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
var AST_Factory_1 = require("../../../depr/ast/AST_Factory");
var lodash_1 = require("lodash");
var Walker_1 = require("../../../tools.transformation_tools/Walker");
var AccessReplacer = /** @class */ (function (_super) {
    __extends(AccessReplacer, _super);
    function AccessReplacer() {
        var _this = _super.call(this, false) || this;
        _this.enter = function (node, parent) {
            if (node.type === 'CallExpression') {
                var calleeID = node.callee;
                if ((calleeID.name === 'require') && (parent.type !== "VariableDeclarator")) {
                    var identifier = void 0;
                    if ((parent.type === 'CallExpression') || (parent.type === 'MemberExpression') || (parent.type === 'AssignmentExpression')) {
                        identifier = _this.extract(node);
                    }
                    else if (parent.type === "ExpressionStatement") {
                        return;
                    }
                    else {
                        throw new Error(parent.type);
                    }
                    if (identifier) {
                        switch (parent.type) {
                            case "CallExpression":
                                parent.callee = identifier;
                                break;
                            case "MemberExpression":
                                parent.object = identifier;
                                break;
                            case "AssignmentExpression":
                                parent.right = identifier;
                                break;
                        }
                    }
                }
            }
        };
        _this.leave = function (node) {
        };
        _this.postTraversal = function () {
            var body = _this.js.getAST().body;
            for (var reqStr in _this.data) {
                var vName = _this.data[reqStr];
                body.splice(0, 0, AST_Factory_1.createRequireDecl(vName, reqStr, "const"));
            }
        };
        return _this;
    }
    AccessReplacer.prototype.extract = function (expr) {
        var requireStr = "" + expr.arguments[0].value;
        var cleaned = '';
        var alphaNum = 'qwertyuioplkjhgfdsazxcvbnm';
        alphaNum += alphaNum.toUpperCase() + '1234567890';
        for (var i = 0; i < requireStr.length; i++) {
            var j = requireStr[i];
            if (!lodash_1.includes(alphaNum, j)) {
                cleaned += '_';
            }
            else {
                cleaned += j;
            }
        }
        var idName = "_Import_Access_Variable_for_" + cleaned;
        this.data[requireStr] = idName;
        return {
            type: "Identifier",
            name: idName
        };
    };
    return AccessReplacer;
}(Walker_1.Walker));
exports.AccessReplacer = AccessReplacer;
