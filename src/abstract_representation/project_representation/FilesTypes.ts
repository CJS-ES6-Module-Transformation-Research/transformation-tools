import {Program} from "esprima";
import {readFileSync} from "src/abstract_representation/project_representation/FS";

interface Reportable {
    getPriority: () => number
    generateReport: () => string
}

abstract class FSObject implements Reportable {
    private reportPriority: number
    protected dir: string;
    protected relative: string;
    protected full: string

    getDir(): string {
        return this.dir;
    }

    getRelative(): string {
        return this.relative;
    }

    getFull(): string {
        return this.full;
    }

    protected constructor(dir, rel, priority) {
        this.dir = dir;
        this.relative = rel;
        this.full = dir + '/' + rel
        this.reportPriority = priority;
    }

    getPriority: () => number;
    generateReport: () => string;

}


class Dir extends FSObject {
    constructor(dir, rel) {
        super(dir, rel, 2);
    }
}

export abstract class ProjectFile extends FSObject {
    protected constructor(dir: string, rel: string, file: string, priority: number) {
        super(dir, rel, priority);
        this.file = file;
        this.full = dir + '/' + file
    }

    public isSource(): boolean {
        return false;
    };

    public isData(): boolean {
        return false;
    };

    protected full: string
    protected file: string;
}

export abstract class ReadableFile extends ProjectFile {
    protected constructor(dir: string, rel: string, file: string, priority: number) {
        super(dir, rel, file, priority);
        this.text = readFileSync(this.full).toString();
    }

    public getText(): string {
        return this.text;
    }


    protected text: string;

    isData(): boolean {
        return true;
    }

}


export class JSONFile extends ReadableFile {
    constructor(dir: string, rel: string, file: string) {
        super(dir, rel, file, 1);
    }

    public createJSExport(): Program {
        throw new Error();
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

