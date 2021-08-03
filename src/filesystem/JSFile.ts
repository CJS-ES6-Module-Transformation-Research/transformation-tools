import {generate} from "escodegen";
import {parseModule, parseScript} from "esprima";
import {traverse, VisitorOption} from "estraverse";
import {Directive, Identifier, ModuleDeclaration, Node, Program, Statement, VariableDeclaration} from "estree";
import {existsSync} from "fs";
import {basename, join, relative} from "path";
import {Imports} from "../refactoring/utility/Imports_Data";
import {InfoTracker} from "../refactoring/utility/InfoTracker";
import {JSBody} from "../refactoring/janitor";
import {API, API_TYPE} from "../refactoring/utility/API";
import {RequireStringTransformer} from "../refactoring/utility/requireStringTransformer";
import {Intermediate} from "../utility/Intermediate";
import {NodeComparators} from "../refactoring/static-analysis/tagger";
import {SequenceNumber} from "../refactoring/static-analysis/util/SequenceNumber";
import {FileType, MetaData, SerializedJSData} from "../utility/types";
import {AbstractDataFile} from './AbstractFileSkeletons'
import {Dir} from './Directory'
import {ModuleAPIMap} from "./FS-Factory";
import {Namespace} from "./Namespace";

type script_or_module = "script" | "module"


export class JSFile extends AbstractDataFile {


    report() {
        return this.reporter.reportOn()
    }

    sequenceNumber: SequenceNumber

    // seq:number = 1


    setUseDefaultCopy(arg0: boolean = true) {
        this.useDefaultCopy = arg0
    }

    getIDMap(): { [id: number]: Node } {
        return this.idMap
    }

    private readonly idMap: { [id: number]: Node } = {}

    getIdTagger(): (node: Node, parent?: Node) => string {
        let seqno = this.sequenceNumber
        let idMap: { [id: number]: Node } = this.idMap
        return function tagger(node: Node, parent: Node) {
            if (!(node[NodeComparators.NODE_ID])) {
                node[NodeComparators.NODE_ID] = seqno.next()
                idMap[node[NodeComparators.NODE_ID]] = node
            }
            return node[NodeComparators.NODE_ID]
        }
    }

    getScopeTagger(): (node: Node, parent?: Node) => string {
        let seqno = this.sequenceNumber

        return function tagger(node: Node, parent: Node = null) {
            if (!(node[NodeComparators.Scope_ID])) {
                node[NodeComparators.Scope_ID] = seqno.next()
            }
            return node[NodeComparators.Scope_ID]
        }
    }

    private useDefaultCopy: boolean = false

    private readonly api: API;
    private readonly apiMap: ModuleAPIMap;
    private readonly _usesNames: boolean;
    private readonly test: boolean;

    private data_based_imports: Imports;

    private readonly infoTracker: InfoTracker;
    private readonly ast: Program;
    private shebang: string;
    private isStrict: boolean = false;//TODO might be unnnecssary--find purposes
    private potentialPrims: VariableDeclaration[] = []
    private toAddToTop: (Directive | Statement | ModuleDeclaration)[] = []
    private toAddToBottom: (Directive | Statement | ModuleDeclaration)[] = []

    private stringReplace: { [key: string]: string } = {};

    private to_insert_copyByValue: VariableDeclaration[] = []

    private namespace: Namespace
    private moduleType: script_or_module;

    private isShebang: RegExp = /^#!.*/

    constructor(path: string, b: MetaData, parent: Dir, isModule: boolean, data = '') {

        super(path, b, parent, data);
        this._usesNames = b.uses_names;
        this.moduleType = isModule ? "module" : "script" //TODO delete or find purpose

        this.test = b.test
        this.ast = this.parseProgram(this.data, isModule)
        this.sequenceNumber = new SequenceNumber()
        this.infoTracker = new InfoTracker(this.getRelative());
        this.removeStrict();
        this.namespace = Namespace.create(this.ast)
        this.apiMap = b.moduleAPIMap
        this.api = new API(API_TYPE.none)
        this.apiMap.initJS(this, this.api)
        this._intermediate = new Intermediate( {},{},[])
        traverse(this.ast, {
            enter: (node, parent) => {
                /* if (node.type === "Identifier" && node.name === "delete") {


                    let gen = this.namespace.generateBestName('__delete')
                    node.name = gen.name
                    this.registerReplace(gen.name, 'delete')
                    // this.namespace.addToNamespace()

                } */
            }
        })
        // this.exportRegistry = new ExportRegistry(this.namespace)
    }

    getBody(): JSBody {
        return this.ast.body;
    }

    private rst: RequireStringTransformer;

    public getRST() {
        if (!this.rst) {
            this.rst = new RequireStringTransformer(this)
        }
        return this.rst
    }

    public rebuildNamespace(defaultExportID: Identifier): Namespace {
        this.namespace = Namespace.create(this.ast, defaultExportID)
        return this.namespace
    }

    public createCJSFromIdentifier(moduleID: string): string {

        let parent: Dir = this.parent();

        let json_abs = join(this.path_abs, moduleID)
        let parentDir = parent.getAbsolute()


        let base = basename(moduleID, ".json");

        let cjsName = `${base}.cjs`

        if (existsSync(join(parentDir, cjsName))) {
            let i = 0;
            let cjsName = `${base}_${i}.cjs`
            while (existsSync(join(parentDir, cjsName))) {
                cjsName = `${base}_${i}.cjs`
                i++
            }
        }

        this.parent().spawnCJS({
            cjsFileName: `${
                join(parentDir, moduleID)
            }.cjs`,
            jsonFileName: relative(this.parent().getRootDirPath(), json_abs),
            dataAsString: `module.exports = require('./${basename(moduleID)}');`,
            dir: parent

        })

        return moduleID + '.cjs'// join()

    }

    private removeStrict() {
        this.isStrict = this.ast.body.length !== 0
            && (this.ast.body[0]['directive'] === "use strict")
        if (this.isStrict) {
            this.ast.body.splice(0, 1)
        }
    }

    public getApi() {
        return this.api;
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

    // public getSheBang(): string {
    // 	return this.shebang;
    // }

    getJS(js: string): JSFile {
        return this.getParent().getJS(js)
    }

    public registerReplace(replace: string, value: string): void {
        this.stringReplace[replace] = value
    }


    private buildScript(): Program {
        let body
            = this.ast.body;
        this.toAddToTop.reverse().forEach((e) => {
            body.splice(0, 0, e)
        })
        this.toAddToBottom.reverse().forEach((e) => {
            body.push(e)
        })
        return this.ast
    }

    private buildEsm(): Program {

        let body
            = this.ast.body;
        this.ast.sourceType = "module"

        this.to_insert_copyByValue.reverse().forEach((e) => {
            body.splice(0, 0, e)
        })
        this.toAddToTop.reverse().forEach((e) => {
            body.splice(0, 0, e)
        })
        this.toAddToBottom.reverse().forEach((e) => {
            body.push(e)
        })
        this.potentialPrims.reverse().forEach((e) => {
            body.splice(0, 0, e)
        })

        if (this.test && (!this.data_based_imports)) {
            //skip cause test
        } else {
            this.data_based_imports.getDeclarations().reverse().forEach(e => {
                this.ast.body.splice(0, 0, e)
            })
        }
        return this.ast;
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
    private metavars: { seenDirname: boolean, seenFilename: boolean } = {seenDirname: false, seenFilename: false}

    getSeenMetaVariables(): { seenDirname: boolean, seenFilename: boolean } {
        return this.metavars
    }

    private parseProgram(program: string, isModule): Program {

        if ((this.isShebang as RegExp).test(this.data)) {
            this.shebang = this.isShebang.exec(this.data)[0].toString()
            program = program.replace(this.shebang, '');

        } else {
            this.shebang = '';
        }
        let _program: Program
        try {
            try {
                _program = (isModule ? parseModule : parseScript)(program, {loc: true}, (node) => {
                    if (node.type === "Identifier") {
                        switch (node.name) {
                            case "__dirname":
                                this.metavars.seenDirname = true;
                                this.metavars.seenFilename = true;

                                return VisitorOption.Break
                            case "__filename":
                                this.metavars.seenFilename = true;
                                break;
                        }

                    }
                })
            } catch (e2) {
                if (this.test) {
                    _program = parseModule(program, {loc: true})
                } else {
                    throw e2;
                }
            }
            return _program
        } catch (e) {
            throw new Error(`Esprima Parse ERROR in file ${this.path_abs} on line ${e.lineNumber}:${e.index} with description ${e.description}\n`)
        }
    }


    makeSerializable(): SerializedJSData {
        let program: Program = this.moduleType === "script" ? this.buildScript() : this.buildEsm()

        let programString: string

        try {

            program.body = program.body.filter((e) => e !== null && e !== undefined)

            programString = generate(program)


        } catch (e) {


            console.log(`CAUGHT generate in file ${this.path_relative} with exception: ${e}`)
            // console.log(JSON.stringify(program,null,3)	)

            // console.log()
            throw e
            // process.exit(-1)
        }
        if (!programString) {
            // console.log(program.body)
            throw new Error(`generation issue in file ${this.getRelative()}`)
        }

        for (let key in this.stringReplace) {
            let value = this.stringReplace[key];
            // console.log(`replacing ${key} with ${value}`)
            //like test_resources.import.meta.url
            if (!programString) {
                throw new Error(`FAILED: pre replace `)
            }

             programString = programString.replace( new RegExp(key,'g'), value)
            if (!programString) {
                throw new Error(`FAILED: trying to : replacing ${key} with ${value}`)
            }

        }

        return {
            relativePath: this.path_relative,
            fileData: programString
        };
    }

    static mockedMetaDefault: MetaData = {
        moduleAPIMap: null,
        isRoot: false,
        ext: 'js',
        path_abs: '/this.js',
        path_relative: 'this.js',
        rootDir: '/',
        stat: null,
        target_dir: '',
        type: FileType.js,
        uses_names: false
    };
    static mockedMetaNamed: MetaData = {
        moduleAPIMap: null,
        isRoot: false,
        ext: 'js',
        path_abs: '/this.js',
        path_relative: 'this.js',
        rootDir: '/',
        stat: null,
        target_dir: '',
        type: FileType.js,
        uses_names: true
    };


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
        return this.namespace;
    }

    insertCopyByValue(copiedValue: VariableDeclaration) {
        this.to_insert_copyByValue.push(copiedValue)
    }

    getAPIMap() {
        return this.apiMap;
    }

    usesNamed() {
        return this._usesNames;
    }

    setImports(imports: Imports) {
        this.data_based_imports = imports
    }

    getUseDefaultCopy() {
        return this.useDefaultCopy
    }

    getInfoTracker(): InfoTracker {
        return this.infoTracker;
    }

    getDefaultExport(): Identifier {
        return this.namespace.getDefaultExport()
    }

    private readonly _intermediate: Intermediate

    getIntermediate() {
        return this._intermediate
    }

}
