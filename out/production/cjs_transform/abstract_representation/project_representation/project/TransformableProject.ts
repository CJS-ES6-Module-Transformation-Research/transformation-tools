import {JSFile} from "../javascript/JSFile";
import {ProjectFile, Dir} from "./FilesTypes";
import {existsSync, mkdirSync, renameSync, writeFileSync} from "fs";
import {JSONFile} from "../javascript/JSONFile";
import relative from "relative";

export class TransformableProject {
    private files: ProjectFile[];
    private jsFiles: JSFile[];
    private jsonFiles: JSONFile[];
    private projectDir: string;
    private originalFiles: Set<string>
    private fileMap: FileMap = {};
    private dirs: Dir[] = []

    private constructor(builder: ProjectBuilder) {
        this.files = builder.files;
        this.jsFiles = builder.jsFiles;
        this.jsonFiles = builder.jsonFiles;
        this.jsFiles.forEach((jsf) => {
            this.fileMap[jsf.getRelative()] = jsf;
        });
        this.dirs = builder.dirs;

        this.projectDir = builder.projectDir;
        this.originalFiles = new Set<string>()
        this.files.forEach((e) => this.originalFiles.add(e.getRelative()));

    }

    public static getSpecifiedRelativeFile(relativeFile: string, jsonRequire: string, dir: string): string {
        let REL = relative(relativeFile, jsonRequire, null);
        return REL;
    }


    public static builder(): ProjectBuilder {
        return new ProjectBuilder();
    }

    static ofBuilder(builder: ProjectBuilder): TransformableProject {
        return new TransformableProject(builder);
    };

    public forEachSource(func: (value: JSFile) => void): void {
        this.jsFiles.forEach(func)
    }

    public writeOut(inPlaceSuffix: string, newProjDir: string = this.projectDir) {
        if (!existsSync(newProjDir)) {
            mkdirSync(newProjDir, {recursive: true});
        }
        this.dirs.forEach((d) => {
            try {
                mkdirSync(d.getAbsolute(), {recursive: true});
            } catch (e) {
                console.log(e)
            }
        });
        if (inPlaceSuffix) {
            this.originalFiles.forEach(e => {
                let prefix = newProjDir + "/" + e;
                renameSync(prefix, `${prefix}${inPlaceSuffix}`)
            });
        }
        this.jsFiles.forEach((jsf) => {
            writeFileSync(newProjDir + "/" + jsf.getRelative(), jsf.makeString())
        });
        this.jsonFiles.forEach((jsf) => {
            writeFileSync(newProjDir + "/" + jsf.getRelative(), jsf.getText());
        });
    }

    public getJS(name: string): JSFile {
        return this.fileMap[name];
    }
}


class ProjectBuilder {
    files: ProjectFile[] = [];
    jsFiles: JSFile[] = [];
    projectDir: string;
    jsonFiles: JSONFile[] = [];
    dirs: Dir[];

    public addFile(file: ProjectFile): ProjectBuilder {
        this.files.push(file);
        if (file.isSource()) { // source code data
            this.jsFiles.push(file as JSFile);
        } else if (file.isData()) { // non source code data
            this.jsonFiles.push(file as JSONFile);
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

    addDir(dir: Dir) {
        this.dirs.push(dir);
    }
}


interface FileMap {
    [key: string]: JSFile
}

