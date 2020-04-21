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
var requireStringTransformer_1 = require("../src/transformations/sanitizing/requireStringTransformer");
var Walker_1 = require("./Walker");
var RequireStringSanitizer = /** @class */ (function (_super) {
    __extends(RequireStringSanitizer, _super);
    function RequireStringSanitizer() {
        var _this = _super.call(this, false) || this;
        _this.enter = function (node) {
            console.log("enter");
            var requireStringTF = new requireStringTransformer_1.RequireStringTransformer(_this.js.getDir());
            if (node.type === "CallExpression"
                && node.callee.type === "Identifier"
                && node.callee.name === "require"
                && node.arguments[0].type === "Literal") {
                var literal = node.arguments[0];
                var requireString = requireStringTF.getTransformed(literal.value.toString());
                literal.value = requireString;
                literal.raw = "'" + requireString + "'";
            }
        };
        _this.leave = function (node, parent) {
        };
        _this.postTraversal = function () {
        };
        return _this;
    }
    return RequireStringSanitizer;
}(Walker_1.Walker));
exports.RequireStringSanitizer = RequireStringSanitizer;
