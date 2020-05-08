Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
/**
 * represents a namespace for a javascript file. includes potential variables (any LHS assignment even if not declared ) for safety.
 */
var Namespace = /** @class */ (function () {
    function Namespace(ast) {
        var _this = this;
        this.names = new Set();
        estraverse_1.traverse(ast, {
            enter: function (node) {
                switch (node.type) {
                    case "VariableDeclarator": {
                        walkPatternToIdentifier(node.id, _this.names);
                        break;
                    }
                    case "AssignmentExpression": {
                        walkPatternToIdentifier(node.left, _this.names);
                        break;
                    }
                    case "FunctionDeclaration": {
                        node.params.forEach(function (e) { return walkPatternToIdentifier(e, _this.names); });
                        _this.names.add(node.id.name);
                        break;
                    }
                    case "ClassDeclaration": {
                        _this.names.add(node.id.name);
                        break;
                    }
                }
            }
        });
    }
    /**
     * returns true if name is in the namespace.
     * @param name the tewt name.
     */
    Namespace.prototype.containsName = function (name) {
        return this.names.has(name);
    };
    /**
     * gets a list of all names int he namespace set.
     */
    Namespace.prototype.getAllNames = function () {
        var list = [];
        this.names.forEach(function (e) { return list.push(e); });
        return list;
    };
    /**
     * creates a Namespace object from a Program AST interface object.
     * @param ast the Program object.
     */
    Namespace.create = function (ast) {
        return new Namespace(ast);
    };
    /**
     * generates a relatively desirable name if there is a collision.
     * @param name the name to test for collisions.
     * @return the Identifier object with the non-colliding name.
     */
    Namespace.prototype.generateBestName = function (name) {
        if (!this.names.has(name)) {
            return { name: name, type: "Identifier" };
        }
        var nameGen = [
            numberNameFormula(name, '', -4, this.names),
            numberNameFormula(name, '_', 0, this.names),
            numberNameFormula(name, '$', 2, this.names),
            numberNameFormula(name, '__', 7, this.names),
            numberNameFormula(name, '$$', 20, this.names),
            numberNameFormula(name, '$_', 14, this.names)
        ].sort(function (a, b) { return a.quality - b.quality; });
        // [0].name
        return { name: nameGen[0].name, type: "Identifier" };
        function numberNameFormula(name, symbol, startQuality, namespace) {
            return numberName(0);
            function numberName(q) {
                var curr = "" + name + symbol + q;
                if (namespace.has(curr)) {
                    return numberName(q + 1);
                }
                else {
                    return { name: curr, quality: q + startQuality };
                }
            }
        }
    };
    return Namespace;
}());
exports.Namespace = Namespace;
/**
 * recursive walker function to detect identifiers as names for a namespace.
 * @param node the potential node to search
 * @param ids the set of Identifier strings found so far.
 */
function walkPatternToIdentifier(node, ids) {
    switch (node.type) {
        case "ArrayPattern":
            node.elements.forEach(function (e) { return walkPatternToIdentifier(e, ids); });
            break;
        case "AssignmentPattern":
            walkPatternToIdentifier(node.left, ids);
            break;
        case "Identifier":
            ids.add(node.name);
            break;
        case "ObjectPattern":
            node.properties.forEach(function (e) {
                if (e.type === "Property") {
                    walkPatternToIdentifier(e.value, ids);
                }
                else {
                    walkPatternToIdentifier(e, ids);
                }
            });
            break;
        case "RestElement":
            walkPatternToIdentifier(node.argument, ids);
            break;
        case "MemberExpression":
            if (node.object.type === "Identifier") {
                ids.add(node.object.name);
            }
            else if (node.object.type === "MemberExpression") {
                walkPatternToIdentifier(node.object, ids);
            }
    }
}
