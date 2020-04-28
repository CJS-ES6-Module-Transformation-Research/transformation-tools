import {readFileSync} from "fs";
import relative from "relative";

interface Reportable {
    getPriority: () => number
    generateReport: () => string
}

abstract class FSObject implements Reportable {
    private reportPriority: number
    protected dir: string;
    protected relative: string;
    protected abs: string

    getDir(): string {
        return this.dir;
    }

    getRelative(): string {
        return this.relative;
    }

    getAbsolute(): string {
        return this.abs;
    }

    protected constructor(dir, rel,file, priority) {
        this.dir = dir;
        this.relative =rel;
        this.abs = dir + '/' + rel
        this.reportPriority = priority;
    }

    getPriority: () => number;
    generateReport: () => string;

}


// class Dir extends FSObject {
//     constructor(dir, rel) {
//         super(dir, rel, 2);
//     }
// }

export abstract class ProjectFile extends FSObject {
    protected constructor(dir: string, rel: string, file: string, priority: number) {
        super(dir, rel,file, priority);
        this.file = file;
        this.abs = dir + '/' + file
    }

    public isSource(): boolean {
        return false;
    };

    public isData(): boolean {
        return false;
    };

    protected file: string;
}

export abstract class ReadableFile extends ProjectFile {
    protected constructor(dir: string, rel: string, file: string, priority: number) {
        super(dir, rel, file, priority);
         this.text = readFileSync(this.abs).toString();
    }

    public getText(): string {
        return this.text;
    }


    protected text: string;

    isData(): boolean {
        return true;
    }

}


export class OtherFile extends ProjectFile {
    public constructor(dir: string, rel: string, file: string) {
        super(dir, rel, file, 3);
    }
}

export class SymLink extends ProjectFile {
    public constructor(dir: string, rel: string, file: string) {
        super(dir, rel, file, 3);
    }
}

