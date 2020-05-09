import {lstatSync, readdirSync} from 'fs';
import {basename, extname} from "path";
import relative from 'relative';

import {TransformableProject} from "./TransformableProject";
import {JSFile} from "../javascript/JSFile";
import {JSONFile, PackageJSON} from "../javascript/JSONFile";
import {OtherFile, SymLink, Dir} from './FilesTypes'


const illegalDirs: Set<string> = new Set<string>();
illegalDirs.add("node_modules")

export type script_or_module = 'script' | 'module'

/**
 * creates a TransformableProject from project path string.
 * @param proj_dir project path string
 * @param processType string represernting whether the project uses ECMAScript modules or not.
 */
export const projectReader = function (proj_dir: string, processType: script_or_module = 'script'): TransformableProject {
    let builder = TransformableProject.builder();
    builder.setProjType(processType).setProjectDir(proj_dir);
    let absDir = '/' + relative('/', proj_dir, null)

    walk(absDir, processType);


    /**
     * recursive directory walk using a ProjectBuilder builder to add created ProjectFile(s) to the project.
     * @param dir the current directory being walked.
     */
    function walk(dir: string, readType: script_or_module = 'script') {

        let ls: string[]
        try {
            ls = readdirSync(dir);
        }catch (readDirError) {
            console.log(`ERROR: ${readDirError} \n in file ${proj_dir} \ncurrent called dir: ${dir}`)
            throw readDirError
        }
        //for file|dir in `ls`
        ls.forEach((file: string) => {
            //helps generate relative path
            let absFile: string = `${dir}/${file}`

            //relative path wrt absolute directory
            let rel: string = relative(absDir, `${dir}/${file}`, null);

            //case isFile
            if (lstatSync(absFile).isFile()) {
                let ext = extname(absFile)

                switch (ext) {
                    case ".js":
                        builder.addFile(new JSFile(absDir, rel, file, readType));
                        break;
                    case ".json":
                        let json :JSONFile;
                        if(file === "package.json" && rel === "package.json"){
                            json = new PackageJSON(absDir);
                            builder.addPackageJson(json as PackageJSON);
                        }else{
                            json = new JSONFile(absDir, rel, file);
                        }
                        builder.addFile(json);
                        break;
                    default:
                        builder.addFile(new OtherFile(absDir, rel, file))
                        break;
                }
                //case isDir
            } else if (lstatSync(absFile).isDirectory()) {

                let absRelative = basename(absFile)

                if (illegalDirs.has(absRelative)) {
                    console.log(`ignoring ${absRelative} aka ${absFile}`)
                    return;
                }
                builder.addDir(new Dir(dir, rel, file, 10))
                walk(absFile, readType)
                //case is symLink
            } else if (lstatSync(absFile).isSymbolicLink()) {
                let ext = extname(absFile)
                builder.addFile(new SymLink(dir, rel, file))

            } else {
                console.log(`NONE OF THE ABOVE: ${absFile} is not a file, link or dir!`)
            }
        });
    }

    return builder.build();
}

