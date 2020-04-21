Object.defineProperty(exports, "__esModule", { value: true });
var estraverse_1 = require("estraverse");
var escodegen_1 = require("escodegen");
;
var ASTTransformer = /** @class */ (function () {
    function ASTTransformer(astFiles) {
        this.astFiles = astFiles;
    }
    ;
    ASTTransformer.prototype.currentPrograms = function () {
        var list = [];
        this.astFiles.forEach(function (e) {
            list.push({
                program: escodegen_1.generate(e.ast),
                name: e.filePath
            });
        });
        return list;
    };
    ;
    ASTTransformer.prototype.transformWithTypeReturn = function (lVisitor, mutator) {
        this.astFiles.forEach(function (astFile) {
            var data = mutator.supplier();
            var theVisitor = lVisitor(data);
            estraverse_1.traverse(astFile.ast, theVisitor);
            mutator.mutator(data, astFile.ast.body);
        });
        // this.transformWithVisitors(lVisitor(data))
    };
    ASTTransformer.prototype.transformWithListReturn = function (lVisitor) {
        var list = [];
        this.transformWithVisitors(lVisitor(list));
        return list;
    };
    ASTTransformer.prototype.transformWithVisitors = function (visitor) {
        this.astFiles.forEach(function (astFile) {
            estraverse_1.traverse(astFile.ast, visitor);
        });
    };
    ASTTransformer.prototype.transformWrapped = function (visitor) {
        this.astFiles.forEach(function (astFile) {
            var theVisitor = visitor(astFile);
            estraverse_1.traverse(astFile.ast, theVisitor);
        });
    };
    return ASTTransformer;
}());
exports.ASTTransformer = ASTTransformer;
