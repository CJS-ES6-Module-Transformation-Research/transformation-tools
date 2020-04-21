// import {TransformableProject} from "../filesystem/FS";
// import {JSFile} from "../filesystem/JS";
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
    Transformer.prototype.transform = function (transformer) {
        this.project.forEachSource(function (js) {
            transformer(js);
        });
    };
    Transformer.ofProject = function (project) {
        return new Transformer(project);
    };
    return Transformer;
}());
exports.Transformer = Transformer;
