Object.defineProperty(exports, "__esModule", { value: true });
function importTransforms(transformer) {
    transformer.transform(function (js) {
        if (js.namespaceContains('process')
            && !js.getImportManager().importsThis('process', 'process')) {
            js.getImportManager().createDefault('process', 'process');
        }
    });
}
exports.importTransforms = importTransforms;
