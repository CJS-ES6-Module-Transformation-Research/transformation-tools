import {DirSupplier, FileType, FileVisitor, MetaData, SerializedJSData} from "src/abstract_fs_v2/interfaces";
import {Dir} from "src/abstract_fs_v2/Dirv2";
import {readFileSync, Stats} from "fs";

export abstract class AbstractFile {

    protected constructor(path: string, bfd: MetaData, parent: Dir) {


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
        return this.isRoot ? null : this.parent()
    }

    absolutePath(): string {
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
        super(path, b, parent);
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




