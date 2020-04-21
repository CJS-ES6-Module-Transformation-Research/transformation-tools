import {fixtures, test_dir, project} from '../Utils/Dirs';
import {copyFileSync, existsSync, mkdirSync, rmdirSync} from "fs";
import {execSync} from "child_process";

let target: string = `${fixtures}/test_dir_2`
console.log (target)
if (existsSync(target)) {
    console.log("exists")
    rmdirSync(target, {recursive: true});
}
// if (false)
try {
    console.log("trying...")
    mkdirSync(target)
    copyFileSync(test_dir, target);
    console.log("not caught")
}catch (e) {
    console.log("caught!".toUpperCase())
    console.log(e)
}