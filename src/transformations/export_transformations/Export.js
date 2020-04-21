Object.defineProperty(exports, "__esModule", { value: true });
var exportCollector_1 = require("./visitors/exportCollector");
var estraverse_1 = require("estraverse");
var Export = /** @class */ (function () {
    function Export(js) {
        this.defaultExport = hasDefaultExport(js);
        this.hasDefault = this.defaultExport && true;
        this.namedExports = getAllNamed(js);
        this.hasNamed = (this.namedExports.exports && true);
        js.setExports(this);
    }
    Export.prototype.buildAll = function () {
        return null;
    };
    return Export;
}());
exports.Export = Export;
function hasDefaultExport(js) {
    var count = 0;
    var default_ = null;
    var defaultVisitor = {
        enter: function (node, parent) {
            var child;
            if (node.type === "AssignmentExpression") {
                child = node.left;
                child = node.left;
                if (child.type === "MemberExpression"
                    && child.object.type === "Identifier"
                    && child.property.type === "Identifier"
                    && child.object.name
                    && child.object.name === 'module'
                    && child.property.name === 'exports') {
                    count++;
                    if (count > 1) {
                        throw new Error('multiple default exports!');
                    }
                    var defstring = node.right.type === "Identifier" ? node.right.name : exportCollector_1.DEFAULT_EXPORT_STRING;
                    default_ = {
                        identifier: defstring,
                        alias: defstring,
                        expr: node.right,
                        type: node.right.type
                    };
                }
            }
        }
    };
    estraverse_1.traverse(js.getAST(), defaultVisitor);
    return default_;
}
function getAllNamed(js) {
    var namedEX = {};
    var aliases = {};
    var namedVisitor = {
        enter: function (node, parent) {
            if (node.type === "AssignmentExpression" && node.left.type === "MemberExpression") {
                var child = node.left;
                if ((child.object.type === "MemberExpression"
                    && child.object.object.type === "Identifier"
                    && child.object.property.type === "Identifier"
                    && child.object.object.name === "module"
                    && child.property.type === "Identifier")
                    ||
                        (child.object.type === "Identifier"
                            && child.property.type === "Identifier"
                            && child.object.name === "exports")) {
                    var identifier = "" + exportCollector_1.getName(node, parent, child);
                    var alias = " _" + identifier + "_namedExport";
                    namedEX[identifier] = node.right;
                    if (js.namespaceContains(identifier)) {
                        aliases[identifier] = alias;
                    }
                }
            }
        }
    };
    estraverse_1.traverse(js.getAST(), namedVisitor);
    return {
        exports: namedEX,
        aliases: aliases
    };
}
