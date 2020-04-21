
 import {copyFileSync, renameSync, writeFileSync} from "fs";
import {generate} from 'escodegen'
 import {AstFile, FileDescript, ProjectData} from "../../src/Types";
 import {FILE_TYPE} from "../../index";

export function replaceJS(asts: AstFile[], files: FileDescript[], source: string, target = '') {
    console.log("Starting WRITE Operations")

    let inPlace = false
     if (!target) {
        inPlace = true;
         console.log("STARTING RENAME  Operations")

         renameOld(asts, source);

    }
    console.log("Finished RENAME Operations")

    writeModdedJS(asts, inPlace ? source:target);//always
    console.log("Finished WRITE JS Operations")


    if (!inPlace) {
        copyRebuildDirs(inPlace, target);//if copy
        console.log("Finished Directory Modifications Operations")

    }


    function renameOld(asts: AstFile[], source: string) {
        let inPlaceSuffix = '.old'
        asts.forEach((e) => {
            let prefix = source + "/" + e.filePath
            renameSync(prefix, `${prefix}${inPlaceSuffix}`)
        })
    }


    function writeModdedJS(asts: AstFile[], target: string) {

        console.log('writing to' + target)

        asts.forEach((e) => {
            console.log('writing to' + e.dir+'/'+e.filePath)
            let prefix:string = target? target + "/":''
            console.log('trying to write out ' + e.filePath)
            let shebangStr = e.shebang ? e.shebang + "\n" : '';
            try{
                console.log(`writing to: ${prefix + e.filePath}`)
            writeFileSync(prefix + e.filePath, shebangStr + generate(e.ast)
                .replace('import_meta_url', 'import.meta.url'))
            }catch (er) {
                console.log(er)
                console.log(prefix + e.dir+'/'+e.filePath)
            }
        })
    }

    function copyRebuildDirs(inPlace: boolean, target: string) {
        if (!inPlace) {
            files.filter((e) => e.ftype !== FILE_TYPE.JS)
                .forEach((e) => {
                        copyFileSync(e.full, target + "/" + e.relative)
                    }
                )
        }
    }
}


class AstSerializer {
    constructor(project: ProjectData, source: string, target: string = source) {

        this.source = source
        this.target = target
        this.proj = project

        this.inPlace = source === target;

        this.astsFiles = project.asts;
    }

    private astsFiles: AstFile[];
    private inPlace: boolean;
    private source: string;
    private target: string;
    private proj: ProjectData;

    public writeOut() {
        if (this.inPlace) {
            this.renameOld();
        }

        this.writeModdedJS();//always


        if (!this.inPlace) {
            this.copyRebuildDirs();//if copy
        }
    }

    private writeModdedJS() {

        this.astsFiles.forEach((e) => {
            console.log('trying to write out ' + e.filePath)
            let shebangStr = e.shebang ? e.shebang + "\n" : '';
            writeFileSync(this.target + "/" + e.filePath, shebangStr + generate(e.ast))
        })


    }

    private renameOld() {
        let inPlaceSuffix = '.old'
        this.astsFiles.forEach((e) => {
            let prefix = this.source + "/" + e.filePath
            renameSync(prefix, `${prefix}${inPlaceSuffix}`)
        })
    }

    private copyRebuildDirs() {
        if (!this.inPlace) {
            this.proj.project.files.filter((e) => e.ftype !== FILE_TYPE.JS)
                .forEach((e) => {
                        copyFileSync(e.full, this.target + "/" + e.relative)
                    }
                )
        }
    }


    private getPrefixPath(astFile: AstFile) {
        return (this.target ? this.target : this.source) + "/" + astFile.filePath
    }
}

