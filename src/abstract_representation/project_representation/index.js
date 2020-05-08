function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./project/FileProcessing"));
__export(require("./project/TransformableProject"));
__export(require("./javascript/JSFile"));
__export(require("./javascript/JSONFile"));
__export(require("./project/FilesTypes"));
