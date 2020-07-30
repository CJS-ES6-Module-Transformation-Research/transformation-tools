import {API_TYPE} from "./ExportsBuilder.js";

export class API{
	constructor(type) {
		this.type = type,
			this.exports = []
	}

	getExports(): string[] {
		return this.exports
	}

	getType() {
		return this.type
	}


	private readonly exports: string[];
	private readonly type: API_TYPE;
}