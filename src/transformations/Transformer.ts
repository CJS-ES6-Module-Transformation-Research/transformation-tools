// import {TransformableProject} from "../filesystem/FS";
// import {JSFile} from "../filesystem/JS";

import {TransformableProject} from "../abstract_representation/project_representation/FS";
import {JSFile} from "../abstract_representation/project_representation/JS";

export class Transformer {
    rebuildNamespace() {
         this.project.forEachSource( (js:JSFile)=>{
            js.rebuildNamespace();
         })


    }
    private project: TransformableProject



    private constructor(project: TransformableProject) {
        this.project = project;
    }

    public transform(transformer: TransformFunction): void {
        this.project.forEachSource((js) => {
            transformer(js)
        })
    }

    static ofProject(project: TransformableProject): Transformer {
        return new Transformer(project);
    }

}

export type TransformFunction = (JSFile) => void
