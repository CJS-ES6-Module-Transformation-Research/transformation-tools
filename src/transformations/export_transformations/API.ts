import {API_KeyMap} from "../../abstract_fs_v2/Factory";


export class API {
	private _isForced: boolean=false ;
	constructor(type: API_TYPE, isBuiltin = false, names: string[] = []) {
		this.type = type,
			this.exports = []
		this._isBuiltin = isBuiltin
		this.non_api = this.type === API_TYPE.none
	}
	readonly id: number = Math.floor(Math.random() * 1000)

	getExports(): string[] {
		return this.exports
 	}

	getType( ) {
		if (this._isForced){
			return API_TYPE.default_only
		}
		return this.type
	}

	isForced():boolean{
		return this._isForced
	}
getID(){
		return this.id
}


	private readonly _isBuiltin: boolean;
	private readonly non_api: boolean;
	private  exports: string[];
	private type: API_TYPE;

	setType(_type: API_TYPE, isForced=false) {
		if (this._isForced){
			console.log("IS FORCED: RETURN")
			return
		}
		if (isForced){
			this._isForced = true;
			console.log("SET FORCED: RETURN")

			return
		}

		this.type = _type

	}

	setNames(names: string[]) {
		this.exports=names
	}
	toString(){
		return `${this.type}, ${this._isForced}`
	}
}

export enum API_TYPE {
	default_only = "default_only",
	named_only = "named_only",
	none="none"
}
// export function _initBuiltins(): API_KeyMap {
// 	let apis: API_KeyMap = {}
//
// 	const _default_only = [
// 		'_stream_duplex_',
// 		'_stream_passthrough_',
// 		'_stream_readable',
// 		'_stream_transform_',
// 		'_stream_wrap_',
// 		'_stream_writable_',
// 		'assert',
// 		'events',
// 		'module',
// 		'stream'];
//
// 	// const built_ins =
// 	(["_http_agent",
// 			"_http_client",
// 			"_http_common",
// 			"_http_incoming",
// 			"_http_outgoing",
// 			"_http_server",
// 			"_stream_duplex",
// 			"_stream_passthrough",
// 			"_stream_readable",
// 			"_stream_transform",
// 			"_stream_wrap",
// 			"_stream_writable",
// 			"_tls_common",
// 			"_tls_wrap",
// 			"assert",
// 			"async_hooks",
// 			"buffer",
// 			"child_process",
// 			"cluster",
// 			"console",
// 			"constants",
// 			"crypto",
// 			"dgram",
// 			"dns",
// 			"domain",
// 			"events",
// 			"fs",
// 			"fs/promises",
// 			"http",
// 			"http2",
// 			"https",
// 			"inspector",
// 			"module",
// 			"net",
// 			"os",
// 			"path",
// 			"perf_hooks",
// 			"process",
// 			"punycode",
// 			"querystring",
// 			"readline",
// 			"repl",
// 			"stream",
// 			"string_decoder",
// 			"sys",
// 			"timers",
// 			"tls",
// 			"trace_events",
// 			"tty",
// 			"url",
// 			"util",
// 			"v8",
// 			"vm",
// 			"worker_threads",
// 			"zlib"].forEach(e => {
// 			let _type = (_default_only.includes(e) ? API_TYPE.default_only : API_TYPE.named_only)
// 			apis[e] = new API(_type,   true)
// 		})
//
// 	)
// 	return apis;
// }