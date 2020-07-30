import {ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier} from 'estree'
import {JSFile} from "../../abstract_fs_v2/JSv2.js";


interface ImportRepresentation {
	named: namedAliasMap
	hasDefault: boolean
	defaultIdentifiers: Set<string>
	importString: string
	isSideEff: boolean
}

interface importStringMap {
	[importString: string]: ImportRepresentation
}

interface namedAliasMap {
	[non_local_name: string]: string
}

interface ImportManagerI {
	// create: (importString: string, value: string, _default: boolean) => void
	importsThis: (importString: string, value: string) => boolean
	buildDeclList: () => ImportDeclaration[]
}

export function createADefault(importString: string, defaultedName: string, isRelative): ImportDeclaration {
	let specifier: ImportDefaultSpecifier | ImportNamespaceSpecifier = {
		local: {
			name: defaultedName, type: "Identifier"
		},
		type: isRelative ? "ImportNamespaceSpecifier" : "ImportDefaultSpecifier"
	}
	return {
		specifiers: [specifier],
		source: {
			type: "Literal",
			value: importString
		}, type: "ImportDeclaration"
	}

}

function createAnExport(importString: string, aliasMap: namedAliasMap): ImportDeclaration {
	let specifiers: (ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier)[] = [];
	for (let name in aliasMap) {

		let alias = aliasMap[name];
		specifiers.push(createASpecifier(alias, name))
	}


	function createASpecifier(local: string, imported: string): ImportSpecifier {
		return {
			type: "ImportSpecifier", local:
				{
					name: local, type: "Identifier"
				},
			imported: {
				name: imported, type: "Identifier"
			}
		}
	}

	return {
		type: "ImportDeclaration",
		source: {
			type: "Literal",
			value: importString
		},
		specifiers: specifiers

	}
}

export function createASideEffect(importString: string): ImportDeclaration {
	return {
		"type": "ImportDeclaration",
		"specifiers": [],
		"source": {
			"type": "Literal",
			"value": `${importString}`,
		}
	};

}

export class ImportManager implements ImportManagerI {
	private orderedImports: string[];
	private readonly importMap: importStringMap
	private readonly js: JSFile

	constructor(js: JSFile) {
		this.importMap = {};
		this.orderedImports = [];
		this.js = js;
	}

	private getModuleAPI(specifier: string) {
		if (this.isLocalSpecifier(specifier)||this.isBuiltInModule(specifier)) {
			return this.js.getAPIFromRelativePath(specifier)
		} else {
			return null;
		}
	}


	public isLocalSpecifier(specifier: string) {
		return specifier.startsWith('.') || specifier.startsWith('/');
	}

	public isBuiltInModule(specifier: string) {
		return ImportManager.built_ins.includes(specifier)
	}


	createDefault(importString: string, value: string) {

		if (this.importMap[importString] === undefined) {
			this.orderedImports.push(importString);
			this.importMap[importString] = {
				named: {},
				hasDefault: false,
				defaultIdentifiers: new Set<string>(),
				importString: importString,
				isSideEff: false
			};
		}

		this.importMap[importString].hasDefault = true;
		this.importMap[importString].defaultIdentifiers.add(value);

	}

	createNamedWithAlias(importString: string, name: string, alias: string = name) {

		if (this.importMap[importString] === undefined) {
			this.orderedImports.push(importString);
			this.importMap[importString] = {
				named: {},
				hasDefault: false,
				defaultIdentifiers: new Set<string>(),
				importString: importString,
				isSideEff: false
			};
		}

		let curr: ImportRepresentation = this.importMap[importString]
			? this.importMap[importString] : {
				named: {},
				hasDefault: false,
				defaultIdentifiers: new Set<string>(),
				importString: importString,
				isSideEff: false
			};

		this.importMap[importString] = curr
		curr.named[name] = alias;
	}

	createSideEffect(importString: string) {
		if (this.importMap[importString] === undefined) {
			this.orderedImports.push(importString);
		}

		let curr: ImportRepresentation = this.importMap[importString]
			? this.importMap[importString] : {
				named: {},
				hasDefault: false,
				defaultIdentifiers: new Set<string>(),
				importString: importString,
				isSideEff: true
			};
		curr.isSideEff = true; // in case laready exists

		this.importMap[importString] = curr

	}


	buildDeclList(): ImportDeclaration[] {
		let decls: ImportDeclaration[] = [];
		this.orderedImports.forEach(imp => {
			let value = this.importMap [imp];
			let tmp: ImportDeclaration[] = [];
			if (value.hasDefault) {
				value.defaultIdentifiers.forEach(name => {
					tmp.push(createADefault(value.importString, name, (
						this.isBuiltInModule(value.importString)
						|| this.isLocalSpecifier(value.importString)))
					)
				})

			}
			tmp.reverse().forEach(e => decls.push(e))
			tmp = []
			if (Object.keys(value.named).length > 0) {
				tmp.push(createAnExport(value.importString, value.named))
			}
			tmp.reverse().forEach(e => decls.push(e))

			if (value.isSideEff) {
				decls.push(createASideEffect(value.importString))
			}

		})

		return decls;
	}


	importsThis(importString: string, value: string): boolean {
		let importsMap = this.importMap[importString]
		if (importsMap === undefined) {
			return false;
		}
		if (importsMap.hasDefault) {
			return importsMap.defaultIdentifiers[value] !== undefined
		}
		return importsMap.named[value] !== undefined

	}

	importsDefaultFromModule(importString: string): boolean {
		let importsMap = this.importMap[importString]
		if (importsMap === undefined) {
			return false;
		} else {
			return importsMap.hasDefault
		}
	}

	static built_ins = [
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
}


