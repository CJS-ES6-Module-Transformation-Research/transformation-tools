import {API_TYPE} from "./ExportsBuilder";

export class API {
 	constructor(type, names: string[] = [], isBuiltin = false) {
 		this.type = type,
		this.exports = []
		this._isBuiltin = isBuiltin
		this.non_api = this.type === API_TYPE.none
	}


	getExports(): string[] {
		return this.exports
	}

	getType() {
		return this.type
	}

	isBuiltin() {
		return this._isBuiltin;
	}

	isEmpty() {
		return this.non_api;
	}

	private readonly _isBuiltin: boolean;
	private readonly non_api: boolean;
	private readonly exports: string[];
	private readonly type: API_TYPE;
}