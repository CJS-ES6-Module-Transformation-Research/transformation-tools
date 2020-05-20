#!/usr/local/bin/ts-node
import {
    AssignmentExpression,
    BaseModuleDeclaration,
    BaseModuleSpecifier,
    CallExpression,
    Declaration,
    Directive,
    ExportAllDeclaration,
    ExportDefaultDeclaration,
    ExportNamedDeclaration,
    ExportSpecifier,
    Expression,
    Identifier,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier,
    Literal, MemberExpression, ModuleDeclaration, ObjectExpression, Pattern, Program,
    Property,
    VariableDeclaration
} from 'estree'
import {parseModule, parseScript} from "esprima";
import {generate} from "escodegen";
import exp from "constants";
import {traverse, Visitor, VisitorOption} from "estraverse";

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


interface $ExportSpecifier extends BaseModuleSpecifier {
    type: "ExportSpecifier";
    exported: Identifier;
}

interface $ExportNamedDeclaration extends BaseModuleDeclaration {
    type: "ExportNamedDeclaration";
    declaration?: Declaration | null;
    specifiers: Array<ExportSpecifier>;
    source?: Literal | null;
}

interface $ExportSpecifier extends BaseModuleSpecifier {
    type: "ExportSpecifier";
    exported: Identifier;
}

interface $ExportDefaultDeclaration extends BaseModuleDeclaration {
    type: "ExportDefaultDeclaration";
    declaration: Declaration | Expression;
}

interface $ExportAllDeclaration extends BaseModuleDeclaration {
    type: "ExportAllDeclaration";
    source: Literal;
}
//
// function tester(e: any): boolean {
//     return (e as Directive).directive && true;
// }
//
// let id1: Identifier = {name: "id__1", type: "Identifier"}
// let id2: Identifier = {name: "id__2", type: "Identifier"}
// let id3: Identifier = {name: "id__3", type: "Identifier"}
//
// let lit1: Literal = {type: "Literal", value: "LIT_1"}
// let lit2: Literal = {type: "Literal", value: "LIT_2"}
//
// let decl1: VariableDeclaration = {
//     type: "VariableDeclaration",
//     kind: "const",
//     declarations: [{init: lit1, id: id1, type: "VariableDeclarator"}]
// }
// let exportAll: ExportAllDeclaration, exportSpec: ExportSpecifier, exportNamedDecl: ExportNamedDeclaration,
//     exportDefaultDeclaration: ExportDefaultDeclaration
//
// function id(ident: string): Identifier {
//     return {type: "Identifier", name: ident}
// };
//
// function lit(ident: string): Literal {
//     return {type: "Literal", value: ident}
// };
// exportAll = {type: "ExportAllDeclaration", source: lit2};
// exportSpec = {type: "ExportSpecifier", local: id('local'), exported: id('exported')};
// exportNamedDecl = {type: "ExportNamedDeclaration", specifiers: [exportSpec], source: lit('source')};
// exportNamedDecl = {type: "ExportNamedDeclaration", specifiers: [exportSpec]};
// exportDefaultDeclaration = {type: "ExportDefaultDeclaration", declaration: decl1};
//
// console.log(`\n\n\n`)
// console.log(generate(exportSpec))
// console.log(`\n\n\n`)
// console.log(generate(exportAll))
// console.log(`\n\n\n`)
// console.log(generate(exportNamedDecl))
// console.log(`\n\n\n`)
// console.log(generate(exportDefaultDeclaration))
//
//
// // console.log(JSON.stringify((parseModule(`
// // let i, j, k;
// // export default {i,j,k:w}
// // `).body[1] as ExportDefaultDeclaration).declaration as ObjectExpression,null,4))
// let count = 0;
let ast: Program;
ast = parseScript(`

module.exports = "hello"
console.log("hello")
if(isTrue()){
    console.log("true")
}

`)
let count=0
// let visitor: Visitor = {
//     enter: (node, parentNode) => {
//         if (parentNode===null  ){
//             console.log(node)
//             count++
//             return VisitorOption.Skip
//         }
//     },
//     leave: (node, parentNode) => {
//         // console.log(node)
//         // count++
//     }
//
// }


//
// ast.body.forEach(e=> {
//     traverse(e,visitor)
// });


// console.log(count )



 let filesinExportsTests =   [ `obj_to_name`,
    `primitiive_to_name`,
`anon_default_arrow`,
`anon_default_func`,
`assign_arrow_to_default_then_assign_name`,
`assign_func_to_default_obj_then_add_name_with_func_name`,
`assign_func_to_default_then_add_name_with_func_anon`,
`class_default_assign`,
`class_named_assign`,
`identifier_soup_1`,
`mixed_mnames`,
`multiple_names_assigned_prim`,
`multiple_names_objs`,
`name_collision_on_declared_func_name`,
`name_collision_onpredeclared_anon_func`]

let projectStr =`/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/export/export_test_files/simple_suite`


import {transformBaseExports} from './transformations/export_transformations/visitors/_____search_nameless_df_exports';
import { Transformer,ProjectTransformFunction} from './transformations/Transformer';
import {projectReader,JSFile,TransformableProject,script_or_module } from './abstract_representation/project_representation/index';
function getFileInExTest(index:number=0 ){
    let x =  filesinExportsTests[index ];
    return `${projectStr}/${x}/${x}.js`
}

// projectReader(getFileInExTest(0)
let project =
    projectReader(`/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/export/export_test_files/simple_suite/obj_to_name/`);
let transformer = Transformer.ofProject(project)
project.forEachSource(js=>{
    // console.log(`${generate(js.getAST())}\n\n\n`)
    // console.log(js.getAST().body.length)
js.getAST().body.forEach(e=>{

    if (e.type === "ExpressionStatement"){
        console.log(`${e.type} =====  ${e.expression.type}`)
    }
    console.log(generate (e))

    console.log('\n' )
})

})
transformer.transform(transformBaseExports)
transformer.transform(js=>{
    console.log('making string'  )
    console.log(js.makeString() )
});

project.forEachSource(js=>{
    console.log(`${generate(js.getAST())} `)
})
// transformer.transform(js=>js.setAsModule() )



