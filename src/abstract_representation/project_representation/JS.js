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
var FilesTypes_1 = require("./FilesTypes");
var estraverse_1 = require("estraverse");
var exportsTools_1 = require("../es_tree_stuff/exportsTools");
var JSFile = /** @class */ (function (_super) {
    __extends(JSFile, _super);
    function JSFile(dir, rel, file, readType) {
        var _this = _super.call(this, dir, rel, file, 0) || this;
        _this.built = false;
        _this.replacer = function (s) { return s; };
        _this.imports = [];
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
        _this.namespace = new Set();
        _this.rebuildNamespace();
        return _this;
    }
    JSFile.prototype.rebuildNamespace = function () {
        estraverse_1.traverse(this.ast, populateNamespace(this.namespace));
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
    JSFile.prototype.registerReplace = function (replacer) {
        var _this = this;
        this.replacer = function (s) { return replacer(_this.replacer(s)); };
    };
    JSFile.prototype.makeStringWithReplace = function (replacer) {
        return this.replacer(replacer(escodegen_1.generate(this.ast)));
    };
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
            this.imports.forEach(function (e) {
                body.splice(0, 0, e);
            });
        }
        if (this.exports) {
            this.exports.buildAll().forEach(function (e) {
                // body.push(e)
            });
        }
    };
    JSFile.prototype.makeString = function () {
        this.build();
        try {
            var program = this.replacer ? this.replacer(escodegen_1.generate(this.ast)) : escodegen_1.generate(this.ast);
            if (this.shebang) {
                return this.shebang + "\n" + program + "\n";
            }
            else {
                return program + "\n";
            }
        }
        catch (e) {
            console.log("in file " + this.relative + " with exception: " + e);
        }
    };
    JSFile.prototype.isSource = function () {
        return true;
    };
    JSFile.prototype.namespaceContains = function (identifier) {
        return this.namespace.has(identifier);
    };
    JSFile.prototype.setExports = function (exports) {
        this.exports = exports;
    };
    JSFile.prototype.addAnImport = function (e) {
        this.imports.push(e);
    };
    return JSFile;
}(FilesTypes_1.ReadableFile));
exports.JSFile = JSFile;
function populateNamespace(namespace) {
    return {
        enter: function (node, parent) {
            switch (node.type) {
                case "VariableDeclarator": {
                    exportsTools_1.walkPatternToIdentifier(node.id, namespace);
                    break;
                }
                case "AssignmentExpression": {
                    exportsTools_1.walkPatternToIdentifier(node.left, namespace);
                    break;
                }
                case "FunctionDeclaration": {
                    node.params.forEach(function (e) { return exportsTools_1.walkPatternToIdentifier(e, namespace); });
                    break;
                }
                case "ClassDeclaration": {
                    namespace.add(node.id.name);
                    break;
                }
            }
        }
    };
}
