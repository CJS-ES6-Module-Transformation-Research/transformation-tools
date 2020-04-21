import {JSFile} from "../src/filesystem/JS";
import {TransformableProject} from "../src/filesystem/FS";
import {getAllRequireStringsAsList} from "../src/ast_tools/astTools";
import {Program} from "esprima";
import {traverse} from "estraverse";
import {VariableDeclaration, Node} from 'estree';
import {generate} from "escodegen";

export interface TestingTool_ReqString {
    name: string
    file: JSFile
    preTfRequireStrings: string[]
    transformedRequireStrings: string[]
}

export interface TestingTool_VarDecFlat {
    name: string
    file: JSFile
    decls: DecCount
}

export function createReqStringToolFromName(proj: TransformableProject, name: string): TestingTool_ReqString {
    let file = proj.getJS(name);
    return {
        name: name,
        file: file,
        preTfRequireStrings: getAllRequireStringsAsList(file.getAST()),
        transformedRequireStrings: []
    };
}

export function createVarDeclToolFromName(proj: TransformableProject, name: string): TestingTool_VarDecFlat {
    let file = proj.getJS(name);
    return {
        name: name,
        file: file,
        decls: countVarDecs(file.getAST())
    }
}


export interface TestingTool_AccRepl {
    name: string
    file:JSFile
    accessRequires:AccessRequire[]
}

export function createAccessTool(proj: TransformableProject, name: string): TestingTool_AccRepl {
    let file = proj.getJS(name);
    return {
        name: name,
        file: file,
        accessRequires: getRequires(file.getAST())
    };

    function getRequires(ast: Program): AccessRequire [] {
        let requires: AccessRequire[] = [];
        traverse(ast, {
            enter: (node: Node, parent : Node) => {
                if (node.type === "CallExpression"
                    && node.arguments.length>0
                    && node.arguments[0].type === "Literal"
                    && parent.type ==="VariableDeclaration"
                    && parent.kind === "const"
                    && parent.declarations[0].id.type === "Identifier"){
                    let ar:AccessRequire = {
                        varName:parent.declarations[0].id.name.toString(),
                        requireString:node.arguments[0].value.toString()
                    }
                    requires.push(ar);
                }
            }
        });
        return requires;
    }
}

export interface AccessRequire {
    requireString: string
    varName: string
}


export interface ToolMap<T> {
    [key: string]: T
}

export interface FileDataMap<T> {
    [filename: string]: T
}

// export interface VarDeclAssignMap {
//     [vname: string]: string
// }

//todo function counts numver of decls and declNs
export interface DecCount {
    numVariableDeclarators: number
    numDeclarations: number
    sanitizedDeclarations: number
}

function countVarDecs(ast: Program): DecCount {
    let declarations = 0;
    let declarators = 0;
    let forIns: Set<VariableDeclaration> = new Set<VariableDeclaration>();
    traverse(ast, {
        enter: (node, parent) => {
            // let parentIsFor =
            if (parent && node.type === "VariableDeclaration") {
                switch (parent.type) {
                    case  "ForInStatement":
                        forIns.add(node)
                        break;
                    case "ForOfStatement":
                        forIns.add(node)
                        break;
                    case   "ForStatement":
                        forIns.add(node)
                        break;
                }
            }


            switch (node.type) {

                case "VariableDeclarator":
                    declarators++;
                    return;
                case "VariableDeclaration":
                    declarations++;
                    return;
            }
        }
    });

    let sani = declarators;
    forIns.forEach((d: VariableDeclaration) => {
        if (d.declarations.length > 1) {
            let x = (d.declarations.length - 1);
            sani = sani - (x > 1 ? x : 0) - 1
        }
    });
    console.log(`${declarations}|${declarators}->${sani}`)

    return {
        numDeclarations: declarations,
        numVariableDeclarators: declarators,
        sanitizedDeclarations: sani
    };
}


export interface ImportExpectedMap {
    [requireString: string]: string
}
export interface AccessRequire2WayMap {
    [str: string]: string
}

const importMappings_forTest_Dir: FileDataMap<ImportExpectedMap> = {}

importMappings_forTest_Dir['index.js'] = {};
importMappings_forTest_Dir['lib.js'] = {};
importMappings_forTest_Dir['src/index.js'] = {};
importMappings_forTest_Dir['test/default.test.js'] = {};


importMappings_forTest_Dir['index.js']['./src/index'] = './src/index.js';
importMappings_forTest_Dir['index.js']['chai'] = 'chai';
importMappings_forTest_Dir['index.js']['./lib'] = './lib.js';
importMappings_forTest_Dir['lib.js']['./package'] = './package.json';
importMappings_forTest_Dir['src/index.js']['fs'] = 'fs';
importMappings_forTest_Dir['src/index.js']['../lib'] = '../lib.js';
importMappings_forTest_Dir['src/index.js']['../lib/'] = '../lib/index.js';
importMappings_forTest_Dir['test/default.test.js']['..'] = '../index.js';
importMappings_forTest_Dir['test/default.test.js']['../'] = '../index.js';

const varDeclCounts_forTest_Dir: FileDataMap<DecCount> = {}

varDeclCounts_forTest_Dir['index.js'] = {
    numDeclarations: 9,
    numVariableDeclarators: 15,
    sanitizedDeclarations: 15
};
varDeclCounts_forTest_Dir['lib/index.js'] = {
    numDeclarations: 1,
    numVariableDeclarators: 1,
    sanitizedDeclarations: 1
};
varDeclCounts_forTest_Dir['lib.js'] = {
    numDeclarations: 5,
    numVariableDeclarators: 9,
    sanitizedDeclarations: 7
};
varDeclCounts_forTest_Dir['src/index.js'] = {
    numDeclarations: 3,
    numVariableDeclarators: 3,
    sanitizedDeclarations: 3
};
varDeclCounts_forTest_Dir['test/default.test.js'] = {
    numDeclarations: 3,
    numVariableDeclarators: 3,
    sanitizedDeclarations: 3
};
const accessRequireMapping :FileDataMap<AccessRequire2WayMap> = {}








let iav =(name:string) => `_Import_Access_Variable_for_${name}`;

accessRequireMapping['index.js']={};
accessRequireMapping['lib/index.js']={};
accessRequireMapping['lib.js']={};
accessRequireMapping['src/index.js']={};
accessRequireMapping['test/default.test.js']={};



accessRequireMapping['index.js'][''] = '';

accessRequireMapping['index.js']['chai'] = iav('chai');
accessRequireMapping['index.js'][iav('chai')] = 'chai';

accessRequireMapping['index.js']['./src/index.js'] = iav('__src_index');
accessRequireMapping['index.js'][iav('__src_index')] = './src/index.js';

accessRequireMapping['index.js']['./lib.js'] = iav('__lib');
accessRequireMapping['index.js'][iav('__lib')] = './lib.js';



// accessRequireMapping['lib/index.js'][''] = iav('');
// accessRequireMapping['lib/index.js'][iav('')] = '';

accessRequireMapping['lib.js']['./package.json'] = iav('__package');
accessRequireMapping['lib.js'][iav('__package')] = './package.json';

accessRequireMapping['lib.js']['lodash'] = iav('lodash');
accessRequireMapping['lib.js'][iav('lodash')] = 'lodash';


accessRequireMapping['lib.js']['mocha'] = iav('mocha');
accessRequireMapping['lib.js'][iav('mocha')] = 'mocha';

accessRequireMapping['test/default.test.js']['../lib/index.js'] = iav('___lib_index');
accessRequireMapping['test/default.test.js'][iav('___lib_index')] = '../lib/index.js';






export {importMappings_forTest_Dir, varDeclCounts_forTest_Dir,accessRequireMapping}