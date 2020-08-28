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
	uses_names:boolean
	test?:boolean
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
}

interface RequireID extends Identifier {
	name: "require"
}

export type TransformFunction = (js: JSFile) => void

export function id(name: string): Identifier {
	return {type: "Identifier", name: name}
}


export const builtins_funcs = [
	'_stream_duplex_',
	'_stream_passthrough_',
	'_stream_readable',
	'_stream_transform_',
	'_stream_wrap_',
	'_stream_writable_',
	'assert',
	'events',
	'module',
	'stream']

export const built_ins = [
	"_http_agent",
	"_http_client",
	"_http_common",
	"_http_incoming",
	"_http_outgoing",
	"_http_server",
	"_stream_duplex",
	"_stream_passthrough",
	"_stream_readable",
	"_stream_transform",
	"_stream_wrap",
	"_stream_writable",
	"_tls_common",
	"_tls_wrap",
	"assert",
	"async_hooks",
	"buffer",
	"child_process",
	"cluster",
	"console",
	"constants",
	"crypto",
	"dgram",
	"dns",
	"domain",
	"events",
	"fs",
	"fs/promises",
	"http",
	"http2",
	"https",
	"inspector",
	"module",
	"net",
	"os",
	"path",
	"perf_hooks",
	"process",
	"punycode",
	"querystring",
	"readline",
	"repl",
	"stream",
	"string_decoder",
	"sys",
	"timers",
	"tls",
	"trace_events",
	"tty",
	"url",
	"util",
	"v8",
	"vm",
	"worker_threads",
	"zlib"
]

export function isExpr(val: string): boolean {
	switch (val) {
		case     "ThisExpression":
		case       "ArrayExpression":
		case       "ObjectExpression":
		case       "FunctionExpression":
		case    "ArrowFunctionExpression":
		case       "YieldExpression":
		case      "Literal":
		case       "UnaryExpression":
		case  "UpdateExpression":
		case       "BinaryExpression":
		case     "AssignmentExpression":
		case      "LogicalExpression":
		case          "MemberExpression":
		case            "ConditionalExpression":
		case       "CallExpression":
		case            "NewExpression":
		case            "SequenceExpression":
		case            "TemplateLiteral":
		case       "TaggedTemplateExpression":
		case           "ClassExpression":
		case           "MetaProperty":
		case            "Identifier":
		case     "AwaitExpression":
		case     "ImportExpression":
			return true;
		case "ObjectPattern":
		case "ArrayPattern":
		case "AssignmentPattern":
		case "RestElement":
			return false;
		default:
			throw new Error(` unreachable code. type is ${val}`);
	}
}

export function createRequireDecl(varStr: string, importStr: string, kindStr: "var" | "let" | "const"): RequireDeclaration {
	let varDecl: RequireDeclaration;
	varDecl = {
		type: "VariableDeclaration",
		declarations: [
			{
				type: "VariableDeclarator",
				id: {
					type: "Identifier",
					name: varStr
				}, init: {
					type: "CallExpression",
					callee: {
						type: "Identifier",
						name: "require"
					},
					arguments: [
						{
							type: "Literal",
							value: importStr
						}
					]
				},
			}
		],
		kind: kindStr
	};
	return varDecl;
}