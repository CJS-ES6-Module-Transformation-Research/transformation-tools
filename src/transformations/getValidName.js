Object.defineProperty(exports, "__esModule", { value: true });
var NameFactory = /** @class */ (function () {
    function NameFactory(js) {
        this.js = js;
        js.rebuildNamespace();
    }
    NameFactory.prototype.getValidName = function (name, js, startIsValid) {
        if (this.js.namespaceContains(name) && startIsValid) {
            return { name: name, type: "Identifier" };
        }
        var nameGen = [
            this.numberNameFormula(name, '', -2),
            this.numberNameFormula(name, '_', 1),
            this.numberNameFormula(name, '$', 2),
            this.numberNameFormula(name, '__', 5),
            this.numberNameFormula(name, '$$', 4),
            this.numberNameFormula(name, '$_', 3)
        ].sort(function (a, b) { return a.quality - b.quality; })[0].name; //TODO verify
        return { name: nameGen, type: "Identifier" };
    };
    NameFactory.prototype.numberNameFormula = function (name, symbol, startQuality) {
        return numberName(0);
        function numberName(q) {
            var curr = "" + name + symbol + q;
            if (this.js.namespaceContains(name)) {
                return numberName(q + 1);
            }
            else {
                return { name: curr, quality: q + startQuality };
            }
        }
    };
    return NameFactory;
}());
exports.NameFactory = NameFactory;
