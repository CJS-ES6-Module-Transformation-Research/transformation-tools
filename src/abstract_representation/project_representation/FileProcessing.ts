import {lstatSync, readdirSync} from "fs";
import {basename,extname} from "path";
import relative from 'relative';
import {TransformableProject} from "./FS";
import {JSFile} from "./JS";
import {JSONFile, OtherFile, SymLink} from "./FilesTypes";

let illegalDirs: Set<string> = new Set<string>();
illegalDirs.add("node_modules")
export type script_or_module = 'script' | 'module'
export const ProcessProject =  function (proj_dir: string,processType:script_or_module = 'script'): TransformableProject {
    let builder = TransformableProject.builder();
    builder.setProjectDir(proj_dir);
    let absDir = '/' + relative('/', proj_dir, null)

    traverseRecurseOO(absDir);


    function traverseRecurseOO(dir: string) {
        let ls: Array<string> = readdirSync(dir);
        ls.forEach((file) => {
            let absFile = `${dir}/${file}`
            let rel = relative(absDir, `${dir}/${file}`,null);
            if (lstatSync(absFile).isFile()) {
                let ext = extname(absFile)
                switch (ext) {
                    case ".js":
                        builder.addFile(new JSFile(dir, rel, file, processType));
                        break;
                    case ".json":
                        builder.addFile(new JSONFile(dir, rel, file));
                        break;
                    default:
                        builder.addFile(new OtherFile(dir, rel, file))
                        break;
                }
            } else if (lstatSync(absFile).isDirectory()) {

                let absRelative = basename(absFile)

                if (illegalDirs.has(absRelative)) {
                    console.log(`ignoring ${absRelative} aka ${absFile}`)
                    return;
                }
                traverseRecurseOO(absFile)

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

