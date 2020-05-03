import {JSFile} from "../../abstract_representation/project_representation";

function dirnamne(js:JSFile) {
    js.rebuildNamespace();
    if (js.namespaceContains('__dirname')){
        let importsMan = js.getImportManager()
        // importsMan.importsThis('')
        // js.importsModule('path');
        // js.importsModule('url');

    }
}