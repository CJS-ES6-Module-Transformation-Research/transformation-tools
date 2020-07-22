var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
var TransformableProject_1 = require("./abstract_representation/project_representation/project/TransformableProject");
Object.defineProperty(exports, "TransformableProject", { enumerable: true, get: function () { return TransformableProject_1.TransformableProject; } });
var FileProcessing_1 = require("./abstract_representation/project_representation/project/FileProcessing");
Object.defineProperty(exports, "projectReader", { enumerable: true, get: function () { return FileProcessing_1.projectReader; } });
Object.defineProperty(exports, "script_or_module", { enumerable: true, get: function () { return FileProcessing_1.script_or_module; } });
var visitors_1 = require("./transformations/sanitizing/visitors");
Object.defineProperty(exports, "accessReplace", { enumerable: true, get: function () { return visitors_1.accessReplace; } });
Object.defineProperty(exports, "flattenDecls", { enumerable: true, get: function () { return visitors_1.flattenDecls; } });
Object.defineProperty(exports, "requireStringSanitizer", { enumerable: true, get: function () { return visitors_1.requireStringSanitizer; } });
Object.defineProperty(exports, "collectDefaultObjectAssignments", { enumerable: true, get: function () { return visitors_1.collectDefaultObjectAssignments; } });
Object.defineProperty(exports, "jsonRequire", { enumerable: true, get: function () { return visitors_1.jsonRequire; } });
__exportStar(require("./abstract_representation/project_representation"), exports);
