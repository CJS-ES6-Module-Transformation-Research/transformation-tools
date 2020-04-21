Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var escodegen_1 = require("escodegen");
var index_1 = require("../../index");
function replaceJS(asts, files, source, target) {
    if (target === void 0) { target = ''; }
    console.log("Starting WRITE Operations");
    var inPlace = false;
    if (!target) {
        inPlace = true;
        console.log("STARTING RENAME  Operations");
        renameOld(asts, source);
    }
    console.log("Finished RENAME Operations");
    writeModdedJS(asts, inPlace ? source : target); //always
    console.log("Finished WRITE JS Operations");
    if (!inPlace) {
        copyRebuildDirs(inPlace, target); //if copy
        console.log("Finished Directory Modifications Operations");
    }
    function renameOld(asts, source) {
        var inPlaceSuffix = '.old';
        asts.forEach(function (e) {
            var prefix = source + "/" + e.filePath;
            fs_1.renameSync(prefix, "" + prefix + inPlaceSuffix);
        });
    }
    function writeModdedJS(asts, target) {
        console.log('writing to' + target);
        asts.forEach(function (e) {
            console.log('writing to' + e.dir + '/' + e.filePath);
            var prefix = target ? target + "/" : '';
            console.log('trying to write out ' + e.filePath);
            var shebangStr = e.shebang ? e.shebang + "\n" : '';
            try {
                console.log("writing to: " + (prefix + e.filePath));
                fs_1.writeFileSync(prefix + e.filePath, shebangStr + escodegen_1.generate(e.ast)
                    .replace('import_meta_url', 'import.meta.url'));
            }
            catch (er) {
                console.log(er);
                console.log(prefix + e.dir + '/' + e.filePath);
            }
        });
    }
    function copyRebuildDirs(inPlace, target) {
        if (!inPlace) {
            files.filter(function (e) { return e.ftype !== index_1.FILE_TYPE.JS; })
                .forEach(function (e) {
                fs_1.copyFileSync(e.full, target + "/" + e.relative);
            });
        }
    }
}
exports.replaceJS = replaceJS;
var AstSerializer = /** @class */ (function () {
    function AstSerializer(project, source, target) {
        if (target === void 0) { target = source; }
        this.source = source;
        this.target = target;
        this.proj = project;
        this.inPlace = source === target;
        this.astsFiles = project.asts;
    }
    AstSerializer.prototype.writeOut = function () {
        if (this.inPlace) {
            this.renameOld();
        }
        this.writeModdedJS(); //always
        if (!this.inPlace) {
            this.copyRebuildDirs(); //if copy
        }
    };
    AstSerializer.prototype.writeModdedJS = function () {
        var _this = this;
        this.astsFiles.forEach(function (e) {
            console.log('trying to write out ' + e.filePath);
            var shebangStr = e.shebang ? e.shebang + "\n" : '';
            fs_1.writeFileSync(_this.target + "/" + e.filePath, shebangStr + escodegen_1.generate(e.ast));
        });
    };
    AstSerializer.prototype.renameOld = function () {
        var _this = this;
        var inPlaceSuffix = '.old';
        this.astsFiles.forEach(function (e) {
            var prefix = _this.source + "/" + e.filePath;
            fs_1.renameSync(prefix, "" + prefix + inPlaceSuffix);
        });
    };
    AstSerializer.prototype.copyRebuildDirs = function () {
        var _this = this;
        if (!this.inPlace) {
            this.proj.project.files.filter(function (e) { return e.ftype !== index_1.FILE_TYPE.JS; })
                .forEach(function (e) {
                fs_1.copyFileSync(e.full, _this.target + "/" + e.relative);
            });
        }
    };
    AstSerializer.prototype.getPrefixPath = function (astFile) {
        return (this.target ? this.target : this.source) + "/" + astFile.filePath;
    };
    return AstSerializer;
}());
