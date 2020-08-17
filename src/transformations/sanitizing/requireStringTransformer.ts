import {existsSync, lstatSync} from 'fs'
import {dirname, extname, join, resolve} from 'path'
import relative from "relative";
import {JSFile} from "../../abstract_fs_v2/JSv2";


const _JS = ".js";
const _JSON = ".json";

/**
 * Require String object transformer that generates the expected ES6 version of the require string.
 */
export class RequireStringTransformer {
	private readonly dirname: string;
	private js: JSFile

	constructor(js: JSFile) {
		this.dirname = dirname(js.getAbsolute())
		this.js = js;
	}

	private computeMain(_path: string) {
		return this.js.getParent().getDir(
			join(
				this.js.getParent().getRelative(),
				dirname(_path)))
			.getPackageJSON()
			.getMain()
	}

	private absPath(path: string) {
		return resolve(this.dirname, path)
	}

	/**
	 * Transforms require string to ES6 string based on project.
	 * @param _path require string.
	 */
	getTransformed(_path: string) {

		let absolute: string = this.absPath(_path)
		let computedPath: string
		let main = this.computeMain(_path)

		if (_path.charAt(0) !== '.' && _path.charAt(0) !== '/') {
			//todo: many more cases here /
			//  node submodules
			return _path
		} else if ((isBoth(absolute) && _path.lastIndexOf('/') !== (_path.length - 1))
			|| !isDir(absolute)) {

			if (isJS(absolute)) {
				computedPath = extname(absolute) !== "" ? absolute : absolute + _JS
			} else if (isJSON(absolute)) {
				computedPath = extname(absolute) !== "" ? absolute : absolute + _JSON
			} else {
				computedPath = absolute
			}
		} else {//directory
			computedPath = `${absolute}/${main}`
		}

		let relativized: string = relative(this.dirname, computedPath, null);

		if (!(relativized.charAt(0) === '.') && !(relativized.charAt(0) === '/')) {
			relativized = "./" + relativized
		}

		function isBoth(path: string) {

			return ((isJS(path) || isJSON(path))
				&& isDir(path))
		}

		function isJS(path: string) {
			return extname(path) === _JS
				|| existsSync(path + _JS)
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

		return relativized;
	}


}



