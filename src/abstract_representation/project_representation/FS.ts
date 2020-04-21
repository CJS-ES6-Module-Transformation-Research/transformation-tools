import {JSFile} from "./JS";
import {ProjectFile} from "./FilesTypes";
import {renameSync, writeFileSync} from "fs";

class ProjectBuilder {
    files: ProjectFile[] = [];
    jsFiles: JSFile[] = [];
    projectDir: string;

    public addFile(file: ProjectFile): ProjectBuilder {
        this.files.push(file);
        if (file.isSource()) {
            this.jsFiles.push(file as JSFile);
        }
        return this;
    }

    public setProjectDir(dir: string): ProjectBuilder {
        this.projectDir = dir;
        return this;
    }

    build(): TransformableProject {
        return TransformableProject.ofBuilder(this);
    }
}

interface FileMap {
    [key: string]: JSFile
}


export class TransformableProject {
    private files: ProjectFile[];
    private jsFiles: JSFile[];
    private projectDir: string;
    private originalFiles: Set<string>
    private fileMap: FileMap = {};


    private constructor(builder: ProjectBuilder) {
        this.files = builder.files;
        this.jsFiles = builder.jsFiles;
        this.jsFiles.forEach((jsf) => {
            this.fileMap[jsf.getRelative()] = jsf;
        })

        this.projectDir = builder.projectDir;
        this.originalFiles = new Set<string>()
        this.files.forEach((e) => this.originalFiles.add(e.getRelative()));

    }


    public static builder(): ProjectBuilder {
        return new ProjectBuilder();
    }

    static ofBuilder(builder: ProjectBuilder): TransformableProject {
        return new TransformableProject(builder);
    };

    private forEachFile(func: (value: ProjectFile) => void): void {
        this.files.forEach(func)
    }

    public forEachSource(func: (value: JSFile) => void): void {
        this.jsFiles.forEach(func)
    }

    public writeOut() {
        let inPlaceSuffix = '.old'
        this.originalFiles.forEach(e => {
            let prefix = this.projectDir + "/" + e;
            renameSync(prefix, `${prefix}${inPlaceSuffix}`)
        });
        this.jsFiles.forEach((jsf) => {
            writeFileSync(jsf.getFull(), jsf.makeString())
        });
    }

    public getJS(name: string): JSFile {
        return this.fileMap[name];
    }
}