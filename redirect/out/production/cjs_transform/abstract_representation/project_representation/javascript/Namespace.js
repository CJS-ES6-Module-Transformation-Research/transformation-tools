Object.defineProperty(exports, "__esModule", { value: true });
exports.Namespace = void 0;
const estraverse_1 = require("estraverse");
/**
 * represents a namespace for a javascript file. includes potential variables (any LHS assignment even if not declared ) for safety.
 */
class Namespace {
    constructor(ast) {
        this.names = new Set();
        estraverse_1.traverse(ast, {
            enter: (node) => {
                switch (node.type) {
                    case "VariableDeclarator": {
                        walkPatternToIdentifier(node.id, this.names);
                        if (node.init && node.init.type === 'Identifier') {
                            walkPatternToIdentifier(node.init, this.names);
                        }
                        break;
                    }
                    case "AssignmentExpression": {
                        walkPatternToIdentifier(node.left, this.names);
                        break;
                    }
                    case "FunctionDeclaration": {
                        node.params.forEach((e) => walkPatternToIdentifier(e, this.names));
                        this.names.add(node.id.name);
                        break;
                    }
                    case "ClassDeclaration": {
                        this.names.add(node.id.name);
                        break;
                    }
                }
            }
        });
    }
    addToNamespace(name) {
        this.names.add(name);
    }
    /**
     * returns true if name is in the namespace.
     * @param name the tewt name.
     */
    containsName(name) {
        return this.names.has(name);
    }
    /**
     * gets a list of all names int he namespace set.
     */
    getAllNames() {
        let list = [];
        this.names.forEach((e) => list.push(e));
        return list;
    }
    /**
     * creates a Namespace object from a Program AST interface object.
     * @param ast the Program object.
     */
    static create(ast) {
        return new Namespace(ast);
    }
    /**
     * generates a relatively desirable name if there is a collision.
     * @param name the name to test for collisions.
     * @return the Identifier object with the non-colliding name.
     */
    generateBestName(name) {
        if (!this.names.has(name)) {
            return { name: name, type: "Identifier" };
        }
        let nameGen = [
            numberNameFormula(name, '', -4, this.names),
            numberNameFormula(name, '_', 0, this.names),
            numberNameFormula(name, '$', 2, this.names),
            numberNameFormula(name, '__', 7, this.names),
            numberNameFormula(name, '$$', 20, this.names),
            numberNameFormula(name, '$_', 14, this.names)
        ].sort((a, b) => a.quality - b.quality);
        // [0].name
        return { name: nameGen[0].name, type: "Identifier" };
        function numberNameFormula(name, symbol, startQuality, namespace) {
            return numberName(0);
            function numberName(q) {
                let curr = `${name}${symbol}${q}`;
                if (namespace.has(curr)) {
                    return numberName(q + 1);
                }
                else {
                    return { name: curr, quality: q + startQuality };
                }
            }
        }
    }
}
exports.Namespace = Namespace;
/**
 * recursive walker function to detect identifiers as names for a namespace.
 * @param node the potential node to search
 * @param ids the set of Identifier strings found so far.
 */
function walkPatternToIdentifier(node, ids) {
    switch (node.type) {
        case "ArrayPattern":
            node.elements.forEach((e) => walkPatternToIdentifier(e, ids));
            break;
        case "AssignmentPattern":
            walkPatternToIdentifier(node.left, ids);
            if (node.right.type === 'Identifier') {
                walkPatternToIdentifier(node.right, ids);
            }
            break;
        case "Identifier":
            ids.add(node.name);
            break;
        case "ObjectPattern":
            node.properties.forEach((e) => {
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
