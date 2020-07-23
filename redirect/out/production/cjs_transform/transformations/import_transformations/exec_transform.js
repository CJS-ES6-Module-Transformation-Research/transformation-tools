Object.defineProperty(exports, "__esModule", { value: true });
exports.importTransforms = void 0;
const import_replacement_1 = require("./visitors/import_replacement");
const __dirname_1 = require("./visitors/__dirname");
function importTransforms(projectManager) {
    projectManager.forEachSource(import_replacement_1.transformImport);
    projectManager.forEachSource(__dirname_1.dirname);
}
exports.importTransforms = importTransforms;
