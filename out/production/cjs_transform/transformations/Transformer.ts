
import {JSFile,TransformableProject} from '../index'
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
            try {
                transformer(js)
            }catch (e) {
                console.log(`FILE: ${js.getRelative()}   err: ${e}`)
                throw e;
            }
        })
    }

    static ofProject(project: TransformableProject): Transformer {
        return new Transformer(project);
    }

}

export type TransformFunction = (JSFile) => void;