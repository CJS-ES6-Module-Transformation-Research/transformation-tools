Object.defineProperty(exports, "__esModule", { value: true });
// export {TransformableProject} from './abstract_representation/project_representation/project/TransformableProject'
// export {projectReader, script_or_module} from './abstract_representation/project_representation/project/FileProcessing'
var visitors_1 = require("./transformations/sanitizing/visitors");
Object.defineProperty(exports, "accessReplace", { enumerable: true, get: function () { return visitors_1.accessReplace; } });
Object.defineProperty(exports, "flattenDecls", { enumerable: true, get: function () { return visitors_1.flattenDecls; } });
Object.defineProperty(exports, "requireStringSanitizer", { enumerable: true, get: function () { return visitors_1.requireStringSanitizer; } });
Object.defineProperty(exports, "collectDefaultObjectAssignments", { enumerable: true, get: function () { return visitors_1.collectDefaultObjectAssignments; } });
Object.defineProperty(exports, "jsonRequire", { enumerable: true, get: function () { return visitors_1.jsonRequire; } });
// export * from './abst ract_representation/project_representation'
