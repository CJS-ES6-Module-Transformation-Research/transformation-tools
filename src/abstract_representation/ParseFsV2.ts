import {Program} from "estree";
import {parseScript, parseModule} from 'esprima'
import {readFileSync, readdirSync, existsSync, fsyncSync, lstatSync} from 'fs'
import {join, dirname} from 'path'

enum FileType {
    json = "JSON",
    package = "package",
    dir = "dir",
    text = "text",
    js = "js",
}

interface AbstractFile {
    files: AbstractFile[]
    directory: AbstractFile
    package_json: AbstractFile
    type?: FileType
}

interface AbstractJsonFile extends AbstractFile {
    data: JSON
    type?: FileType.json
}

interface AbstractPackageJson extends AbstractFile {
    mainfile_path: "string"
    mainfile: AbstractFile
    data: JSON
    type?: FileType.package
}

interface AbstractDirectory extends AbstractFile {
    path: string
    parent: AbstractDirectory
    children: AbstractFile[]
    data: JSON
    type?: FileType.dir
}

interface AbstractTextualFile {
    text: string
    type?: FileType.text
}

interface AbstractJavaScriptFile extends AbstractFile {
    ast: Program
    type?: FileType.js
}

let x: AbstractJavaScriptFile = {
    directory: undefined, files: [], package_json: undefined,
    ast: parseScript('console.log()')
}

let p: AbstractPackageJson = null;
import yargs from 'yargs'

let abs: string = yargs.argv.root.toString()
let root = readdirSync(abs, 'utf-8')
let pj_dirname = dirname(abs)

enum ft {
    file = 'file',
    dir = 'dir',
    symlink = 'symlink'
}

interface i {
    type: ft
    absolute_dir: string
    fname: string
}

let xx: i[] = [];
root.forEach((a, b, c) => {
    let joined = join(abs, a)
    let w = lstatSync(joined)
let z:i = {
    type:ft.symlink,
    absolute_dir:joined,
    fname:a
}
    if (w.isFile()) {
        z.type = ft.file
    } else if (w.isDirectory()) {
        z.type = ft.dir
    }
    // else if (w.isSymbolicLink()) {
    //
    // } else {
    //
    // }
    xx.push(z)


})
console.log(lstatSync(abs).isFile())
root.forEach(e => console.log(e))
