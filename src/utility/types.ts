import {AssignmentExpression, ExpressionStatement, Identifier, MemberExpression} from "estree";
import {Stats} from "fs";
import {Dir,ModuleAPIMap,JSFile,AbstractFile} from "../filesystem";

export interface SeqNumb{
	seq_no: number
	 next():string
 }

export interface SerializedJSData {
	relativePath: string
	fileData: string
}





export interface ShadowVariableMap {
	[id: string]: string[]
}





export interface SeqNumb{
 seq_no: number
	next():string
}
export type FileVisitor = (visit: AbstractFile) => void

export enum FileType {
	OTHER = "OTHER",
	json = "json",
	package = "package",
	cjs = "cjs",
	dir = "dir",
	js = "js"
}

export interface CJSBuilderData {
	dir: Dir
	dataAsString: string
	jsonFileName: string
	cjsFileName: string
}

export interface DirSupplier {
	(): Dir,

	pName: string
}

export type write_status = "copy" | "in-place"

export interface MetaData {
	moduleAPIMap: ModuleAPIMap
	rootDir: string
	ext: string
	stat: Stats | null
	type: FileType
	isRoot: boolean
	path_abs: string
	path_relative: string
	target_dir: string
	uses_names: boolean
	test?: boolean
}

export type TransformFunction = (js: JSFile) => void


export interface ModuleDotExports extends DotExpr {
	object: Identifier
	property:Identifier
}

export interface DotExpr extends MemberExpression {
	computed: false
}

export enum ExportType {
	NAME_SHORTCUT = 'NAME_SHORTCUT',
	NAMED = 'NAMED',
	DEFAULT = 'DEFAULT'

}

export type EXPORT_INFO = { hasDefault: boolean, hasNamed: boolean, exportNames: { [p: string]: string } }


export interface ExportAssignmentStatement extends ExpressionStatement {
	expression: ExportAssignment
}

export interface ExportAssignment extends AssignmentExpression {
	operator: '=',
	left: LHSExport,
	right: Identifier

}

export interface LHSExport extends MemberExpression {
	object: ModuleDotExports | Identifier
	property: Identifier
	computed: false
}

export interface ReqPropInfo {
	forceDefault: boolean;
	allAccessedProps: string[];
	refTypeProps: string[];
	potentialPrimProps: string[];
}

export interface ForcedDefaultMap {
	[id: string]: boolean
}