import * as yargs from "yargs";
import {runTransform} from "transformations/main";
import {ProjConstructionOpts} from "src/abstract_fs_v2/ProjectManager";
import {write_status} from "src/abstract_fs_v2/interfaces";
import {isAbsolute,join} from 'path'


function cli_parse(yargs) {
    return yargs
        .option({
            "in": {
                desc: "--in <input-proj> specifies input project path",
                type: "string",
                nargs: 1,
                alias: ["input"],
                demandOption: true
            },
            "out": {
                desc: "--out <out-dir> specifies output directory for transformed project",
                type: "string",
                alias: ['o'],
                nargs: 1
            },
            "in-place": {
                desc: "omits the 'sanitize' step.", type: "string"
            },
            "suffix": {desc: "suffix for keeping copies in-place", type: "string"}
        }).argv;
}


const mod = cli_parse(yargs)
if (!mod['in-place'] && !mod["out"]) {
    console.log(`Please either choose an output directory --out <out-dir> or use the flag --in-place`)
    process.exit(1);
}else if(mod['in-place'] && mod["out"]){
    console.log(`Please either choose a single option: an output directory --out <out-dir> OR use the flag --in-place`)
    process.exit(1);
}
let cwd = process.cwd()
if(!isAbsolute(mod.in)){
    mod.in = join(cwd, mod.in)
}

if(mod.out && !isAbsolute(mod.out)){
    mod.out = join(cwd, mod.out)
}

let opts: ProjConstructionOpts = {
    isModule: false,
    suffix: mod.suffix ? mod.suffix : '',
    target_dir: mod.out,
    write_status: mod['in-place'] ? "in-place" : "copy"

}
runTransform(mod.in, opts)
