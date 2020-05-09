#!/usr/local/bin/ts-node
import {
    CallExpression,
    Directive,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier,
    Property
} from 'estree'
import {parseScript} from "esprima";

try {
    // console.log(JSON.stringify(parseModule('import "hello"\n'), null, 5))

} catch (e) {
    console.log(e)
}
let is: ImportSpecifier = {
    type: "ImportSpecifier",
    imported: {
        name: "importSpecifier",
        type: "Identifier"
    },
    local: {
        name: "localSpecifier",
        type: "Identifier"
    }
}
let is2: ImportSpecifier = {
    type: "ImportSpecifier",
    imported: {
        name: "importSpecifier",
        type: "Identifier"
    },
    local: {
        name: "localSpecifier",
        type: "Identifier"
    }
}
let ids: ImportDefaultSpecifier = {
    type: "ImportDefaultSpecifier",
    local: {
        name: "defaultSpecifier",
        type: "Identifier"
    }
}
let ins: ImportNamespaceSpecifier = {
    type: "ImportNamespaceSpecifier",
    local: {
        name: "namespaceSpecifier",
        type: "Identifier"
    }
}
let x: ImportDeclaration = {
    type: "ImportDeclaration",
    specifiers: [is, is2, ids, ins],
    source: {
        type: "Literal",
        value: "chai"
    }
}


let ex1: CallExpression = {
    type: "CallExpression",
    callee: {type: "Identifier", name: "key"},
    arguments: []
}
let ap: Property = {
    type: "Property",
    key: {
        type: "Literal",
        value: 3
    },

    shorthand: false,
    computed: false,
    value: {type: "Identifier", name: "value"},
    kind: "init",
    method: false
}
const proj_dir = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform`;
const test_root = `${proj_dir}/test/res/fixtures/test_proj`;

const files: string[] = [
    'index.js',
    'lib.js',
    'lib/index.js',
    'src/index.js',
    'test/default.test.js',
    'test/fixt/parcel.js',
    'package.json'
];

let relativeRequirePath = {};
relativeRequirePath['index.js'] = './test/test_dat.json';
relativeRequirePath['lib.js'] = './test/test_dat.json';
relativeRequirePath ['lib/index.js'] = '../test/test_dat.json';
relativeRequirePath ['src/index.js'] = '../test/test_dat.json';
relativeRequirePath['test/default.test.js'] = './test_dat.json';
relativeRequirePath['test/fixt/parcel.js'] = '../test_dat.json';
relativeRequirePath['package.json'] = './test/test_dat.json';
//
// relativeRequirePath['index.js'] = './package.json';
// relativeRequirePath['lib.js'] = './package.json';
// relativeRequirePath ['lib/index.js'] = '../package.json';
// relativeRequirePath ['src/index.js'] = '../package.json';
// relativeRequirePath['test/default.test.js'] = '../package.json';
// relativeRequirePath['test/fixt/parcel.js'] = '../../package.json';
// relativeRequirePath['package.json'] = './package.json';

// for (let x in relativeRequirePath){
//     let file = join(test_root, x);
//     let dir = dirname(file);
//     let pkg :string = relativeRequirePath[x];
//     let withPackage = dir +'/'+pkg;
//     let withJoinPackage = join(dir, pkg)
//     console.log(`WORKING ON FILE ${x}`);
//     console.log(`\twith join" ${withJoinPackage}`);
//
//     console.log(`\twith join" ${ relative(test_root, withJoinPackage,null)}\n\n\n`);
//     //existsSync()
// }
// let re:RegExp = new RegExp('.+\.json$');

// const files : string[]= ['index.js','lib.js','lib/index.js','src/index.js','test/default.test.js','test/fixt/parcel.js','package.json']
// let pathToPackage: string = `${process.cwd()}/package.json`;
// console.log(pathToPackage)
// let package_JSON = `  ${readFileSync(pathToPackage).toString()}`;
// let parsed = JSON.parse(package_JSON)
// parsed.type = "module"
// for (let key in parsed){
//     console.log(`${key} : ${JSON.stringify(parsed[key],null,3)}`)
// }
// let parsedJSON = ((parseScript(package_JSON).body[0] as VariableDeclaration).declarations[0].init as ObjectExpression);
// let propMap: object = {}
// let map = parsedJSON.properties
// // map.forEach((e: Property) => {
//     let key = e.key;
//     let val = e.value;
//     let keyString:string, valString:string
//     if (key.type === 'Literal'){
//         keyString = key.value.toString()
//     }else{
//         keyString = `NOT LITERAL--TYPE: ${key.type}`
//     }
//
//     switch (val.type){
//         case "Literal":
//             valString = val.value.toString()
//             break;
//         case "Identifier":
//             valString = val.name;
//             break;
//         case "ArrayPattern":
//             valString = val.elements.map((p:Pattern) => JSON.stringify(p,null,2)).reduce((prev, curr) => prev + curr)
//             break;
//         case "ObjectPattern":
//             valString = JSON.stringify(val,null,2)
//             break;
//         default:
//             valString = generate(val);
//             break;
//     }
//
//
//     //
//     // let lit = (e.key as Literal)
//     // let val = lit.value.toString()
//     // console.log(`${val}`)
//     propMap[keyString] = valString;//`${e.value} =>  ${e.value.type} `
// })
// for (let key in map) {
//     console.log(`${key}  :   ${map[key]}`)
// }
// console.log(parsedJSON.type)
// console.log(package_JSON)

let program = parseScript('/*\n' +
    '\tMIT License http://www.opensource.org/licenses/mit-license.php\n' +
    '\tAuthor Tobias Koppers @sokra\n' +
    '*/\n' +
    '\n' +
    '"use strict";\n' +
    '\n' +
    'const normalize = require("./normalize");\n' +
    'const join = require("./join");\n' +
    'const MemoryFileSystemError = require("./MemoryFileSystemError");\n' +
    'const errors = require("errno");\n' +
    'const stream = require("readable-stream");\n' +
    '\n' +
    'const ReadableStream = stream.Readable;\n' +
    'const WritableStream = stream.Writable;\n' +
    '\n' +
    'function isDir(item) {\n' +
    '\tif(typeof item !== "object") return false;\n' +
    '\treturn item[""] === true;\n' +
    '}\n' +
    '\n' +
    'function isFile(item) {\n' +
    '\tif(typeof item !== "object") return false;\n' +
    '\treturn !item[""];\n' +
    '}\n' +
    '\n' +
    'function pathToArray(path) {\n' +
    '\tpath = normalize(path);\n' +
    '\tconst nix = /^\\//.test(path);\n' +
    '\tif(!nix) {\n' +
    '\t\tif(!/^[A-Za-z]:/.test(path)) {\n' +
    '\t\t\tthrow new MemoryFileSystemError(errors.code.EINVAL, path);\n' +
    '\t\t}\n' +
    '\t\tpath = path.replace(/[\\\\\\/]+/g, "\\\\"); // multi slashs\n' +
    '\t\tpath = path.split(/[\\\\\\/]/);\n' +
    '\t\tpath[0] = path[0].toUpperCase();\n' +
    '\t} else {\n' +
    '\t\tpath = path.replace(/\\/+/g, "/"); // multi slashs\n' +
    '\t\tpath = path.substr(1).split("/");\n' +
    '\t}\n' +
    '\tif(!path[path.length-1]) path.pop();\n' +
    '\treturn path;\n' +
    '}\n' +
    '\n' +
    'function trueFn() { return true; }\n' +
    'function falseFn() { return false; }\n' +
    '\n' +
    'class MemoryFileSystem {\n' +
    '\tconstructor(data) {\n' +
    '\t\tthis.data = data || {};\n' +
    '\t\tthis.join = join;\n' +
    '\t\tthis.pathToArray = pathToArray;\n' +
    '\t\tthis.normalize = normalize;\n' +
    '\t}\n' +
    '\n' +
    '\tmeta(_path) {\n' +
    '\t\tconst path = pathToArray(_path);\n' +
    '\t\tlet current = this.data;\n' +
    '\t\tlet i = 0;\n' +
    '\t\tfor(; i < path.length - 1; i++) {\n' +
    '\t\t\tif(!isDir(current[path[i]]))\n' +
    '\t\t\t\treturn;\n' +
    '\t\t\tcurrent = current[path[i]];\n' +
    '\t\t}\n' +
    '\t\treturn current[path[i]];\n' +
    '\t}\n' +
    '\n' +
    '\texistsSync(_path) {\n' +
    '\t\treturn !!this.meta(_path);\n' +
    '\t}\n' +
    '\n' +
    '\tstatSync(_path) {\n' +
    '\t\tlet current = this.meta(_path);\n' +
    '\t\tif(_path === "/" || isDir(current)) {\n' +
    '\t\t\treturn {\n' +
    '\t\t\t\tisFile: falseFn,\n' +
    '\t\t\t\tisDirectory: trueFn,\n' +
    '\t\t\t\tisBlockDevice: falseFn,\n' +
    '\t\t\t\tisCharacterDevice: falseFn,\n' +
    '\t\t\t\tisSymbolicLink: falseFn,\n' +
    '\t\t\t\tisFIFO: falseFn,\n' +
    '\t\t\t\tisSocket: falseFn\n' +
    '\t\t\t};\n' +
    '\t\t} else if(isFile(current)) {\n' +
    '\t\t\treturn {\n' +
    '\t\t\t\tisFile: trueFn,\n' +
    '\t\t\t\tisDirectory: falseFn,\n' +
    '\t\t\t\tisBlockDevice: falseFn,\n' +
    '\t\t\t\tisCharacterDevice: falseFn,\n' +
    '\t\t\t\tisSymbolicLink: falseFn,\n' +
    '\t\t\t\tisFIFO: falseFn,\n' +
    '\t\t\t\tisSocket: falseFn\n' +
    '\t\t\t};\n' +
    '\t\t} else {\n' +
    '\t\t\tthrow new MemoryFileSystemError(errors.code.ENOENT, _path, "stat");\n' +
    '\t\t}\n' +
    '\t}\n' +
    '\n' +
    '\treadFileSync(_path, optionsOrEncoding) {\n' +
    '\t\tconst path = pathToArray(_path);\n' +
    '\t\tlet current = this.data;\n' +
    '\t\tlet i = 0\n' +
    '\t\tfor(; i < path.length - 1; i++) {\n' +
    '\t\t\tif(!isDir(current[path[i]]))\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.ENOENT, _path, "readFile");\n' +
    '\t\t\tcurrent = current[path[i]];\n' +
    '\t\t}\n' +
    '\t\tif(!isFile(current[path[i]])) {\n' +
    '\t\t\tif(isDir(current[path[i]]))\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.EISDIR, _path, "readFile");\n' +
    '\t\t\telse\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.ENOENT, _path, "readFile");\n' +
    '\t\t}\n' +
    '\t\tcurrent = current[path[i]];\n' +
    '\t\tconst encoding = typeof optionsOrEncoding === "object" ? optionsOrEncoding.encoding : optionsOrEncoding;\n' +
    '\t\treturn encoding ? current.toString(encoding) : current;\n' +
    '\t}\n' +
    '\n' +
    '\treaddirSync(_path) {\n' +
    '\t\tif(_path === "/") return Object.keys(this.data).filter(Boolean);\n' +
    '\t\tconst path = pathToArray(_path);\n' +
    '\t\tlet current = this.data;\n' +
    '\t\tlet i = 0;\n' +
    '\t\tfor(; i < path.length - 1; i++) {\n' +
    '\t\t\tif(!isDir(current[path[i]]))\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.ENOENT, _path, "readdir");\n' +
    '\t\t\tcurrent = current[path[i]];\n' +
    '\t\t}\n' +
    '\t\tif(!isDir(current[path[i]])) {\n' +
    '\t\t\tif(isFile(current[path[i]]))\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.ENOTDIR, _path, "readdir");\n' +
    '\t\t\telse\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.ENOENT, _path, "readdir");\n' +
    '\t\t}\n' +
    '\t\treturn Object.keys(current[path[i]]).filter(Boolean);\n' +
    '\t}\n' +
    '\n' +
    '\tmkdirpSync(_path) {\n' +
    '\t\tconst path = pathToArray(_path);\n' +
    '\t\tif(path.length === 0) return;\n' +
    '\t\tlet current = this.data;\n' +
    '\t\tfor(let i = 0; i < path.length; i++) {\n' +
    '\t\t\tif(isFile(current[path[i]]))\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.ENOTDIR, _path, "mkdirp");\n' +
    '\t\t\telse if(!isDir(current[path[i]]))\n' +
    '\t\t\t\tcurrent[path[i]] = {"":true};\n' +
    '\t\t\tcurrent = current[path[i]];\n' +
    '\t\t}\n' +
    '\t\treturn;\n' +
    '\t}\n' +
    '\n' +
    '\tmkdirSync(_path) {\n' +
    '\t\tconst path = pathToArray(_path);\n' +
    '\t\tif(path.length === 0) return;\n' +
    '\t\tlet current = this.data;\n' +
    '\t\tlet i = 0;\n' +
    '\t\tfor(; i < path.length - 1; i++) {\n' +
    '\t\t\tif(!isDir(current[path[i]]))\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.ENOENT, _path, "mkdir");\n' +
    '\t\t\tcurrent = current[path[i]];\n' +
    '\t\t}\n' +
    '\t\tif(isDir(current[path[i]]))\n' +
    '\t\t\tthrow new MemoryFileSystemError(errors.code.EEXIST, _path, "mkdir");\n' +
    '\t\telse if(isFile(current[path[i]]))\n' +
    '\t\t\tthrow new MemoryFileSystemError(errors.code.ENOTDIR, _path, "mkdir");\n' +
    '\t\tcurrent[path[i]] = {"":true};\n' +
    '\t\treturn;\n' +
    '\t}\n' +
    '\n' +
    '\t_remove(_path, name, testFn) {\n' +
    '\t\tconst path = pathToArray(_path);\n' +
    '\t\tconst operation = name === "File" ? "unlink" : "rmdir";\n' +
    '\t\tif(path.length === 0) {\n' +
    '\t\t\tthrow new MemoryFileSystemError(errors.code.EPERM, _path, operation);\n' +
    '\t\t}\n' +
    '\t\tlet current = this.data;\n' +
    '\t\tlet i = 0;\n' +
    '\t\tfor(; i < path.length - 1; i++) {\n' +
    '\t\t\tif(!isDir(current[path[i]]))\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.ENOENT, _path, operation);\n' +
    '\t\t\tcurrent = current[path[i]];\n' +
    '\t\t}\n' +
    '\t\tif(!testFn(current[path[i]]))\n' +
    '\t\t\tthrow new MemoryFileSystemError(errors.code.ENOENT, _path, operation);\n' +
    '\t\tdelete current[path[i]];\n' +
    '\t\treturn;\n' +
    '\t}\n' +
    '\n' +
    '\trmdirSync(_path) {\n' +
    '\t\treturn this._remove(_path, "Directory", isDir);\n' +
    '\t}\n' +
    '\n' +
    '\tunlinkSync(_path) {\n' +
    '\t\treturn this._remove(_path, "File", isFile);\n' +
    '\t}\n' +
    '\n' +
    '\treadlinkSync(_path) {\n' +
    '\t\tthrow new MemoryFileSystemError(errors.code.ENOSYS, _path, "readlink");\n' +
    '\t}\n' +
    '\n' +
    '\twriteFileSync(_path, content, optionsOrEncoding) {\n' +
    '\t\tif(!content && !optionsOrEncoding) throw new Error("No content");\n' +
    '\t\tconst path = pathToArray(_path);\n' +
    '\t\tif(path.length === 0) {\n' +
    '\t\t\tthrow new MemoryFileSystemError(errors.code.EISDIR, _path, "writeFile");\n' +
    '\t\t}\n' +
    '\t\tlet current = this.data;\n' +
    '\t\tlet i = 0\n' +
    '\t\tfor(; i < path.length - 1; i++) {\n' +
    '\t\t\tif(!isDir(current[path[i]]))\n' +
    '\t\t\t\tthrow new MemoryFileSystemError(errors.code.ENOENT, _path, "writeFile");\n' +
    '\t\t\tcurrent = current[path[i]];\n' +
    '\t\t}\n' +
    '\t\tif(isDir(current[path[i]]))\n' +
    '\t\t\tthrow new MemoryFileSystemError(errors.code.EISDIR, _path, "writeFile");\n' +
    '\t\tconst encoding = typeof optionsOrEncoding === "object" ? optionsOrEncoding.encoding : optionsOrEncoding;\n' +
    '\t\tcurrent[path[i]] = optionsOrEncoding || typeof content === "string" ? new Buffer(content, encoding) : content;\n' +
    '\t\treturn;\n' +
    '\t}\n' +
    '\n' +
    '\t// stream methods\n' +
    '\tcreateReadStream(path, options) {\n' +
    '\t\tlet stream = new ReadableStream();\n' +
    '\t\tlet done = false;\n' +
    '\t\tlet data;\n' +
    '\t\ttry {\n' +
    '\t\t\tdata = this.readFileSync(path);\n' +
    '\t\t} catch (e) {\n' +
    '\t\t\tstream._read = function() {\n' +
    '\t\t\t\tif (done) {\n' +
    '\t\t\t\t\treturn;\n' +
    '\t\t\t\t}\n' +
    '\t\t\t\tdone = true;\n' +
    '\t\t\t\tthis.emit(\'error\', e);\n' +
    '\t\t\t\tthis.push(null);\n' +
    '\t\t\t};\n' +
    '\t\t\treturn stream;\n' +
    '\t\t}\n' +
    '\t\toptions = options || { };\n' +
    '\t\toptions.start = options.start || 0;\n' +
    '\t\toptions.end = options.end || data.length;\n' +
    '\t\tstream._read = function() {\n' +
    '\t\t\tif (done) {\n' +
    '\t\t\t\treturn;\n' +
    '\t\t\t}\n' +
    '\t\t\tdone = true;\n' +
    '\t\t\tthis.push(data.slice(options.start, options.end));\n' +
    '\t\t\tthis.push(null);\n' +
    '\t\t};\n' +
    '\t\treturn stream;\n' +
    '\t}\n' +
    '\n' +
    '\tcreateWriteStream(path) {\n' +
    '\t\tlet stream = new WritableStream();\n' +
    '\t\ttry {\n' +
    '\t\t\t// Zero the file and make sure it is writable\n' +
    '\t\t\tthis.writeFileSync(path, new Buffer(0));\n' +
    '\t\t} catch(e) {\n' +
    '\t\t\t// This or setImmediate?\n' +
    '\t\t\tstream.once(\'prefinish\', function() {\n' +
    '\t\t\t\tstream.emit(\'error\', e);\n' +
    '\t\t\t});\n' +
    '\t\t\treturn stream;\n' +
    '\t\t}\n' +
    '\t\tlet bl = [ ], len = 0;\n' +
    '\t\tstream._write = (chunk, encoding, callback) => {\n' +
    '\t\t\tbl.push(chunk);\n' +
    '\t\t\tlen += chunk.length;\n' +
    '\t\t\tthis.writeFile(path, Buffer.concat(bl, len), callback);\n' +
    '\t\t}\n' +
    '\t\treturn stream;\n' +
    '\t}\n' +
    '\n' +
    '\t// async functions\n' +
    '\texists(path, callback) {\n' +
    '\t\treturn callback(this.existsSync(path));\n' +
    '\t}\n' +
    '\n' +
    '\twriteFile(path, content, encoding, callback) {\n' +
    '\t\tif(!callback) {\n' +
    '\t\t\tcallback = encoding;\n' +
    '\t\t\tencoding = undefined;\n' +
    '\t\t}\n' +
    '\t\ttry {\n' +
    '\t\t\tthis.writeFileSync(path, content, encoding);\n' +
    '\t\t} catch(e) {\n' +
    '\t\t\treturn callback(e);\n' +
    '\t\t}\n' +
    '\t\treturn callback();\n' +
    '\t}\n' +
    '}\n' +
    '\n' +
    '// async functions\n' +
    '\n' +
    '["stat", "readdir", "mkdirp", "rmdir", "unlink", "readlink"].forEach(function(fn) {\n' +
    '\tMemoryFileSystem.prototype[fn] = function(path, callback) {\n' +
    '\t\tlet result;\n' +
    '\t\ttry {\n' +
    '\t\t\tresult = this[fn + "Sync"](path);\n' +
    '\t\t} catch(e) {\n' +
    '\t\t\tsetImmediate(function() {\n' +
    '\t\t\t\tcallback(e);\n' +
    '\t\t\t});\n' +
    '\n' +
    '\t\t\treturn;\n' +
    '\t\t}\n' +
    '\t\tsetImmediate(function() {\n' +
    '\t\t\tcallback(null, result);\n' +
    '\t\t});\n' +
    '\t};\n' +
    '});\n' +
    '\n' +
    '["mkdir", "readFile"].forEach(function(fn) {\n' +
    '\tMemoryFileSystem.prototype[fn] = function(path, optArg, callback) {\n' +
    '\t\tif(!callback) {\n' +
    '\t\t\tcallback = optArg;\n' +
    '\t\t\toptArg = undefined;\n' +
    '\t\t}\n' +
    '\t\tlet result;\n' +
    '\t\ttry {\n' +
    '\t\t\tresult = this[fn + "Sync"](path, optArg);\n' +
    '\t\t} catch(e) {\n' +
    '\t\t\tsetImmediate(function() {\n' +
    '\t\t\t\tcallback(e);\n' +
    '\t\t\t});\n' +
    '\n' +
    '\t\t\treturn;\n' +
    '\t\t}\n' +
    '\t\tsetImmediate(function() {\n' +
    '\t\t\tcallback(null, result);\n' +
    '\t\t});\n' +
    '\t};\n' +
    '});\n' +
    '\n' +
    'module.exports = MemoryFileSystem;\n')

function tester(e: any): boolean {
    return (e as Directive).directive && true;
}

console.log(JSON.stringify(program.body  [0], null, 4))
console.log(tester(program.body  [0]))
console.log(tester(program.body  [1]))