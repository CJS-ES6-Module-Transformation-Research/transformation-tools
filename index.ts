#!/Users/sam/.nvm/versions/node/v12.16.0/bin/ts-node

import {fixtures} from "./Utils/Dirs";

export let test_root = '/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test'

// @ts-ignore
export let test_dir = `${test_root}/res/fixtures/test_proj`
export const EXPECTED = `${test_root}/res/expected`
// export let relative = function (a:string, b:string) {
//     if (!a || !b){
//     console.log(a)
//     console.log(b)
//     }
//     return relative_(a, b)
// }

export const parse_opts = {
    loc: true,
    tolerant: true
}


// export let parseAST = (depr.ast, listener = (x) => {
// }) => {
//     return (parseScript(depr.ast, {
//         loc: true,
//         tolerant: true
//     }, listener))
// }
const _JS = ".js";
const _JSON = ".json";
export {_JS, _JSON}

export const JPP = (value: any): string => {
    return JSON.stringify(value, null, 3);
};

export enum FILE_TYPE {
    JS = ".js",
    JSON = '.json',
    OTHER = 'other',
    SYMLINK = "SYMLINK"
}


// function transformAccessToAccessImport(old) {
//
//     let vd = old.declarations[0]
//     let init = vd.init
//     let name = vd.id.name
//     // console.log(JSON.stringify(vd))
//     let value = init.object.arguments[0].value
//     let raw = init.object.arguments[0].raw
//     let propName = init.property.name
//     let accessName = `_access_to_module_${value}`
//     return {
//         importStatement: {
//             "type": "ImportDeclaration",
//             "specifiers": [
//                 {
//                     "type": "ImportDefaultSpecifier",
//                     "local": {
//                         "type": "Identifier",
//                         "name": accessName
//                     }
//                 }
//             ],
//             "source": {
//                 "type": "Literal",
//                 "value": value,
//             }
//         },
//         accessDecl: {
//             "type": "VariableDeclaration",
//             "declarations": [
//                 {
//                     "type": "VariableDeclarator",
//                     "id": {
//                         "type": "Identifier",
//                         "name": propName
//                     },
//                     "init": {
//                         "type": "Identifier",
//                         "name": accessName
//                     }
//                 }
//             ],
//             "kind": "const"
//         }
//     }
// }
//
//
// function transformDefaultRequire(old) {
//
//     let vd = old.declarations[0]
//     let name = vd.id.name
//     let value = vd.init.arguments[0].value
//     let raw = vd.init.arguments[0].raw
//
//
//     return {
//         "type": "ImportDeclaration",
//         "specifiers": [
//             {
//                 "type": "ImportDefaultSpecifier",
//                 "local": {
//                     "type": "Identifier",
//                     "name": name
//                 }
//             }
//         ],
//         "source": {
//             "type": "Literal",
//             "value": value,
//             "raw": raw
//         }
//     }
// }
//
