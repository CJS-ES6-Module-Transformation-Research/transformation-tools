import {JSFile} from "../abstract_representation/project_representation/JS";
import {Identifier} from 'estree'

interface NameQuality {
    name: string
    quality: number
}

export class NameFactory {
    private js: JSFile;

    constructor(js: JSFile) {
        this.js = js;
        js.rebuildNamespace();
    }

    getValidName(name: string, js: JSFile, startIsValid: boolean): Identifier {
        if (this.js.namespaceContains(name) && startIsValid) {
            return {name: name, type: "Identifier"};
        }
         let nameGen = [
            this.numberNameFormula(name, '',-2),
            this.numberNameFormula(name, '_',1),
            this.numberNameFormula(name, '$',2),
            this.numberNameFormula(name, '__',5),
            this.numberNameFormula(name, '$$',4),
            this.numberNameFormula(name, '$_',3)
        ].sort((a,b)=>a.quality-b.quality)[0].name//TODO verify
        return {name: nameGen, type: "Identifier"};
     }

    numberNameFormula(name: string,symbol:string,startQuality:number): NameQuality {

        return numberName(0);

        function numberName(q: number): NameQuality {
            let curr = `${name}${symbol}${q}`
            if (this.js.namespaceContains(name)) {
                return numberName(q + 1);
            } else {
                return {name: curr, quality: q+startQuality};
            }
        }
    }


}
