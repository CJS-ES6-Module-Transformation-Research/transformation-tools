Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformer = void 0;
/**
 * Tool for running transformations on a project.
 */
class Transformer {
    constructor(project) {
        this.project = project;
    }
    /**
     * Runs a namespace re-building on all javascript files in the project.
     */
    rebuildNamespace() {
        this.project.forEachSource((js) => {
            js.rebuildNamespace();
        });
    }
    /**
     * Transforms project while passing the project to the transformation function.
     * @param projTransformFunc creates a transformation function using the project.
     */
    transformWithProject(projTransformFunc) {
        let tfFunc = projTransformFunc(this.project);
        this.transform(tfFunc);
    }
    /**
     * Transforms a project with a TransformFunction.
     * @param transformer the TransformFunction passed.
     */
    transform(transformer) {
        this.project.forEachSource((js) => {
            try {
                transformer(js);
            }
            catch (e) {
                throw e;
            }
        });
    }
    setSourceAsModule() {
        this.project.forEachSource(js => js.setAsModule());
    }
    /**
     * Factory function that creates transformer from TransformableProject.
     * @param projectTransformableProject.
     */
    static ofProject(project) {
        return new Transformer(project);
    }
}
exports.Transformer = Transformer;
