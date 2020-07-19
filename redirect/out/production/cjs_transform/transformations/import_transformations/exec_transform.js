Object.defineProperty(exports, "__esModule", { value: true });
exports.importTransforms = void 0;
const import_replacement_1 = require("./visitors/import_replacement");
const __dirname_1 = require("./visitors/__dirname");
function importTransforms(transformer) {
    transformer.transform(import_replacement_1.transformImport);
    transformer.transform(__dirname_1.dirname);
}
exports.importTransforms = importTransforms;
