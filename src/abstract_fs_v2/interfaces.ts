import {
	BaseCallExpression,
	ExpressionStatement,
	Identifier,
	Literal,
	VariableDeclaration,
	VariableDeclarator
} from "estree";
import {Stats} from "fs";
import {AbstractFile} from "./Abstractions";
import {Dir} from "./Dirv2";
import {ModuleAPIMap} from "./Factory";
import {JSFile} from "./JSv2";


export interface SerializedJSData {
	relativePath: string
	fileData: string
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

export interface Visitable {
	visit: (visitor: FileVisitor) => void
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

export type script_or_module = "script" | "module"

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
	uses_names:boolean
}

export interface RequireDeclaration extends VariableDeclaration {
	declarations: [RequireDeclarator];
}

export interface RequireDeclarator extends VariableDeclarator {
	id: Identifier;
	init: RequireCall;
}

export interface RequireExpression extends ExpressionStatement {
	type: "ExpressionStatement"
	expression: RequireCall
}

export interface RequireCall extends BaseCallExpression {
	type: "CallExpression"
	callee: RequireID
	arguments: [Literal]
	// callee:Identifier
	// arguments:
}

interface RequireID extends Identifier {
	name: "require"
}

export const requireID: RequireID = {type: "Identifier", name: 'require'}

export type TransformFunction = (js: JSFile) => void

export function id(name: string): Identifier {
	return {type: "Identifier", name: name}
}

export function createRequireDec(imported_id: string, specifier: string): RequireDeclaration {
	// let decl: RequireDeclarator =
	// b
	// }
	return {
		type: "VariableDeclaration",
		kind: "var",
		declarations: [{
			type: "VariableDeclarator",
			id: id(imported_id),
			init: {
				type: "CallExpression",
				callee: requireID,
				arguments: [{type: 'Literal', value: `${specifier}`}]
			}
		}]
	}
}