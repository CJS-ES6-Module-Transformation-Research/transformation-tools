Object.defineProperty(exports, "__esModule", { value: true });
var Transformer = /** @class */ (function () {
    function Transformer(project) {
        this.project = project;
    }
    Transformer.prototype.rebuildNamespace = function () {
        this.project.forEachSource(function (js) {
            js.rebuildNamespace();
        });
    };
    Transformer.prototype.transformWithProject = function (func) {
        var tfFunc = func(this.project);
        this.transform(tfFunc);
    };
    Transformer.prototype.transform = function (transformer) {
        this.project.forEachSource(function (js) {
            try {
                transformer(js);
            }
            catch (e) {
                throw e;
            }
        });
    };
    Transformer.ofProject = function (project) {
        return new Transformer(project);
    };
    return Transformer;
}());
exports.Transformer = Transformer;
