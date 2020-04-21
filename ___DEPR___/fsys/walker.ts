import {lstatSync, readdirSync} from 'fs'
import path, {extname} from 'path'
import {FILE_TYPE} from '../../index'
import {DirDescript, FileDescript, ProjectFS} from "../../src/Types";
import relative from 'relative'

let illegalDirs:Set<string> = new Set<string>();
illegalDirs.add("node_modules")

export function traverseProject(proj_dir: string): ProjectFS {
    let absDir = '/' + relative('/', proj_dir,null)

    let files_tr: Array<FileDescript> = []
    let dirs_tr: Array<DirDescript> = []
    traverseRecurse(absDir);

    function getFT(ext: string) {
        switch (ext) {
            case FILE_TYPE.JS:
                return FILE_TYPE.JS
            case FILE_TYPE.JSON:
                return FILE_TYPE.JSON
            default:
                return FILE_TYPE.OTHER
        }
    }

    function traverseRecurse(dir: string) {
        let ls: Array<string> = readdirSync(dir);
        ls.forEach((file) => {
            let absFile = `${dir}/${file}`

            if (lstatSync(absFile).isFile()) {
                let ext = extname(absFile)
                files_tr.push({
                    dir: dir,
                    file: file,
                    full: dir + '/' + file,
                    ftype: getFT(ext),
                    relative: relative(absDir, `${dir}/${file}`,null)
                });
            } else if (lstatSync(absFile).isDirectory()) {
                let absRelative = path. basename(absFile)
                if(illegalDirs.has(absRelative)){
                    console.log(`ignoring ${absRelative} aka ${absFile}`)
                    return;
                }
                dirs_tr.push({dir: absFile, relative: relative(absDir, absFile,null)})
                traverseRecurse(absFile)
            } else if (lstatSync(absFile).isSymbolicLink()) {
                let ext = extname(absFile)
                files_tr.push({
                    dir: dir,
                    file: file,
                    full: dir + '/' + file,
                    ftype: FILE_TYPE.SYMLINK,
                    relative: relative(absDir, `${dir}/${file}`,null)
                });
            } else {
                console.log(`NONE OF THE ABOVE: ${absFile} is not a file, link or dir!`)
            }
        });
    }

    let projectFS: ProjectFS = {project: absDir, files: files_tr, dirs: dirs_tr}

    return projectFS;
}



