import {JSFile} from "../javascript/JSFile";
import {ProjectFile, Dir} from "./FilesTypes";
import {copyFile, copyFileSync, existsSync, mkdirSync, renameSync, writeFileSync} from "fs";
import {JSONFile} from "../javascript/JSONFile";
import relative from "relative";
import path from "path";

export class TransformableProject {
    private files: ProjectFile[];
    private jsFiles: JSFile[];
    private jsonFiles: JSONFile[];
    private projectDir: string;
    private originalFiles: Set<string>
    private jsFileMap: FileMap<JSFile> = {};
    private jsonFileMap: FileMap<JSONFile> = {};
    private dirs: Dir[] = []



    private constructor(builder: ProjectBuilder) {
        this.files = builder.files;


        this.jsFiles = builder.jsFiles;
        this.jsFiles.forEach((jsf) => {
            this.jsFileMap[jsf.getRelative()] = jsf;
        });

        this.jsonFiles = builder.jsonFiles;
        this.jsonFiles.forEach(jsf => {
            this.jsonFileMap[jsf.getRelative()] = jsf;
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

    public writeOutInPlace(suffix: string) {
        this.writeOut(suffix, this.projectDir)
    }

    public writeOutNewDir(rootDir: string) {
        this.writeOut('', rootDir)
    }

    private writeOut(inPlaceSuffix: string, newProjDir: string) {
        try {
            if (!existsSync(newProjDir)) {
                mkdirSync(newProjDir, {recursive: true});
            }
        } catch (err) {
            console.log(`ERROR IN MK RootDir: ${err}`)

        }
        this.dirs.forEach((d) => {
            try {
                mkdirSync(newProjDir + '/' + d.getRelative(), {recursive: true});
            } catch (e) {
                console.log(`ERROR IN MKDIR: ${e}`)
            }
        });
        if (inPlaceSuffix) {
            this.files.filter(e => !e.isData()).forEach(e => {
                let prefix = newProjDir + "/" + e.getRelative();
                copyFileSync(prefix, `${prefix}${inPlaceSuffix}`)
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
        return this.jsFileMap[name];
    }

    getJSON(json: string): JSONFile {
        return this.jsonFileMap[json];
    }

    public addJS(relative: string, data: string):void{
        let added = new JSFile(this.projectDir, relative, path.basename(relative),'script',data);
        this.files.push(added);
        this.jsFiles.push(added);
        this.jsFileMap[added.getRelative()] = added;
    }


    public display(): void {
        console.log(`_____dir_____s`)
        this.dirs.forEach(e => {
            console.log(`DIR:${e.getDir()}\tREL:${e.getRelative()}\tABS:${e.getAbsolute()}`)
        })
        console.log(`_____jsFiles_____`)
        this.jsFiles.forEach(e => {
            console.log(`DIR:${e.getDir()}\tREL:${e.getRelative()}\tABS:${e.getAbsolute()}`)
        })
        console.log(`_____jsonFiles_____`)
        this.jsonFiles.forEach(e => {
            console.log(`DIR:${e.getDir()}\tREL:${e.getRelative()}\tABS:${e.getAbsolute()}`)
        })
        // console.log(`files`)
        // this.files.forEach(e=>{   console.log(`DIR:${e.getDir()}\tREL:${e.getRelative()}\tABS:${e.getAbsolute()}`)})
    }


}


class ProjectBuilder {
    files: ProjectFile[] = [];
    jsFiles: JSFile[] = [];
    projectDir: string;
    jsonFiles: JSONFile[] = [];
    dirs: Dir[] = [];

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


interface FileMap<T> {
    [key: string]: T
}

