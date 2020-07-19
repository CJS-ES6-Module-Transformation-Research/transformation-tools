 import {MetaData, SerializedJSData} from "src/abstract_fs_v2/interfaces";
import {Dir} from "./Dirv2";
import {AbstractDataFile } from './Abstractions'

export class PackageJSON extends AbstractDataFile   {
    private readonly bin: string;
    private readonly json: { [key: string]: any }
    private readonly main: string;

    constructor(path: string, b: MetaData, parent: Dir) {
        super(path, b, parent);
        this.json = JSON.parse(this.data)

        if (this.json.main) {
            this.main = this.json.main;
        }
        if (this.json.bin) {
            this.bin = this.json.bin;
        }
        this.parent().setPackageJSON(this)

    }

    makeModule() {
        this.json.type = "module"
    }

    getMain(): string {
        return this.main;
    }

    getBin(): string | null {
        return this.bin;
    }


    makeSerializable(): SerializedJSData {
        return {fileData: JSON.stringify(this.json, null, 4), relativePath: this.getRelative()};
    }
}


 export class CJSToJSON extends AbstractDataFile {

     makeSerializable(): SerializedJSData {
         return {
             relativePath: this.path_relative,
             fileData: this.data
         };
     }

     /**
      * default constructor but enforces data not null.
      * @param path path to file
      * @param metadata metadata for file construction
      * @param parent reference to the parent object Dir
      * @param data the data string assigned to the AbstractDataFile's inherited field.
      */
     constructor(path: string, metadata: MetaData, parent: Dir, data: string) {
         super(path, metadata, parent, data);
     }

 }





