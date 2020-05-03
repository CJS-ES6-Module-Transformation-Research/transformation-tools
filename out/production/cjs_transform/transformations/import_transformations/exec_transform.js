Object.defineProperty(exports, "__esModule", { value: true });
function dirnamne(js) {
    js.rebuildNamespace();
    if (js.namespaceContains('__dirname')) {
        var importsMan = js.getImportManager();
        // importsMan.importsThis('')
        // js.importsModule('path');
        // js.importsModule('url');
    }
}
