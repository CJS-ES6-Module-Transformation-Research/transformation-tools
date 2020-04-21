export {TransformableProject} from './abstract_representation/project_representation/FS'
export {ProcessProject, script_or_module} from './abstract_representation/project_representation/FileProcessing'
export {
    accessReplace, flattenDecls, requireStringSanitizer, collectDefaultObjectAssignments
} from './transformations/sanitizing/visitors'
export * from './abstract_representation/project_representation'