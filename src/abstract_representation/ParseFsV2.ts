import {lstatSync, readFileSync, Stats} from 'fs'
import * as path from 'path'
import {join, relative, dirname, isAbsolute, extname, basename, normalize, resolve} from 'path'
import {Program} from "estree";
import Base = Mocha.reporters.Base;

type parentType = BaseFile;

interface AssociativeFileArray {
    [key: string]: BaseFile
}


interface BaseFileData {
    data: string | null;
    stat: Stats;
    type: FileType;
    ext: string;
    parent: parentType;
    readonly isRoot: boolean
    readonly rootDir: string
    path_abs: string
    path_relative: string
}


enum FileType {
    json = "json",
    package = "package",
    dir = "dir",
    data = "data",
    js = "js",
    link = "link"
}


class BaseFileBuilder implements BaseFileData {
    data: string | null;
    stat: Stats;
    type: FileType;
    ext: string;
    parent: Dir;

    readonly isRoot: boolean;
    readonly path_abs: string;
    readonly path_relative: string;
    readonly rootDir: string;

    createBuilder(parent: Dir, path: string) {
        this.stat = lstatSync(path)
        this.parent = parent;

        //TODO
        this.rootDir
        this.isRoot;
        this.path_abs
        this.path_relative
//TODO ^^^^^  all that

        this.determineType(path);
        this.data = readFileSync(path, {encoding: 'utf-8'})

    }

    private determineType(path: string) {


        if (this.stat.isDirectory()) {
            this.type = FileType.dir
            //handle is dir
        } else if (this.stat.isFile()) {
            this.determineFileType(path)
        } else {
            this.type = FileType.link;
            // this is symbolic link
        }

    }

    private determineFileType(path: string) {
        this.ext = extname(path).toLowerCase()
        switch (this.ext) {
            case ".json":
                if (basename(path, '.json') === "package") {
                    //package.json

                    let pkj = new PackageJSON(path)
                    //TODO UNCOMMENT  this.parent.setPackage(pkj)
                } else {
                    // JSON_File
                    let json = new JSON_File(path)
                }

                //pkg???
                break;
            case ".js":
                break;
            default:
        }
    }
}


abstract class BaseFile implements BaseFileData {
    constructor(path: string) {
        throw new Error()
    }


    readonly data: string
    readonly stat: Stats
    readonly type: FileType
    readonly ext: string
    readonly parent: Dir
    readonly isRoot: boolean
    readonly rootDir: string

    readonly path_abs: string;
    readonly path_relative: string;

    getDataAsString(): string {
        return this.data
    }


    getType(): FileType {
        return this.type
    }

    getStats(): Stats {
        return this.stat
    }

    getExt(): string {
        return this.ext
    }

    getParent(): Dir {
        return this.parent
    }

    absolutePath(): string {
        throw new Error('unsupportedOperationException')
    }

    relativeToProjDirPath(): string {
        throw new Error('unsupportedOperationException')
    }

    relativeToThis(): string {
        throw new Error('unsupportedOperationException')
    }

    projectDirPath(): string {
        throw new Error('unsupportedOperationException')
    }


}


//
//
// interface   AFileDataType{
//      type:string
//     getType:()=> string
//     typeIs:(type:string)=>boolean
// }
//
//
//
// abstract class FileDataType implements AFileDataType{
//     protected constructor(fileExt: string) {
//         this.type = fileExt;
//     }
//
//     getType(): string {
//         return this.type;
//     }
//
//
//     readonly type: string;
//
//
//
//     typeIs(type: string): boolean {
//         return this.type === type;
//     }
// }
// class JSON_FT extends FileDataType{
//
//     constructor() {
//         super(FileType.json);
//     }
//
// }
// class PKG_JSON_FT extends FileDataType{
//     constructor() {
//         super(FileType.package);
//     }
// }
// class JS_FT extends FileDataType{
//     constructor() {
//         super(FileType.js);
//     }
// }
// class DATA_FT extends FileDataType{
//     constructor() {
//         super(FileType.data);
//     }
// }
// class LINK_FT extends FileDataType{
//     constructor() {
//         super(FileType.link);
//     }
// }
// class DIR_FT extends FileDataType{
//     constructor() {
//         super(FileType.dir);
//     }
// }


type voidF = () => {}
type strGetter = () => string

interface DataFields {
}

interface JSFields {
    ast: Program
}//TODO COPY A MILLION OTHER THINGS
interface JSONFields {
    json: JSON_LITERAL,
    writeToCJS: voidF
}

interface PackageJSONFields  extends JSONFields{
    main: string,
    bin: string,
    makeModule: voidF,
 }

interface LinkFields {
    src: string,
    dest: string
}

interface DirFields {
    package: PackageJSON
}

class JS extends BaseFile implements JSFields {
    // ast: Program;
    // path_abs: string;
    // path_relative: string;
}

class Dir extends BaseFile implements DirFields {
    package: PackageJSON;
    children:BaseFile[] = []
    addChild(child:BaseFile){
        this.children.push(child)
    }

}
interface JSON_LITERAL {
    [key:string]:any
}
class PackageJSON extends BaseFile implements PackageJSONFields {
    bin: string;
    json:JSON_LITERAL
    main: string;

    constructor(path: string) {
        super(path);
        this.json = JSON.parse(super.getDataAsString())
        if (this.json.main) {
            this.main = this.json.main;
        }
        if (this.json.bin) {
            this.bin = this.json.bin;
        }

    }

    makeModule(): {} {
        this.json.type = "module"
        return {};
    }

    writeToCJS(): {} {
        throw new Error()
        return {};
    }
}

class JSON_File extends BaseFile implements JSONFields {
    json: {};

    constructor(path: string) {
        super(path);
        this.json = JSON.parse(super.getDataAsString())
    }

    writeToCJS(): {} {
        throw new Error()
        return {};
    }

}

class Link extends BaseFile implements LinkFields {
    dest: string;
    src: string;

}

class Data extends BaseFile implements DataFields {
}