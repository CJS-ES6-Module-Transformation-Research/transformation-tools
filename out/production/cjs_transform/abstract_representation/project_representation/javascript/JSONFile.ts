import {Program} from "esprima";
import {ReadableFile} from "../project/FilesTypes";


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

}