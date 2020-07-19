Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageJSON = exports.JSONFile = void 0;
const FilesTypes_1 = require("../project/FilesTypes");
/**
 * project representation of a JSON object file.
 * contains text as data string.
 */
class JSONFile extends FilesTypes_1.ReadableFile {
    constructor(dir, rel, file) {
        super(dir, rel, file, 1);
    }
    /**
     * is true, but is NOT source.
     */
    isData() {
        return true;
    }
    ;
    /**
     * creates an exportable version of itsself as an ES6 module.
     * //TODO implement
     */
    createJSExport() {
        throw new Error();
    }
    asJSON() {
        return JSON.parse(this.getText());
    }
}
exports.JSONFile = JSONFile;
/**
 * represents package.json. extends JSONFile to include setting default module type.
 */
class PackageJSON extends JSONFile {
    constructor(dir) {
        super(dir, `package.json`, `package.json`);
        try {
            this.json = JSON.parse(this.text);
        }
        catch (jsonParseError) {
            console.log(`json parse error semicolon: ${jsonParseError}\n in dir: ${dir}`);
        }
    }
    setModuleType(modType) {
        const setType = modType === 'module' ? 'module' : 'commonjs';
        console.log(`Setting module type of project: ${setType}`);
        this.json['type'] = setType;
    }
}
exports.PackageJSON = PackageJSON;
// export const setModuleType = function
