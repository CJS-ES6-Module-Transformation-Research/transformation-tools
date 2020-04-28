import {Program} from "esprima";
import {ReadableFile} from "../project/FilesTypes";


export class JSONFile extends ReadableFile {
     constructor(dir: string, rel: string, file: string) {
        super(dir, rel, file, 1);
          }

    public isData(): boolean {
        return true;
    };

    public createJSExport(): Program {
        throw new Error();
    }

}