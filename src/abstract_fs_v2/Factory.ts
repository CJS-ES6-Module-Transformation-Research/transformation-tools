import {Dir} from "./Dirv2";
import {basename, extname, join, normalize, relative, resolve} from "path";
import {CJSBuilderData, FileType, MetaData} from "./interfaces";
import {lstatSync, Stats} from "fs";
import {AbstractDataFile, AbstractFile} from "./Abstractions";
import {JSFile} from "./JSv2";
import {CJSToJSON, PackageJSON} from "./PackageJSONv2";
import {ProjectManager} from "./ProjectManager";

export class FileFactory {
    readonly root_dir: Dir
    readonly rootPath: string
    readonly target_dir: string | null;
    readonly isModule: boolean
    readonly pm: ProjectManager;

    constructor(path: string, isModule?: boolean, pm: ProjectManager = null) {
        this.isModule = isModule;
        this.rootPath = resolve(path);
        this.pm = pm;
        this.root_dir = this.createRoot();

    }


    getRoot() {
        return this.root_dir;
    }

    createPackageCJSRequire(data: CJSBuilderData) {
        let resolved = normalize(join((data.dir.getAbsolute()), data.cjsFileName))
        let metaData: MetaData = {
            target_dir: this.target_dir,
            stat: null,
            type: FileType.cjs,
            ext: '.cjs',
            isRoot: this.rootPath === resolved,
            rootDir: this.rootPath,
            path_abs: resolved,
            path_relative: join(data.dir.getRelative(), data.cjsFileName)
        };
        let newestMember = new CJSToJSON(resolved, metaData, data.dir, data.dataAsString)
        // if (this.pm) {
        //     this.pm.receiveFactoryUpdate(newestMember, FileType.cjs, this)
        // }
        this.pm.addSource(newestMember)
        return newestMember
    }

    createFile(path: string, parent: Dir) {
        let data: MetaData;

        let resolved = resolve(path)
        let stat = lstatSync(resolved)
        data = this.getData(stat, resolved)

        let child = this.getFileFromType(path, data, parent)
        if (!child) {
            return;
        }
        if (parent) {
            parent.addChild(child)
        }


        return child;

    }


    private createRoot(): Dir {
        let resolved = resolve(this.rootPath)
        let stat = lstatSync(resolved)
        let data: MetaData = this.getData(stat, resolved)
        return new Dir(this.rootPath, data, null, this);
    };


    private getData(stat: Stats, resolved: string): MetaData {
        // let parent_f = createGetParent(parent)
        return {
            target_dir: this.target_dir,
            stat: stat,
            type: this.determineType(resolved, stat),
            ext: extname(resolved),

            // parent: parent_f ,
            isRoot: this.rootPath === resolved,

            rootDir: this.rootPath,
            path_abs: resolved,
            path_relative: this.rootPath === resolved ? '.' : relative(this.rootPath, resolved)
        };
    }

    private getFileFromType(path: string, data: MetaData, parent: Dir): AbstractFile | AbstractDataFile {
        switch (data.type) {

            case FileType.dir:
                return new Dir(path, data, parent, this)
                break;
            case FileType.js:
                return new JSFile(path, data, parent, this.isModule)
                break;
            case FileType.package:
                return new PackageJSON(path, data, parent)
                break;
            default:
                return null;
        }
    }

    private determineType(path: string, stat): FileType {

        if (stat.isDirectory()) {
            return FileType.dir
        } else if (stat.isFile()) {
            return determineFileType(path)
        } else {
            return FileType.OTHER
        }

        function determineFileType(path: string): FileType {
            let ext: string = extname(path).toLowerCase()

            switch (ext) {
                case ".json":
                    if (basename(path, '.json') === "package") {
                        return FileType.package
                    } else {
                        return FileType.json
                    }
                case ".js":
                    return FileType.js

                default:
                    return FileType.OTHER
            }

        }
    }

}