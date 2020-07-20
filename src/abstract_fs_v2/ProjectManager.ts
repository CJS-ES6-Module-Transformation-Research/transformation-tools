import {Dir} from "./Dirv2";
import {JSFile} from "./JSv2";
import {PackageJSON} from "./PackageJSONv2";
import {FileFactory} from "./Factory";
import {AbstractDataFile, AbstractFile} from "./Abstractions";
import {ok as assertTrue} from "assert";
import {appendFileSync, existsSync, lstatSync, mkdirSync, unlinkSync, writeFileSync} from "fs";
import path, {join} from "path";
import {FileType, SerializedJSData, write_status} from "./interfaces";
import cpr from "cpr";

export interface ProjConstructionOpts {
    write_status: write_status,
    target_dir: string,
    suffix: string
    isModule: boolean
}

export class ProjectManager {

    private readonly write_status: write_status
    private readonly root: Dir

    private dirs: { [key: string]: Dir } = {}
    private dirList: Dir[] = []

    private jsMap: { [key: string]: JSFile } = {}
    private jsFiles: JSFile[] = []

    private package_json: PackageJSON [] = []


    private readonly factory: FileFactory;

    private allFiles: AbstractFile[] = []
    private dataFiles: AbstractDataFile[] = []
    private additions: { [relName: string]: AbstractDataFile } = {}//AbstractDataFile[] = []
    private readonly src: string;
    private readonly target: string;
    private readonly suffix: string
    private readonly suffixFsData: { [abs: string]: string } = {}


    constructor(path: string, opts: ProjConstructionOpts) {
        this.src = path
        this.write_status = opts.write_status
        this.suffix = opts.suffix;
        console.log(JSON.stringify(opts, null, 3))

        assertTrue(lstatSync(path).isDirectory(), `project path: ${path} was not a directory!`)

        this.factory = new FileFactory(path, opts.isModule, this);
        this.root = this.factory.getRoot();
        this.root.buildTree();

        this.target = opts.target_dir ? opts.target_dir : path

        if (this.target && this.write_status) {
            if (!existsSync(this.target)) {
                mkdirSync(this.target)
            } else {
                assertTrue(!this.target || lstatSync(this.target).isDirectory(), `target path: ${path} was not a directory!`)
            }
        }

        this.loadFileClassLists();
        if (this.write_status === "in-place" && this.suffix) {
            this.dataFiles.forEach(e => {
                let ser = e.makeSerializable()
                this.suffixFsData[ser.relativePath + this.suffix] = ser.fileData;
            })
        }
    }

    addSource(newestMember: AbstractDataFile) {
        this.additions[newestMember.getRelative()] = newestMember;
    }

    receiveFactoryUpdate(file: AbstractDataFile, type: FileType, factory: FileFactory) {
        if (this.factory === factory) {
            switch (type) {
                case FileType.cjs:
                    this.allFiles.push(file)
                    break;
                default:
                    return;
            }
        }
    }

    private loadFileClassLists() {
        this.root.visit(
            node => {
                this.allFiles.push(node)
                if (node instanceof AbstractDataFile) {
                    this.dataFiles.push(node)
                }

                if (node instanceof Dir) {
                    this.dirList.push(node)
                    this.dirs[node.getRelative()] = node;
                } else if (node instanceof JSFile) {
                    this.jsFiles.push(node)
                    this.jsMap[node.getRelative()] = node;
                } else if (node instanceof PackageJSON) {
                    this.package_json.push(node)
                }
            })
    }

    forEachSource(func: (value: JSFile) => void): void {
        this.jsFiles.forEach(e => func(e))
    }

    getJS(name: string): JSFile {
        return this.jsMap[name]
    };

    public writeOut() {

        if (this.write_status === "in-place") {
            this.writeInPlace()
        } else if (this.write_status === "copy") {
            this.copyOut()
        } else {
            throw new Error('write status not set!')
        }
    }


    private writeInPlace() {

        // if (suffix) {
        //     allFiles.forEach((file: AbstractDataFile) => {
        //         let absolute = join(this.root.getAbsolute(), file.getRelative())
        //         console.log(`absolute: ${absolute}`)
        //         console.log(`root : ${this.root.getAbsolute()}`)
        //         console.log(`relaritve : ${file.getRelative()}`)
        //
        //         // copyFileSync(absolute, absolute + suffix)
        //     });
        //         // }
        for (let relative in this.suffixFsData) {
            let data = this.suffixFsData[relative]
            writeFileSync(join(this.root.getAbsolute(), relative), data)
        }

        this.removeAll()
        this.writeAll()
    }

    private removeAll(root_dir: string = this.root.getAbsolute()) {
        this.dataFiles.forEach((file: AbstractDataFile) => {
            let toRemove: string = join(root_dir, file.getRelative());
            unlinkSync(toRemove)
        });
    }


    private writeAll(root_dir: string = this.root.getAbsolute()) {
        this.dataFiles.forEach((file: AbstractDataFile) => {
            let serialized: SerializedJSData = file.makeSerializable()
            let dir = path.dirname(join(root_dir, serialized.relativePath))
            if (!existsSync(dir)) {
                mkdirSync(dir, {recursive: true})
            }
            appendFileSync(join(root_dir, serialized.relativePath), serialized.fileData);
        })
        for(let filename in this.additions)  {
            let file = this.additions[filename]
            let serialized: SerializedJSData = file.makeSerializable()
            let dir = path.dirname(join(root_dir, serialized.relativePath))
            appendFileSync(join(root_dir, serialized.relativePath), serialized.fileData);

        }
    }

    private copyOut() {

        // require('ncp')(this.src, this.target, {}, () => {
        //     this.removeAll(allFiles, this.target);
        //     this.writeAll(allFiles, this.target);
        // })
        // .then(()=>{

        // })

        // let x =
        cpr(this.src, this.target, {confirm: false, deleteFirst: true, overwrite: true}, () => {
            this.removeAll(this.target)
            this.writeAll(this.target)
        })


    }

//TODO DELETE ONCE FIXED JSONREQUIRE
    // /**
    //  * Transforms project while passing the project to the transformation function.
    //  * @param projTransformFunc creates a transformation function using the project.
    //  */
    // public transformWithProject(projTransformFunc: ProjectTransformFunction) {
    //     let tfFunc: TransformFunction = projTransformFunc(this);
    //     this.transform(tfFunc);
    // }


    /**
     * Runs a namespace re-building on all javascript files in the project.
     */
    rebuildNamespace() {
        this.forEachSource((js: JSFile) => {
            js.rebuildNamespace();
        })
    }
}