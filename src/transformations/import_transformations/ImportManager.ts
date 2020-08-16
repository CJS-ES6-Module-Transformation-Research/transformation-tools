// import {ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier} from 'estree'
// import {ModuleAPIMap} from "../../abstract_fs_v2/Factory";
// import {JSFile} from "../../abstract_fs_v2/JSv2";
// import {API, API_TYPE} from "../export_transformations/API";
// // import {API_TYPE} from "../export_transformations/ExportsBuilder";
//
//
// interface ImportRepresentation {
// 	named: namedAliasMap
// 	hasDefault: boolean
// 	defaultIdentifiers: Set<string>
// 	importString: string
// 	isSideEff: boolean
// }
//
// interface importStringMap {
// 	[importString: string]: ImportRepresentation
// }
//
// interface namedAliasMap {
// 	[non_local_name: string]: string
// }
//
// interface ImportManagerI {
// 	// create: (importString: string, value: string, _default: boolean) => void
// 	importsThis: (importString: string, value: string) => boolean
// 	buildDeclList: () => ImportDeclaration[]
// }
//  export function createADefault(importString: string, defaultedName: string, isNamespace ): ImportDeclaration {
// 	let specifier: ImportDefaultSpecifier | ImportNamespaceSpecifier = {
// 		local: {
// 			name: defaultedName, type: "Identifier"
// 		},
// 		type: isNamespace ? "ImportNamespaceSpecifier" : "ImportDefaultSpecifier"
// 	}
// 	return {
// 		specifiers: [specifier],
// 		source: {
// 			type: "Literal",
// 			value: importString
// 		}, type: "ImportDeclaration"
// 	}
//
// }
//
// function createAnExport(importString: string, aliasMap: namedAliasMap): ImportDeclaration {
// 	let specifiers: (ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier)[] = [];
// 	for (let name in aliasMap) {
//
// 		let alias = aliasMap[name];
// 		specifiers.push(createASpecifier(alias, name))
// 	}
//
//
// 	function createASpecifier(local: string, imported: string): ImportSpecifier {
// 		return {
// 			type: "ImportSpecifier", local:
// 				{
// 					name: local, type: "Identifier"
// 				},
// 			imported: {
// 				name: imported, type: "Identifier"
// 			}
// 		}
// 	}
//
// 	return {
// 		type: "ImportDeclaration",
// 		source: {
// 			type: "Literal",
// 			value: importString
// 		},
// 		specifiers: specifiers
//
// 	}
// }
//
// export function createASideEffect(importString: string): ImportDeclaration {
// 	return {
// 		"type": "ImportDeclaration",
// 		"specifiers": [],
// 		"source": {
// 			"type": "Literal",
// 			"value": `${importString}`,
// 		}
// 	};
//
// }
//
// export class ImportManager implements ImportManagerI {
// 	private readonly IMPORT_MODE:"defaults"|"names"//TODO REMOVE
// 	private orderedImports: string[] = [] ;
// 	private readonly importMap: importStringMap
// 	private readonly js: JSFile
// 	private readonly moduleAPIMap: (spec:string)=>API
// 	private readonly apiMap: ModuleAPIMap;
//
// 	constructor(apiMap: ModuleAPIMap, getApi: (e: string) => API,js:JSFile, importMode:"defaults"|"names"="defaults") {
// 		this.importMap = {};
// 		this.orderedImports = [];
// 		this.moduleAPIMap = getApi;
// 		this.apiMap = apiMap
// 		this.js = js;
// 		this.IMPORT_MODE = importMode
// 	}
//
// 	// private getModuleAPI(specifier: string) {
// 	// 	if (this.isLocalSpecifier(specifier)||this.isBuiltInModule(specifier)) {
// 	// 		return this.js.getAPI(specifier)
// 	// 		//(specifier)
// 	// 	} else {
// 	// 		return null;
// 	// 	}
// 	// }
//
//
// 	public isLocalSpecifier(specifier: string) {
// 		return specifier.startsWith('.') || specifier.startsWith('/');
// 	}
//
// 	public isBuiltInModule(specifier: string) {
// 		return built_ins.includes(specifier)
// 	}
//
//
// 	createDefault(importString: string, value: string) {
//
// 		if (this.importMap[importString] === undefined) {
// 			this.orderedImports.push(importString);
// 			this.importMap[importString] = {
// 				named: {},
// 				hasDefault: false,
// 				defaultIdentifiers: new Set<string>(),
// 				importString: importString,
// 				isSideEff: false
// 			};
// 		}
//
// 		this.importMap[importString].hasDefault = true;
// 		this.importMap[importString].defaultIdentifiers.add(value);
//
// 	}
//
// 	createNamedWithAlias(importString: string, name: string, alias: string = name) {
//
// 		if (this.importMap[importString] === undefined) {
// 			this.orderedImports.push(importString);
// 			this.importMap[importString] = {
// 				named: {},
// 				hasDefault: false,
// 				defaultIdentifiers: new Set<string>(),
// 				importString: importString,
// 				isSideEff: false
// 			};
// 		}
//
// 		let curr: ImportRepresentation = this.importMap[importString]
// 			? this.importMap[importString] : {
// 				named: {},
// 				hasDefault: false,
// 				defaultIdentifiers: new Set<string>(),
// 				importString: importString,
// 				isSideEff: false
// 			};
//
// 		this.importMap[importString] = curr
// 		curr.named[name] = alias;
// 	}
//
// 	createSideEffect(importString: string) {
// 		if (this.importMap[importString] === undefined) {
// 			this.orderedImports.push(importString);
// 		}
//
// 		let curr: ImportRepresentation = this.importMap[importString]
// 			? this.importMap[importString] : {
// 				named: {},
// 				hasDefault: false,
// 				defaultIdentifiers: new Set<string>(),
// 				importString: importString,
// 				isSideEff: true
// 			};
// 		curr.isSideEff = true; // in case laready exists
//
// 		this.importMap[importString] = curr
//
// 	}
//
//
// 	buildDeclList(): ImportDeclaration[] {
// 		let decls: ImportDeclaration[] = [];
//
// 		this.orderedImports.forEach(imp => {
// 			let value = this.importMap [imp];
// 			let tmp: ImportDeclaration[] = [];
// 			if (value.hasDefault) {
// 				let isNamespace
//
// 				if(this.isBuiltInModule(value.importString)){
// 					isNamespace = !builtins_funcs.includes(value.importString);
// 					this.apiMap.apiKey["apiKey"] = new API(API_TYPE.named_only,[], true)
// 				}else if(this.isLocalSpecifier(value.importString)){
// 					isNamespace = true;
// 				}
//
//
// 				let api  =this.moduleAPIMap(imp)//this.js.getA PI(imp)
//
// 			if (!built_ins.includes(value.importString)){
// 				try {
// 					let api_type
// 						try {
// 							api_type = api.getType()
// 						}catch (e) {
// 							// console.log(`could not get api type for ${api}`)
// 							// console.log(`this:${this.js.getRelative()} requested from ${imp}`)
// 						}
// 					if (api_type === API_TYPE.default_only) {
// 						isNamespace = false;
// 					}
// 				}catch(err){
// 					console.log(imp)
// 					console.log(value.importString)
// 					throw err;
// 				}
// 			}
//
// 				value.defaultIdentifiers.forEach(name => {
// 					tmp.push(createADefault(value.importString, name, isNamespace )
// 					)
// 				});
// 			}
// 			tmp.reverse().forEach(e => decls.push(e))
// 			tmp = []
// 			if (Object.keys(value.named).length > 0) {
// 				tmp.push(createAnExport(value.importString, value.named))
// 			}
// 			tmp.reverse().forEach(e => decls.push(e))
//
// 			if (value.isSideEff) {
// 				decls.push(createASideEffect(value.importString))
// 			}
//
// 		})
//
// 		return decls;
// 	}
//
//
// 	importsThis(importString: string, value: string): boolean {
// 		let importsMap = this.importMap[importString]
// 		if (importsMap === undefined) {
// 			return false;
// 		}
// 		if (importsMap.hasDefault) {
// 			return importsMap.defaultIdentifiers[value] !== undefined
// 		}
// 		return importsMap.named[value] !== undefined
//
// 	}
//
// 	importsDefaultFromModule(importString: string): boolean {
// 		let importsMap = this.importMap[importString]
// 		if (importsMap === undefined) {
// 			return false;
// 		} else {
// 			return importsMap.hasDefault
// 		}
// 	}
//
//
// }
// // export const builtins_funcs = [
// // 	'_stream_duplex_',
// // '_stream_passthrough_',
// // '_stream_readable',
// // '_stream_transform_',
// // '_stream_wrap_',
// // '_stream_writable_',
// // 'assert',
// // 'events',
// // 'module',
// // 'stream']
// //
// // export const built_ins = [
// // 	"_http_agent",
// // 	"_http_client",
// // 	"_http_common",
// // 	"_http_incoming",
// // 	"_http_outgoing",
// // 	"_http_server",
// // 	"_stream_duplex",
// // 	"_stream_passthrough",
// // 	"_stream_readable",
// // 	"_stream_transform",
// // 	"_stream_wrap",
// // 	"_stream_writable",
// // 	"_tls_common",
// // 	"_tls_wrap",
// // 	"assert",
// // 	"async_hooks",
// // 	"buffer",
// // 	"child_process",
// // 	"cluster",
// // 	"console",
// // 	"constants",
// // 	"crypto",
// // 	"dgram",
// // 	"dns",
// // 	"domain",
// // 	"events",
// // 	"fs",
// // 	"fs/promises",
// // 	"http",
// // 	"http2",
// // 	"https",
// // 	"inspector",
// // 	"module",
// // 	"net",
// // 	"os",
// // 	"path",
// // 	"perf_hooks",
// // 	"process",
// // 	"punycode",
// // 	"querystring",
// // 	"readline",
// // 	"repl",
// // 	"stream",
// // 	"string_decoder",
// // 	"sys",
// // 	"timers",
// // 	"tls",
// // 	"trace_events",
// // 	"tty",
// // 	"url",
// // 	"util",
// // 	"v8",
// // 	"vm",
// // 	"worker_threads",
// // 	"zlib"
// // ]
// //
//
