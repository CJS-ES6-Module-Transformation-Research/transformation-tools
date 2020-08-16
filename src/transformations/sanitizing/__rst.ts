import * as fs from "fs";
import {existsSync, lstatSync, readdirSync, readFileSync} from 'fs'
import {extname, resolve} from 'path'
import relative from "relative";
import {join} from 'path'

const _JS = ".js";
const _JSON = ".json";

/**
 * Require String object transformer that generates the expected ES6 version of the require string.
 */
export class RequireStringTransformer {
	private dirname: string;
	private main: string

	constructor(dirname: string, main: string) {
		this.dirname = dirname
		this.main = main
	}

	private absPath(path: string) {
		return resolve(this.dirname, path)
	}
	private handleDeepPath(path: string) {
		if (path.endsWith('.js')){return path}
		let deepPath = join(this.dirname,'node_modules',path)
		if (existsSync(join(this.dirname, 'node_modules'))){
			throw new Error("install npm dependencies before running transformation")
		}else if(!existsSync(deepPath)){
			throw new Error("could not find module "+deepPath)
		}else{
			if (isJS(deepPath) ){

				return path + '.js'
			}else if (isJSON(deepPath)){
				 //create
				throw new Error('TODO')
			}else{
				let fname = 'index.js'
				if(readdirSync(deepPath).includes('package.json')){
					let tmp = JSON.parse(readFileSync(join(deepPath, 'package.json'),'utf-8')).main
					fname = tmp? tmp:fname
				}
				return join(deepPath, fname)
			}
		}


 	}
	/**
	 * Transforms require string to ES6 string based on project.
	 * @param path require string.
	 */
	getTransformed(path: string) {
		let absolute: string = this.absPath(path)
		let computedPath: string




		if (path.charAt(0) !== '.' && path.charAt(0) !== '/') {
			if(path.includes('/')&&( !extname(path))){
				return this.handleDeepPath(path)
			}
			return path
		} else if (isJS(absolute)) {
			// ((
			// 	&& isDir(absolute)) && (absolute.lastIndexOf('/') !== (path.length - 1)))
			// 	|| (!isDir(absolute))) {
// console.log(" extname(absolute)  b")
// console.log( extname(absolute) )
			computedPath = extname(absolute) !== "" ? absolute : absolute + _JS

			computedPath = absolute


			let relativized: string = relative(this.dirname, computedPath, null);

			if (!(relativized.charAt(0) === '.') && !(relativized.charAt(0) === '/')) {
				relativized = "./" + relativized
			}

			return relativized;

		} else if (isJSON(absolute)) {

			computedPath = extname(absolute) !== "" ? absolute : absolute + _JSON
			return this.relativized(computedPath);


		} else if (isDir(absolute)) {//directory
			// console.log('computing dir file')
			let fname = 'index.js'
			let files = readdirSync(absolute)
			let pkg:string = '' ;
			if (files.includes('package.json')){
				pkg = fs.readFileSync(join(absolute, 'package.json'), 'utf-8')
				let _json = JSON.parse(pkg)
				if(_json && _json.main){
					fname = _json.main
				}
				return this.relativized(join(absolute, fname))
			}else{
				throw new Error('could not compute path')
			}

		}
		// console.log(absolute)
		// console.log(absolute + ".js")

		// if (existsSync(absolute + ".js")) {
		// 	computedPath=absolute + ".js"
		// } else if (existsSync(absolute + ".json")) {
		// 	computedPath=absolute + ".json"
		//
		// } else {
		// if (existsSync(absolute) && lstatSync(absolute).isDirectory()) {
		//
		// }
		// // }
		//

 		//



	}


	private relativized(computedPath: string) {
		let relativized: string = relative(this.dirname, computedPath, null);

		if (!(relativized.charAt(0) === '.') && !(relativized.charAt(0) === '/')) {
			relativized = "./" + relativized
		}
		return relativized;
	}


}

function isBoth(path: string) {

	return ((isJS(path) || isJSON(path))
		&& isDir(path))
}

function isJS(path: string) {
	let isjs = (extname(path) === _JS
		|| existsSync(path + _JS))
	// console.log(path + " -- " + isjs)
	return isjs
}

function isJSON(path: string) {
	return extname(path) === _JSON || existsSync(path + _JSON)
}

function isDir(path: string) {
	try {
		return lstatSync(path).isDirectory()
	} catch (err) {
		return false;
	}
}

