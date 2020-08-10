import {appendFileSync, copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, Stats, unlinkSync} from 'fs'
import path, {basename, extname, join, normalize, relative, resolve} from 'path'

import {ok as assertTrue} from 'assert'
import cpr from 'cpr'

import {
    CJSBuilderData,
    MetaData,
    SerializedJSData,
    write_status
} from "./interfaces";
import {Dir} from './Dirv2'
import {PackageJSON} from "./PackageJSONv2";
import {JSFile} from "./JSv2";
import {AbstractDataFile, AbstractFile} from "./Abstractions";
import {FileFactory} from "./Factory";
import {ProjectManager} from "./ProjectManager";



// const pwd = `/Users/sam/Dropbox/Spring_20/research_proj/DEV_UTIL_DATA_HAS_DB/COMPLEX_FS_TO_PARSE`
// const owd = `/Users/sam/Dropbox/Spring_20/research_proj/DEV_UTIL_DATA_HAS_DB/__x`
//
// let pm = new ProjectManager(pwd, {
//     write_status: "in-place",
//     isModule: false,
//     suffix: '',
//     target_dir: owd
// });
// pm.writeOut()

