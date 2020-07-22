Object.defineProperty(exports, "__esModule", { value: true });
exports.CJSToJSON = exports.PackageJSON = void 0;
const Abstractions_1 = require("./Abstractions");
class PackageJSON extends Abstractions_1.AbstractDataFile {
    constructor(path, b, parent) {
        super(path, b, parent);
        this.json = JSON.parse(this.data);
        if (this.json.main) {
            this.main = this.json.main;
        }
        if (this.json.bin) {
            this.bin = this.json.bin;
        }
        this.parent().setPackageJSON(this);
    }
    makeModule() {
        this.json.type = "module";
    }
    getMain() {
        return this.main;
    }
    makeSerializable() {
        return { fileData: JSON.stringify(this.json, null, 4), relativePath: this.getRelative() };
    }
}
exports.PackageJSON = PackageJSON;
class CJSToJSON extends Abstractions_1.AbstractDataFile {
    makeSerializable() {
        return {
            relativePath: this.path_relative,
            fileData: this.data
        };
    }
    /**
     * default constructor but enforces data not null.
     * @param path path to file
     * @param metadata metadata for file construction
     * @param parent reference to the parent object Dir
     * @param data the data string assigned to the AbstractDataFile's inherited field.
     */
    constructor(path, metadata, parent, data) {
        super(path, metadata, parent, data);
    }
}
exports.CJSToJSON = CJSToJSON;
