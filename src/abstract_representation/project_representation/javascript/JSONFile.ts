import {Program} from "esprima";
import {ReadableFile} from "../project/FilesTypes";
import {readFileSync} from "fs";
import {script_or_module} from '../project/FileProcessing';


/**
 * project representation of a JSON object file.
 * contains text as data string.
 */
export class JSONFile extends ReadableFile {
    constructor(dir: string, rel: string, file: string) {
        super(dir, rel, file, 1);
    }

    /**
     * is true, but is NOT source.
     */
    public isData(): boolean {
        return true;
    };

    /**
     * creates an exportable version of itsself as an ES6 module.
     * //TODO implement
     */
    public createJSExport(): Program {
        throw new Error();
    }

    public asJSON(): object {
        return JSON.parse(this.getText());
    }


}

/**
 * represents package.json. extends JSONFile to include setting default module type.
 */
export class PackageJSON extends JSONFile {
    constructor(dir: string) {
        super(dir, `package.json`, `package.json`);
        try {
            this.json = JSON.parse(this.text);
        }catch (jsonParseError) {
            console.log(`json parse error semicolon: ${jsonParseError}\n in dir: ${dir}`)
        }
    }

    private readonly json: object;

    setModuleType( modType: script_or_module) {
        const setType = modType === 'module' ? 'module' : 'commonjs'
        console.log(`Setting module type of project: ${setType}`)
        this.json['type'] = setType;
    }
}


// export const setModuleType = function
