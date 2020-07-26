import {existsSync, readFileSync, unlinkSync, writeFileSync} from "fs";
import yargs, {Arguments, Argv} from 'yargs'
import { join } from 'path';

type __args = Arguments<X>
const cwd = process.cwd();

interface X {
    $0: any,
    _: string[],
    json: string,
    key: string,
    value?: string
}

let args:X  = yargs
    .command<X>('set <json> <key> <value>',
        'adds   key value pair to json file', (e: Argv<X>) => {
            e.strict()
        }, (args) => {

            if (!(args.value &&
                args.key &&
                args.json)) {
                throw new Error("IAE ")
            }
            return args;

                })
    .command<X>('rm <json> <key> ','',(args => args.strict)
    ,args => {
            if (!(args.key &&
                args.json)) {
                throw new Error("IAE ")
            }
            return args;
        })
    .argv ;

let cmd = args._[0]
let json :{[key:string]:any}
let _path = join(cwd, args.json)
if (!existsSync(_path)){
    throw new Error("file "+ _path+" does not exist");
}else{
    if(cmd==="set"){
        json = JSON.parse(readFileSync(_path, 'utf-8'))
        json[args.key] = args.value
    }
        unlinkSync(_path)
    if(cmd==="set"){
        writeFileSync(_path, JSON.stringify(json ,null,4))
    }
}
