#!/Users/sam/.nvm/versions/node/v12.16.0/bin/ts-node
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_root = '/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test';
// @ts-ignore
exports.test_dir = exports.test_root + "/res/fixtures/test_proj";
exports.EXPECTED = exports.test_root + "/res/expected";
// export let relative = function (a:string, b:string) {
//     if (!a || !b){
//     console.log(a)
//     console.log(b)
//     }
//     return relative_(a, b)
// }
exports.parse_opts = {
    loc: true,
    tolerant: true
};
// export let parseAST = (depr.ast, listener = (x) => {
// }) => {
//     return (parseScript(depr.ast, {
//         loc: true,
//         tolerant: true
//     }, listener))
// }
var _JS = ".js";
exports._JS = _JS;
var _JSON = ".json";
exports._JSON = _JSON;
exports.JPP = function (value) {
    return JSON.stringify(value, null, 3);
};
var FILE_TYPE;
(function (FILE_TYPE) {
    FILE_TYPE["JS"] = ".js";
    FILE_TYPE["JSON"] = ".json";
    FILE_TYPE["OTHER"] = "other";
    FILE_TYPE["SYMLINK"] = "SYMLINK";
})(FILE_TYPE = exports.FILE_TYPE || (exports.FILE_TYPE = {}));
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
