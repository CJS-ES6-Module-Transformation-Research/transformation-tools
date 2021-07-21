import {DirSupplier, FileType, FileVisitor, MetaData, SerializedJSData} from "../utility/types";
import {Dir} from "./Directory";
import {readFileSync, Stats} from "fs";
import { AbstractReporter} from "../control";
interface AbstractFileI{
    setReporter(reporter:AbstractReporter):void
getReporter():AbstractReporter
getType():    FileType

getParent():   Dir

getAbsolute(): string

getRelative(): string

visit(visitor: FileVisitor):void
}
// export interface AbstractFileData extends AbstractFileI{
//     makeSerializable(): SerializedJSData
// }
export abstract class AbstractFile implements AbstractFileI{
    protected readonly isTest: boolean;

    protected constructor(path: string, bfd: MetaData, parent: Dir, isTest:boolean) {
         this.isTest = isTest;
        this.ext = bfd.ext
        this.stat = bfd.stat
        this.type = bfd.type

        this.isRoot = bfd.isRoot
        this.rootDir = bfd.rootDir

        this.path_abs = bfd.path_abs
        this.path_relative = bfd.path_relative
        this.target_dir = bfd.target_dir;
        this.parent = createGetParent(parent)

    }

    protected readonly target_dir: string;

    protected readonly stat: Stats
    protected readonly type: FileType
    protected readonly ext: string
    protected readonly parent: DirSupplier | null
    protected readonly isRoot: boolean
    protected readonly rootDir: string

    protected path_abs: string;
    protected readonly path_relative: string;

    protected reporter:AbstractReporter;
    setReporter(reporter:AbstractReporter){
        this.reporter = reporter
    }
    getReporter(){
        return this.reporter
    }
    getType(): FileType {
        return this.type
    }

    getParent(): Dir {
        return this.isRoot ? null : this.parent()
    }

    getAbsolute(): string {
        return this.path_abs
    }

    getRelative(): string {
        return this.path_relative;
    }

    visit(visitor: FileVisitor): void {
        visitor(this)
    }

}

export abstract class AbstractDataFile extends AbstractFile {
    protected readonly data: string

    protected constructor(path: string, b: MetaData, parent: Dir, data: string = '') {
        super(path, b, parent, b.test);

        if (data) {
            this.data = data;
        } else {
            this.data = readFileSync(this.path_abs, 'utf-8')
        }
    }

    abstract makeSerializable(): SerializedJSData
}


function createGetParent(dir: Dir): DirSupplier | null {
    if (!dir) {
        return null;
    }
    let getParent = (() => dir) as DirSupplier
    getParent.pName = dir.getRelative();
    return getParent
}




