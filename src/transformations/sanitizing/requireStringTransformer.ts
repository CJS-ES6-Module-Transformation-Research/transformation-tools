import {extname, resolve} from 'path'
import {existsSync, lstatSync} from 'fs'
import relative from "relative";
import {_JS, _JSON} from "../../../../index";


export class RequireStringTransformer {
    private dirname: string;

    constructor(dirname: string) {
        this.dirname = dirname
    }

    private absPath(path: string) {
        return resolve(this.dirname, path)
    }


    getTransformed(path: string) {
        let absolute: string = this.absPath(path)
        let computedPath: string


        if (path.charAt(0) !== '.' && path.charAt(0) !== '/') {
            return path
        } else if ((isBoth(absolute) && path.lastIndexOf('/') !== (path.length - 1))
            || !isDir(absolute)) {

            if (isJS(absolute)) {
                computedPath = extname(absolute) !== "" ? absolute : absolute + _JS
            } else if (isJSON(absolute)) {
                computedPath = extname(absolute) !== "" ? absolute : absolute + _JSON
            } else {
                computedPath = absolute
            }
        } else {//directory
            computedPath = absolute + "/index.js"
        }

        let relativized: string = relative(this.dirname, computedPath,null);

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



