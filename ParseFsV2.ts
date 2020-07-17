import {
    appendFileSync,
    copyFileSync,
    existsSync,
    lstatSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    Stats,
    unlinkSync
} from 'fs'
import path, {basename, extname, join, relative, resolve} from 'path'
import {Directive, ModuleDeclaration, Program, Statement} from "estree";
import {parseModule, parseScript} from "esprima";
import {ok as assertTrue} from 'assert'
import {generate} from "escodegen";
import cpr from 'cpr'
import {ImportManager} from "transformations/import_transformations/ImportManager";
import {ExportBuilder} from "transformations/export_transformations/ExportsBuilder";
import {Namespace} from "abstract_representation/project_representation/javascript/Namespace";
import {script_or_module} from "abstract_representation/project_representation";
import shebangRegex from "shebang-regex";


// type DirSupplier = () => Dir

interface DirSupplier {
    (): Dir,

    pName: string
}

function createGetParent(dir: Dir): DirSupplier | null {
    if (!dir) {
        return null;
    }
    let getParent = (() => dir) as DirSupplier
    getParent.pName = dir.relativePath();
    return getParent
}

type write_status = "in-place" | "copy";

interface MetaData {
    stat: Stats;
    type: FileType;
    ext: string;
    // parent: () => DirSupplier | null;
    readonly isRoot: boolean
    readonly rootDir: string
    path_abs: string
    path_relative: string
    target_dir: string
}

type FileVisitor = (visit: AbstractFile) => void


interface Visitable {
    visit: (visitor: FileVisitor) => void
}

interface SerializedJSData {
    relativePath: string
    fileData: string
}


enum FileType {
    OTHER = "OTHER",
    json = "json",
    package = "package",
    cjs = "cjs",
    dir = "dir",
    js = "js"
}

class FileFactory {
    readonly root_dir: Dir
    readonly rootPath: string
    readonly target_dir: string | null;
    readonly isModule: boolean

    constructor(path: string, isModule: boolean = false) {
        this.isModule = isModule;
        this.rootPath = resolve(path);

        this.root_dir = this.createRoot();

    }

    private createRoot(): Dir {
        let resolved = resolve(this.rootPath)
        let stat = lstatSync(resolved)
        let data: MetaData = this.getData(stat, resolved)
        return new Dir(this.rootPath, data, null, this);
    };


    createFile(path: string, parent: Dir) {
        let data: MetaData;

        let resolved = resolve(path)
        let stat = lstatSync(resolved)
        data = this.getData(stat, resolved)

        let child = this.getFileFromType(path, data, parent)
        if (!child) {
            console.log(`path ${path} was created as null: `)
            return;
        }
        if (child.getParent()) {
            child.getParent().addChild(child)
        }


        return child;

    }

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

    getRoot() {
        return this.root_dir;
    }
}


abstract class AbstractFile implements Visitable {// MetaData,

    protected constructor(path: string, bfd: MetaData, parent: Dir) {


        this.ext = bfd.ext
        this.stat = bfd.stat
        this.type = bfd.type

        this.isRoot = bfd.isRoot
        this.rootDir = bfd.rootDir

        this.path_abs = bfd.path_abs
        this.path_relative = bfd.path_relative
        this.target_dir = bfd.target_dir;
        this.parent = createGetParent(parent)

    }

    protected readonly target_dir: string;

    protected readonly stat: Stats
    protected readonly type: FileType
    protected readonly ext: string
    protected readonly parent: DirSupplier | null
    protected readonly isRoot: boolean
    protected readonly rootDir: string

    protected path_abs: string;
    protected readonly path_relative: string;


    getType(): FileType {
        return this.type
    }

    getStats(): Stats {
        return this.stat
    }

    getExt(): string {
        return this.ext
    }

    getParent(): Dir {
        return this.isRoot ? null : this.parent()
    }

    absolutePath(): string {
        return this.path_abs
    }

    relativePath(): string {
        return this.path_relative;
    }

    visit(visitor: FileVisitor): void {
        visitor(this)
    }


}

abstract class AbstractDataFile extends AbstractFile {
    protected readonly data: string

    protected constructor(path: string, b: MetaData, parent: Dir) {
        super(path, b, parent);
        this.data = readFileSync(this.path_abs, 'utf-8')
    }

    abstract makeSerializable(): SerializedJSData
}


class Dir extends AbstractFile {


    private factory: () => FileFactory

    listChildrenByName() {
        return readdirSync(this.absolutePath())
    }

    protected package: PackageJSON = null;
    protected children: AbstractFile[] = []

    //TODO add CJS TO THIS
    addChild(child: AbstractFile) {
        this.children.push(child)
    }

    constructor(path: string, b: MetaData, parent: Dir, factory: FileFactory) {
        super(path, b, parent);
        this.factory = () => factory;
    }


    visit(visitor: FileVisitor) {
        visitor(this)
        this.children.forEach(e => e.visit(visitor))
    }

    buildTree() {
        readdirSync(this.absolutePath()).forEach(e => {
            let child = this.factory().createFile(join(this.path_abs, e), this)
            if (child && child instanceof Dir) {
                child.buildTree()
            }

        })
    }


    setPackageJSON(packageJson: PackageJSON) {
        this.package = packageJson
    }

    getPackageJSON(): PackageJSON {
        if (this.package) {
            return this.package

        } else if (this.isRoot) {
            throw  new Error('package.json not found')
        } else {
            return this.parent().getPackageJSON()
        }
    }
}


class PackageJSON extends AbstractDataFile {
    bin: string;
    json: { [key: string]: any }
    main: string;

    constructor(path: string, b: MetaData, parent: Dir) {
        super(path, b, parent);
        this.json = JSON.parse(this.data)

        if (this.json.main) {
            this.main = this.json.main;
        }
        if (this.json.bin) {
            this.bin = this.json.bin;
        }
        this.parent().setPackageJSON(this)

    }

    makeModule() {
        this.json.type = "module"
    }

    writeToCJS() {
        throw new Error()
    }

    makeSerializable(): SerializedJSData {
        return {fileData: JSON.stringify(this.json, null, 4), relativePath: this.relativePath()};
    }
}


class CJS extends AbstractDataFile {
    private readonly ast: Program;

    makeSerializable(): SerializedJSData {
        return {
            relativePath: this.path_relative,
            fileData: generate(this.ast)
        };
    }

    constructor(path: string, metadata: MetaData, parent: Dir, ast: Program) {
        super(path, metadata, parent);
        this.ast = ast;
    }

}


class ProjectManager {
    private readonly write_status: write_status
    private readonly root: Dir

    private dirs: { [key: string]: Dir } = {}
    private dirList: Dir[] = []
    private js: { [key: string]: JSFile } = {}
    private package_json: { [key: string]: PackageJSON } = {}
    // json: { [key: string]: JSON_File } = {}

    private factory: FileFactory;

    private intitalFiles: AbstractDataFile[] = []
    private readonly src: string;
    private readonly target: string;
    private readonly suffix: string

    private sourceFileGetter(list: AbstractDataFile[]) {
        this.root.visit(
            node => {
                if (node instanceof AbstractDataFile) {
                    list.push(node)
                }
            })
    }


    constructor(path: string, write_status: write_status, target_dir: string = path, suffix: string = '') {
        this.src = path
        assertTrue(lstatSync(path).isDirectory(), `path: ${path} was not a directory!`)
        if (!existsSync(target_dir)) {
            mkdirSync(target_dir)
        }
        this.target = target_dir
        assertTrue(!target_dir || lstatSync(target_dir).isDirectory(), `path: ${path} was not a directory!`)


        console.log('passed assertions')


        this.suffix = suffix;
        this.factory = new FileFactory(path);
        console.log(this.factory.getRoot());
        this.root = this.factory.getRoot();
        console.log(this.root)
        this.root.buildTree();

        // this.root = this.factory.getRoot();
        this.dirList = []
        this.write_status = write_status

        this.sourceFileGetter(this.intitalFiles);

        //
        // this.root.visit(
        //     (fv: AbstractFile) => {
        //         console.log(fv.relativePath())
        //         let relative = fv.relativePath();
        //         if (fv instanceof PackageJSON) {
        //             console.log('pkg')
        //             this.package_json[relative] = fv;
        //         } else if (fv instanceof Dir) {
        //             console.log('dir')
        //             this.dirs[relative] = fv;
        //             this.dirList.push(fv)
        //         } else if (fv instanceof JS) {
        //             console.log('js')
        //             this.js[relative] = fv;
        //         }
        //         let js = this.js[fv.relativePath()]
        //         if (!js) {
        //             console.log(`${fv.relativePath()} is not js`)
        //             return
        //         }
        //         console.log(`${fv.relativePath()} => ${js.relativePath()}`)
        //     }
        // );

        console.log('manager created')


    }

    public writeOut() {

        console.log('starting write-out...')


        let allFiles: AbstractDataFile[] = [];
        this.sourceFileGetter(allFiles)

        if (this.write_status === "in-place") {
            if (this.suffix) {
                this.appendSuffix(allFiles, this.suffix)
            }
            this.writeInPlace(allFiles, this.suffix)
        } else if (this.write_status === "copy") {
            this.copyOut(allFiles)
        } else {
            throw new Error('write status not set!')
        }
    }

    private appendSuffix(allFiles: AbstractDataFile[], suffix: string) {
        allFiles.map(e => {
            let relative = e.relativePath()
            return {
                orig: relative,
                suffix: relative + suffix
            };
        })
    }

    private writeInPlace(allFiles: AbstractDataFile[], suffix: string = '') {

        if (suffix) {
            allFiles.forEach((file: AbstractDataFile) => {
                let absolute = join(this.root.absolutePath(), file.relativePath())

                copyFileSync(absolute, absolute + suffix)
            });
        }
        this.removeAll(allFiles)
        this.writeAll(allFiles)
    }

    private removeAll(allFiles: AbstractDataFile[], root_dir: string = this.root.absolutePath()) {
        allFiles.forEach((file: AbstractDataFile) => {
            let file2 = join(root_dir, file.relativePath());
            // console.log(file2 )
            // if (existsSync(file2)){
            //     console.log(file2 )
            //
            // }
            unlinkSync(file2)
        });
    }


    private writeAll(allFiles: AbstractDataFile[], root_dir: string = this.root.absolutePath()) {
        // this.dirList.forEach(dir=> {
        //     let abs = dir.absolutePath()
        //     if (!existsSync(abs))
        //
        // })
        allFiles.forEach((file: AbstractDataFile) => {
            let sz = file.makeSerializable()
            let dir = path.dirname(join(root_dir, sz.relativePath))
            if (!existsSync(dir)) {
                mkdirSync(dir, {recursive: true})
            }
            appendFileSync(join(root_dir, sz.relativePath), sz.fileData);
        })
    }

    getJS() {
        return this.js
    }

    private copyOut(allFiles: AbstractDataFile[]) {

        cpr(this.src, this.target, {confirm: false, deleteFirst: true, overwrite: true}, () => {
            this.removeAll(allFiles, this.target)
            this.writeAll(allFiles, this.target)

        })
        // console.log (`trying to copy from: ${this.src } :: TO:  ${ this.target}` )

        // this.writeAll(allFiles,  this.target)
    }
}

const pwd = `/Users/sam/Dropbox/Spring_20/research_proj/DEV_UTIL_DATA_HAS_DB/COMPLEX_FS_TO_PARSE`
const owd = `/Users/sam/Dropbox/Spring_20/research_proj/DEV_UTIL_DATA_HAS_DB/__x`


let pm = new ProjectManager(pwd, 'in-place', owd);
pm.writeOut()


interface JSFile_I {
    shebang: string;
    ast: Program;
    isStrict: boolean;
    toAddToTop: (Directive | Statement | ModuleDeclaration)[];
    toAddToBottom: (Directive | Statement | ModuleDeclaration)[];
    stringReplace: { [key: string]: string };
    replacer: (arg: string) => string;
    imports: ImportManager;
    exports: ExportBuilder;
    namespace: Namespace;
    moduleType: script_or_module;

    rebuildNamespace(): void;

    addToTop(toAdd: Directive | Statement | ModuleDeclaration): void;
    addToBottom(toAdd: Directive | Statement | ModuleDeclaration): void;
    setAsModule(): void;
    getAST(): Program;
    getSheBang(): string;
    registerReplace(replace: string, value: string): void;

    namespaceContains(identifier: string): boolean;
    getNamespace(): Namespace;
    getImportManager(): ImportManager;
    getExportBuilder(): ExportBuilder;

    build(): Program;
    makeString(): string;
}


class JSFile extends AbstractDataFile {
    private ast: Program;


    private shebang: string;

    private isStrict: boolean = false;

    private toAddToTop: (Directive | Statement | ModuleDeclaration)[]
    private toAddToBottom: (Directive | Statement | ModuleDeclaration)[]

    private stringReplace: { [key: string]: string } = {};


    private replacer: (s: string) => string = (s) => s;

    private imports: ImportManager
    private exports: ExportBuilder;

    private namespace: Namespace
    private moduleType: script_or_module;


    constructor(path: string, b: MetaData, parent: Dir, isModule: boolean) {
        super(path, b, parent);


        this.shebang = '';
        this.toAddToTop = [];
        this.toAddToBottom = [];
        let program: string = this.data
        if (shebangRegex.test(this.data)) {
            this.shebang = shebangRegex.exec(this.data)[0].toString()
            program = program.replace(this.shebang, '');

        }
        try {

            this.ast = (isModule ? parseModule : parseScript)(program)

        } catch (e) {
            // console.log(`${rel} has error:  ${e} with text: \n ${this.text}`);
            throw e;
        }


        this.isStrict = this.ast.body.length !== 0
            && (this.ast.body[0]['directive'] === "use strict")
        if (this.isStrict) {
            this.ast.body.splice(0, 1)
        }


        this.rebuildNamespace();

    }


    public rebuildNamespace() {
        this.namespace = Namespace.create(this.ast);
    }


    public addToTop(toAdd: Directive | Statement | ModuleDeclaration) {
        this.toAddToTop.push(toAdd)
    }

    public addToBottom(toAdd: Directive | Statement | ModuleDeclaration) {
        this.toAddToTop.push(toAdd)
    }

    public setAsModule() {
        this.moduleType = "module";
    }

    public getAST(): Program {
        return this.ast;
    }

    public getSheBang(): string {
        return this.shebang;
    }


    public registerReplace(replace: string, value: string): void {
        // this.stringReplace.set(replace, value);
        this.stringReplace[replace] = value
    }


    private buildProgram(): Program {
        let addToTop: (Directive | Statement | ModuleDeclaration)[] = []
        this.toAddToTop.forEach(e => addToTop.push(e));
        let addToBottom: (Directive | Statement | ModuleDeclaration)[] = []
        this.toAddToBottom.forEach(e => addToBottom.push(e));

        let newAST = this.ast;
        let body
            = newAST.body;
        newAST.sourceType = this.moduleType

        addToTop.reverse().forEach((e) => {
            body.splice(0, 0, e)
        })

        addToBottom.reverse().forEach((e) => {
            body.push(e)
        })

        if (this.isStrict && this.ast.sourceType !== "module") {
            this.ast.body.splice(0, 0,
                JSFile.useStrict
            );
        }

        return newAST;
    }

    protected static readonly useStrict: Directive = {
        "type": "ExpressionStatement",
        "expression": {
            "type": "Literal",
            "value": "use strict",
            "raw": "\"use strict\""
        },
        "directive": "use strict"
    }

    private makeExportsArray(body: (Directive | ModuleDeclaration | Statement)[]) {

        let exports = this.exports.build();

        if (exports.named_exports && exports.named_exports.specifiers.length > 0) {
            body.push(exports.named_exports)
        }

        if (exports.default_exports && exports.default_exports.declaration) {

            switch (exports.default_exports.declaration.type) {

                case "ObjectExpression":
                    if (exports.default_exports.declaration.properties.length === 0) {
                        break;
                    }

                // not technically necessary however it is the only other possibility at this time... seems explicit.
                case "Identifier":
                default:
                    body.push(exports.default_exports)
                    break;
            }
        }
    }







    /**
     * returns true if identifier is in the namespace.
     */
    namespaceContains(identifier: string) {
        return this.namespace.containsName(identifier);
    }

    /**
     * gets the current object representing the namespace for the ast.
     */
    getNamespace(): Namespace {
        this.rebuildNamespace();
        return this.namespace;
    }


    /**
     * gets the JSFiles ImportManager.
     */
    getImportManager(): ImportManager {
        return this.imports;
    }


    getExportBuilder(): ExportBuilder {
        return this.exports;
    }


    makeSerializable(): SerializedJSData {
        let program: string
        try {
            program = generate(this.buildProgram())
            for (let key in this.stringReplace) {
                let value = this.stringReplace[key];
                console.log(`replacing ${key} with ${value}`)
                program = program.replace(key, value)
            }
            // .forEach((k: string, v: string) => {
            //todo import.meta....

            // });
            this.shebang = this.shebang ? this.shebang + '\n' : this.shebang;
            program = `${this.shebang}\n${program}\n`

        } catch (e) {
            console.log(`in file ${this.path_relative} with exception: ${e}`)

        }

        return {
            relativePath: this.path_relative,
            fileData: program
        };
    }
}
