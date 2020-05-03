export {TransformableProject} from './abstract_representation/project_representation/project/TransformableProject'
export {projectReader, script_or_module} from './abstract_representation/project_representation/project/FileProcessing'
export {
    accessReplace, flattenDecls, requireStringSanitizer, collectDefaultObjectAssignments
} from './transformations/sanitizing/visitors'
export * from './abstract_representation/project_representation'