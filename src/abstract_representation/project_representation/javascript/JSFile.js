var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var esprima_1 = require("esprima");
var shebang_regex_1 = __importDefault(require("shebang-regex"));
var escodegen_1 = require("escodegen");
var FilesTypes_1 = require("../project/FilesTypes");
var Namespace_1 = require("./Namespace");
var ImportManager_1 = require("../../../transformations/import_transformations/ImportManager");
/**
 * Project representation of a javascript file. This object contains the file's text, AST in MDN/esprima/estree format,
 * as well as tools related to generating new and replacing old data.
 */
var JSFile = /** @class */ (function (_super) {
    __extends(JSFile, _super);
    function JSFile(dir, rel, file, readType) {
        if (readType === void 0) { readType = 'script'; }
        var _this = _super.call(this, dir, rel, file, 0) || this;
        _this.built = false;
        _this.stringReplace = new Map();
        _this.replacer = function (s) { return s; };
        _this.imports = new ImportManager_1.ImportManager();
        _this.shebang = '';
        _this.toAddToTop = [];
        _this.toAddToBottom = [];
        var program = _this.text;
        if (shebang_regex_1.default.test(_this.text)) {
            _this.shebang = shebang_regex_1.default.exec(_this.text)[0].toString();
            program = program.replace(_this.shebang, '');
        }
        try {
            if (readType === 'script') {
                _this.ast = esprima_1.parseScript(program);
            }
            else {
                _this.ast = esprima_1.parseModule(program);
            }
        }
        catch (e) {
            console.log(rel + " has error:  " + e + " with text: \n " + _this.text);
        }
        _this.rebuildNamespace();
        return _this;
    }
    JSFile.prototype.rebuildNamespace = function () {
        this.namespace = Namespace_1.Namespace.create(this.ast);
    };
    JSFile.prototype.addToTop = function (toAdd) {
        this.toAddToTop.push(toAdd);
    };
    JSFile.prototype.addToBottom = function (toAdd) {
        this.toAddToTop.push(toAdd);
    };
    JSFile.prototype.getAST = function () {
        return this.ast;
    };
    JSFile.prototype.getSheBang = function () {
        return this.shebang;
    };
    JSFile.prototype.accept = function (visitor) {
        return visitor(this.ast);
    };
    JSFile.prototype.registerReplace = function (replace, value) {
        this.stringReplace.set(replace, value);
    };
    /**
     * builds the AST for generating a string. can only be done ONCE.
     */
    JSFile.prototype.build = function () {
        this.toAddToTop = [];
        this.toAddToBottom = [];
        if (this.built) {
            return;
        }
        var body = this.ast.body;
        this.ast.sourceType = "module";
        this.toAddToTop.forEach(function (e) {
            body.splice(0, 0, e);
        });
        this.toAddToBottom.forEach(function (e) {
            body.push(e);
        });
        if (this.imports) {
            this.imports.buildDeclList().forEach(function (e) {
                body.splice(0, 0, e);
            });
        }
        if (this.exports) {
            this.exports.buildAll().forEach(function (e) {
                // body.push(e)
            });
        }
    };
    /**
     * generates a string from the built AST.
     */
    JSFile.prototype.makeString = function () {
        this.build();
        try {
            var program_1 = escodegen_1.generate(this.ast);
            this.stringReplace.forEach(function (k, v) {
                program_1 = program_1.replace(k, v);
            });
            this.shebang = this.shebang ? this.shebang + '\n' : this.shebang;
            return this.shebang + "\n" + program_1 + "\n";
        }
        catch (e) {
            console.log("in file " + this.relative + " with exception: " + e);
        }
    };
    /**
     * returns true if this is source code (always).
     */
    JSFile.prototype.isSource = function () {
        return true;
    };
    /**
     * returns true if identifier is in the namespace.
     */
    JSFile.prototype.namespaceContains = function (identifier) {
        return this.namespace.containsName(identifier);
    };
    /**
     * gets the current object representing the namespace for the ast.
     */
    JSFile.prototype.getNamespace = function () {
        this.rebuildNamespace();
        return this.namespace;
    };
    JSFile.prototype.setExports = function (exports) {
        this.exports = exports;
    };
    /**
     * gets the JSFiles ImportManager.
     */
    JSFile.prototype.getImportManager = function () {
        return this.imports;
    };
    return JSFile;
}(FilesTypes_1.ReadableFile));
exports.JSFile = JSFile;
