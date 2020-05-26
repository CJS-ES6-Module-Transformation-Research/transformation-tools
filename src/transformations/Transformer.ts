import {JSFile, TransformableProject} from '../index'


/**
 * Tool for running transformations on a project.
 */
export class Transformer {

    /**
     * Runs a namespace re-building on all javascript files in the project.
     */
    rebuildNamespace() {
        this.project.forEachSource((js: JSFile) => {
            js.rebuildNamespace();
        })


    }


    private project: TransformableProject


    private constructor(project: TransformableProject) {
        this.project = project;
    }


    /**
     * Transforms project while passing the project to the transformation function.
     * @param projTransformFunc creates a transformation function using the project.
     */
    public transformWithProject(projTransformFunc: ProjectTransformFunction) {
        let tfFunc: TransformFunction = projTransformFunc(this.project);
        this.transform(tfFunc);
    }

    /**
     * Transforms a project with a TransformFunction.
     * @param transformer the TransformFunction passed.
     */
    public transform(transformer: TransformFunction): void {
        this.project.forEachSource((js) => {
            try {
                transformer(js)
            } catch (e) {
                throw e;
            }
        })
    }

    public setSourceAsModule(){
        this.project.forEachSource(js=> js.setAsModule())
    }

    /**
     * Factory function that creates transformer from TransformableProject.
     * @param projectTransformableProject.
     */

    static ofProject(project: TransformableProject): Transformer {
        return new Transformer(project);
    }

}
// transformation function types for restricting function while as typescript
export type TransformFunction = (js: JSFile) => void;
export type ProjectTransformFunction = (proj: TransformableProject) => TransformFunction;