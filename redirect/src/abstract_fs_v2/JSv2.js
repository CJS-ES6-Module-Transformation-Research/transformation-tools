var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSFile = void 0;
const escodegen_1 = require("escodegen");
const esprima_1 = require("esprima");
const estraverse_1 = require("estraverse");
const fs_1 = require("fs");
const path_1 = require("path");
const shebang_regex_1 = __importDefault(require("shebang-regex"));
const RequireTracker_1 = require("../RequireTracker");
const ExportsBuilder_1 = require("../transformations/export_transformations/ExportsBuilder");
const ImportManager_1 = require("../transformations/import_transformations/ImportManager");
const Abstractions_1 = require("./Abstractions");
const Namespace_1 = require("./Namespace");
// export interface JSFile {
//     rebuildNamespace(): void;
//
//     addToTop(toAdd: Directive | Statement | ModuleDeclaration): void;
//
//     addToBottom(toAdd: Directive | Statement | ModuleDeclaration): void;
//
//     setAsModule(): void;
//
//     getAST(): Program;
//
//     getSheBang(): string;
//
//     registerReplace(replace: string, value: string): void;
//
//     namespaceContains(identifier: string): boolean;
//
//     getNamespace(): Namespace;
//
//     getImportManager(): ImportManager;
//
//     getExportBuilder(): ExportBuilder;
// }
//
// export function create(){
//
// }
class JSFile extends Abstractions_1.AbstractDataFile {
    constructor(path, b, parent, isModule) {
        super(path, b, parent);
        this.isStrict = false; //TODO might be unnnecssary--find purposes
        this.toAddToTop = [];
        this.toAddToBottom = [];
        this.stringReplace = {};
        this.replacer = (s) => s;
        this.moduleType = isModule ? "module" : "script"; //TODO delete or find purpose
        this.ast = this.parseProgram(this.data, isModule);
        this.r_tracker = new RequireTracker_1.RequireTracker();
        this.removeStrict();
        this.namespace = Namespace_1.Namespace.create(this.ast);
    }
    getRequireTracker() {
        return this.r_tracker;
    }
    spawnCJS(moduleID) {
        let parent = this.parent();
        let parentDir = parent.getAbsolute();
        let base = path_1.basename(moduleID, ".json");
        let cjsName = `${base}.cjs`;
        if (fs_1.existsSync(path_1.join(parentDir, cjsName))) {
            let i = 0;
            let cjsName = `${base}_${i}.cjs`;
            while (fs_1.existsSync(path_1.join(parentDir, cjsName))) {
                cjsName = `${base}_${i}.cjs`;
                i++;
            }
        }
        let json = path_1.join(this.path_abs, moduleID);
        let relativeToRoot = path_1.relative(this.parent().getRootDirPath(), json);
        let dirRelativeToRoot = path_1.dirname(relativeToRoot);
        let builder = {
            cjsFileName: `${dirRelativeToRoot}/${path_1.basename(json)}.cjs`,
            jsonFileName: path_1.relative(this.parent().getRootDirPath(), json),
            dataAsString: `module.exports = require('./${path_1.basename(moduleID)}');`,
            dir: parent
        };
        let spawn = this.parent().spawnCJS(builder);
        return path_1.join(path_1.dirname(moduleID), path_1.basename(spawn));
    }
    removeStrict() {
        this.isStrict = this.ast.body.length !== 0
            && (this.ast.body[0]['directive'] === "use strict");
        if (this.isStrict) {
            this.ast.body.splice(0, 1);
        }
    }
    addToTop(toAdd) {
        this.toAddToTop.push(toAdd);
    }
    addToBottom(toAdd) {
        this.toAddToTop.push(toAdd);
    }
    setAsModule() {
        this.moduleType = "module";
    }
    getAST() {
        return this.ast;
    }
    getSheBang() {
        return this.shebang;
    }
    registerReplace(replace, value) {
        // this.stringReplace.set(replace, value);
        this.stringReplace[replace] = value;
    }
    buildProgram() {
        let addToTop = [];
        this.toAddToTop.forEach(e => addToTop.push(e));
        let addToBottom = [];
        this.toAddToBottom.forEach(e => addToBottom.push(e));
        let newAST = this.ast;
        let body = newAST.body;
        newAST.sourceType = this.moduleType;
        addToTop.reverse().forEach((e) => {
            body.splice(0, 0, e);
        });
        addToBottom.reverse().forEach((e) => {
            body.push(e);
        });
        if (this.moduleType === "module") {
            this.makeExportsArray(newAST.body);
        }
        this.getImportManager().buildDeclList().forEach(e => {
            newAST.body.splice(0, 0, e);
        });
        //MUST BE LAST
        if (this.isStrict && this.ast.sourceType !== "module") {
            this.ast.body.splice(0, 0, JSFile.useStrict);
        }
        return newAST;
    }
    makeExportsArray(body) {
        let exports = this.exports.build();
        if (exports.named_exports && exports.named_exports.specifiers.length > 0) {
            body.push(exports.named_exports);
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
                    body.push(exports.default_exports);
                    break;
            }
        }
    }
    parseProgram(program, isModule) {
        if (shebang_regex_1.default.test(this.data)) {
            this.shebang = shebang_regex_1.default.exec(this.data)[0].toString();
            program = program.replace(this.shebang, '');
        }
        else {
            this.shebang = '';
        }
        try {
            return (isModule ? esprima_1.parseModule : esprima_1.parseScript)(program);
        }
        catch (e) {
            throw new Error(`Esprima Parse ERROR in file ${this.path_abs} on line ${e.lineNumber}:${e.index} with description ${e.description}\n`);
        }
    }
    /**
     * returns true if identifier is in the namespace.
     */
    namespaceContains(identifier) {
        return this.namespace.containsName(identifier);
    }
    /**
     * gets the current object representing the namespace for the ast.
     */
    getNamespace() {
        return this.namespace;
    }
    /**
     * gets the JSFiles ImportManager.
     */
    getImportManager() {
        if (!this.imports) {
            this.imports = new ImportManager_1.ImportManager();
        }
        return this.imports;
    }
    getExportBuilder() {
        if (!this.exports) {
            this.exports = new ExportsBuilder_1.ExportBuilder();
        }
        return this.exports;
    }
    makeSerializable() {
        let program;
        try {
            program = escodegen_1.generate(this.buildProgram());
            for (let key in this.stringReplace) {
                let value = this.stringReplace[key];
                console.log(`replacing ${key} with ${value}`);
                program = program.replace(key, value);
            }
            // .forEach((k: string, v: string) => {
            //todo import.meta....
            // });
            this.shebang = this.shebang ? this.shebang + '\n' : this.shebang;
            program = `${this.shebang}\n${program}\n`;
        }
        catch (e) {
            console.log(`in file ${this.path_relative} with exception: ${e}`);
        }
        return {
            relativePath: this.path_relative,
            fileData: program
        };
    }
}
exports.JSFile = JSFile;
JSFile.useStrict = {
    "type": "ExpressionStatement",
    "expression": {
        "type": "Literal",
        "value": "use strict",
        "raw": "\"use strict\""
    },
    "directive": "use strict"
};
class NS2 {
    constructor(ast, starting_names = [], old = null) {
        this.names = {};
        if (starting_names) {
            starting_names.forEach(e => this.names[e] = true);
        }
        if (old) {
            for (let key in old.names) {
                this.names[key] = true;
            }
        }
        estraverse_1.traverse(ast, { enter: (node, parent) => {
                switch (node.type) {
                    case "VariableDeclarator":
                        switch (node.id.type) {
                            case "ObjectPattern":
                                break;
                            case "ArrayPattern":
                                break;
                            case "AssignmentPattern":
                                node.id.left;
                                break;
                        }
                        break;
                    case "AssignmentExpression":
                        switch (node.left.type) {
                            case "ObjectPattern":
                                node.left.properties.forEach(e => { });
                                break;
                            case "ArrayPattern":
                                break;
                        }
                        //w/ pattern
                        break;
                    case "FunctionExpression":
                        node.id.name;
                        break;
                    case "FunctionDeclaration":
                        node.id.name;
                        break;
                    case "ClassExpression":
                        node.id.name;
                        break;
                    case "ClassDeclaration":
                        node.id.name;
                        break;
                    case "Identifier":
                        node.name;
                        break;
                }
            } });
    }
}
