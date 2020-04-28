import {JSFile} from "../javascript/JSFile";
import {ProjectFile} from "./FilesTypes";
import {renameSync, writeFileSync} from "fs";
import {JSONFile} from "../javascript/JSONFile";

export class TransformableProject {
    private files: ProjectFile[];
    private jsFiles: JSFile[];
    private jsonFiles: JSONFile[];
    private projectDir: string;
    private originalFiles: Set<string>
    private fileMap: FileMap = {};


    private constructor(builder: ProjectBuilder) {
        this.files = builder.files;
        this.jsFiles = builder.jsFiles;
        this.jsonFiles = builder.jsonFiles;
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

    public forEachSource(func: (value: JSFile) => void): void {
        this.jsFiles.forEach(func)
    }

    public writeOut(inPlaceSuffix:string) {
        if (inPlaceSuffix) {
            this.originalFiles.forEach(e => {
                let prefix = this.projectDir + "/" + e;
                renameSync(prefix, `${prefix}${inPlaceSuffix}`)
            });
        }
        this.jsFiles.forEach((jsf) => {
            writeFileSync(jsf.getAbsolute(), jsf.makeString())
        });
        this.jsonFiles.forEach((jsf) => {
            writeFileSync(jsf.getAbsolute(),jsf.getText());
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

    public addFile(file: ProjectFile): ProjectBuilder {
        this.files.push(file);
        if (file.isSource()) { // source code data
            this.jsFiles.push(file as JSFile);
        }else if(file.isData()){ // non source code data
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
}



interface FileMap {
    [key: string]: JSFile
}

