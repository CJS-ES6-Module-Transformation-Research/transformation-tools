import {Stats} from "fs";
import {Dir} from "./Dirv2";
import {AbstractFile} from "./Abstractions";
import {JSFile} from "./JSv2";



export interface SerializedJSData {
    relativePath: string
    fileData: string
}


export type FileVisitor = (visit: AbstractFile) => void




export enum FileType {
    OTHER = "OTHER",
    json = "json",
    package = "package",
    cjs = "cjs",
    dir = "dir",
    js = "js"
}
export interface Visitable {
    visit: (visitor: FileVisitor) => void
}


export interface CJSBuilderData {
    dir: Dir
    dataAsString: string
    jsonFileName: string
    cjsFileName: string
}

export interface DirSupplier {
    (): Dir,
    pName: string
}
export type write_status = "copy"| "in-place"

export type script_or_module = "script" | "module"

export interface MetaData {
    rootDir:string
    ext:string
    stat:Stats|null
    type:FileType
    isRoot:boolean
    path_abs:string
    path_relative:string
    target_dir:string
}
export type TransformFunction = (js:JSFile)=> void