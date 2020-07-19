import {Dir} from "src/abstract_fs_v2/Dirv2";
import {JSFile} from "src/abstract_fs_v2/JSv2";
import {PackageJSON} from "src/abstract_fs_v2/PackageJSONv2";
import {FileFactory} from "src/abstract_fs_v2/Factory";
import {AbstractDataFile, AbstractFile} from "src/abstract_fs_v2/Abstractions";
import {ok as assertTrue} from "assert";
import {appendFileSync, copyFileSync, existsSync, lstatSync, mkdirSync, unlinkSync} from "fs";
import path, {join} from "path";
import {SerializedJSData} from "src/abstract_fs_v2/interfaces";
import {write_status} from './interfaces'
import {FileType} from "src/abstract_fs_v2/internals";
import cpr from "cpr";
interface pm_opts {
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


    private factory: FileFactory;

    private allFiles: AbstractFile[] = []
    private dataFiles: AbstractDataFile[] = []
    private readonly src: string;
    private readonly target: string;
    private readonly suffix: string


    constructor(path: string, opts: pm_opts) {
        this.src = path
        this.write_status = opts.write_status
        this.suffix = opts.suffix;

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
    }

    recieveFactoryUpdate(file: AbstractDataFile, type: FileType, factory: FileFactory) {
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
            if (this.suffix) {
                this.appendSuffix(this.dataFiles, this.suffix)
            }
            this.writeInPlace(this.dataFiles, this.suffix)
        } else if (this.write_status === "copy") {
            this.copyOut(this.dataFiles)
        } else {
            throw new Error('write status not set!')
        }
    }

    private appendSuffix(allFiles: AbstractDataFile[], suffix: string) {
        allFiles.map(e => {
            let relative = e.getRelative()
            return {
                orig: relative,
                suffix: relative + suffix
            };
        })
    }

    private writeInPlace(allFiles: AbstractDataFile[], suffix: string = '') {

        if (suffix) {
            allFiles.forEach((file: AbstractDataFile) => {
                let absolute = join(this.root.absolutePath(), file.getRelative())

                copyFileSync(absolute, absolute + suffix)
            });
        }
        this.removeAll(allFiles)
        this.writeAll(allFiles)
    }

    private removeAll(allFiles: AbstractDataFile[], root_dir: string = this.root.absolutePath()) {
        allFiles.forEach((file: AbstractDataFile) => {
            let toRemove: string = join(root_dir, file.getRelative());
            unlinkSync(toRemove)
        });
    }


    private writeAll(allFiles: AbstractDataFile[], root_dir: string = this.root.absolutePath()) {
        allFiles.forEach((file: AbstractDataFile) => {
            let serialized: SerializedJSData = file.makeSerializable()
            let dir = path.dirname(join(root_dir, serialized.relativePath))
            if (!existsSync(dir)) {
                mkdirSync(dir, {recursive: true})
            }
            appendFileSync(join(root_dir, serialized.relativePath), serialized.fileData);
        })
    }

    private copyOut(allFiles: AbstractDataFile[]) {

        cpr(this.src, this.target, {confirm: false, deleteFirst: true, overwrite: true}, () => {
            this.removeAll(allFiles, this.target)
            this.writeAll(allFiles, this.target)

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


    public setSourceAsModule() {
        this.root.visit(e => {
            if (e instanceof PackageJSON) {
                e.makeModule();
            } else if (e instanceof JSFile) {
                e.setAsModule()
            }
        });
    }

    /**
     * Runs a namespace re-building on all javascript files in the project.
     */
    rebuildNamespace() {
        this.forEachSource((js: JSFile) => {
            js.rebuildNamespace();
        })
    }
}