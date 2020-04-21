import {ProcessProject} from '../src/abstract_representation/project_representation/FileProcessing';
import {TransformableProject} from '../src/abstract_representation/project_representation/FS'
import {JSFile} from '../src/abstract_representation/project_representation/JS'
import {it} from 'mocha'
import {expect} from 'chai'
import {EXPECTED, test_dir} from "../index";
import {parseScript, Program} from "esprima";
import {readFileSync} from "fs";
import shebangRegex from "shebang-regex";
import {Transformer} from "../src/transformations/Transformer";
import {requireStringSanitizer} from "../src/transformations/sanitizing/visitors/requireString";

import {createReqStringToolFromName} from "./JSTestTools";
import {flattenDecls} from "../src/transformations/sanitizing/visitors/declFlattener";
import {accessReplace} from "../src/transformations/sanitizing/visitors/accessReplacer";
import {transformImport} from "../src/transformations/import_transformations/visitors/import_replacement";

let project: TransformableProject = ProcessProject(test_dir);

let isJS = (pFile: any): pFile is JSFile => pFile

// project.forEach((e) => {
//     // if (e instanceof JSFile) {
//     //     (e.makeString())
//     // }
// })
describe('Testing OO version ', () => {
    it('Test AST read-in correctly', () => {


        project.forEachSource((e) => {
            if (e.isSource()) {
                // e.getAST()
                let file = readFileSync(e.getFull()).toString()
                file = shebangRegex.test(file)
                    ? file.replace(shebangRegex.exec(file)[0], '')
                    : file
                let ast: Program = parseScript(file)
                expect(ast)
                    .to.be.deep.equal((e as JSFile).getAST());
            }
        })
    });
    it('Test Write-Out for shebangs', () => {
        project.forEachSource((e) => {
            if (e.getSheBang()) {
                let out = e.makeString()
                let shebang = shebangRegex.test(out)
                expect(shebangRegex.test(out)).to.be.true;
                expect(e.getSheBang().trim()).to.be.equal(shebangRegex.exec(out)[0].toString().trim())
            }
        })
    })
})


// describe('Testing exports transformations for appropriate output on small inputs', () => {
//     it('Pass', () => {
//         expect(true).to.be.eq(true)
//     });
//     it('single named export', () => {
//         let data = new MockJSFile('module.exports = {hello}')
//         exportTransform(data)
//         let result
//             = data.getAST().body[0]
//         expect(generate(result)).to.be.eq('')
//
//     });
// })


/*
transformer.transform(requireStringSanitizer)
transformer.transform(flattenDecls)
transformer.transform(accessReplace)

transformer.rebuildNamespace()

transformer.transform(collectDefaultObjectAssignments)
transformer.transform(transformImport)
transformer.transform(exportTransform)
*/

function wipeShebang(text: string): string {
    if (shebangRegex.test(text)) {
        let shebang = shebangRegex.exec(this.text)[0].toString()
        return text.replace(shebang, '');
    }
    return text;
}

describe('Testing various sanitize procedures', () => {
    it('Pass', () => {
        let x = createReqStringToolFromName(project, 'src/index.js')

        expect(true).to.be.eq(true)
    });
    it('Require String Tests', () => {
        let actual: TransformableProject = ProcessProject(test_dir)
        let expected: TransformableProject = ProcessProject(`${EXPECTED}/requireString/`);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']


        let transformer = Transformer.ofProject(actual);
        transformer.transform(requireStringSanitizer)


        listOfFiles.forEach((file: string) => {
            let actualFile: JSFile = actual.getJS(file);
            let expectedFile: JSFile = expected.getJS(file)
            expect(expectedFile.makeString()).to.be.equal(actualFile.makeString());
        });


        // for(let key in toolMap){
        //     let val = toolMap[key]
        //      val.transformedRequireStrings = getAllRequireStringsAsList(val.file.getAST())
        // }
        //
        //
        // //Beginning of assertion code
        // for(let key in toolMap){
        //     let val = toolMap[key]
        //     for (let i = 0; i < val.transformedRequireStrings.length; i++){
        //         expect(importMappings[val.file.getRelative()]
        //             [val.preTfRequireStrings[i]])
        //             .to
        //             .be
        //             .eq(val.transformedRequireStrings[i],
        //                 `In file: ${val.file.getRelative()} ${val.preTfRequireStrings[i]}`)
        //     }
        // }
    });
    //
    //
    it('VariableDeclaration Flattening', () => {
        //flattenDecls

        let actual: TransformableProject = ProcessProject(test_dir)
        let expected: TransformableProject = ProcessProject(`${EXPECTED}/flattener/`);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']


        let transformer = Transformer.ofProject(actual);
        transformer.transform(flattenDecls)


        listOfFiles.forEach((file: string) => {
            let actualFile: JSFile = actual.getJS(file);
            let expectedFile: JSFile = expected.getJS(file)
            expect(expectedFile.makeString()).to.be.equal(actualFile.makeString(), `in file ${file}`);
        });


        // let project_tmp: TransformableProject = ProcessProject(test_dir)
        // let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']
        // let toolMap: ToolMap<TestingTool_VarDecFlat> = {};
        // listOfFiles
        //     .map((e) => createVarDeclToolFromName(project_tmp, e))
        //     .forEach((r) => {
        //         toolMap[r.name] = r;
        //     })
        // console.log()
        // for (let key in toolMap) {
        //     let val = toolMap[key]
        //     expect(declCounts[key].numDeclarations).to.be.equal(val.decls.numDeclarations)
        //     expect(declCounts[key].numVariableDeclarators).to.be.equal(val.decls.numVariableDeclarators)
        // }
        //
        //
        // let transformer = Transformer.ofProject(project_tmp);
        // transformer.transform(flattenDecls)
        //
        // toolMap = {};
        // listOfFiles
        //     .map((e) => createVarDeclToolFromName(project_tmp, e))
        //     .forEach((r) => {
        //         toolMap[r.name] = r;
        //     })
        //
        // console.log()
        // for (let key in toolMap) {
        //     let val = toolMap[key]
        //     expect(declCounts[key].sanitizedDeclarations).to.be.equal(val.decls.sanitizedDeclarations, `ERROR IN FILE: ${val.name}`)
        //     expect(declCounts[key].numVariableDeclarators).to.be.equal(val.decls.numVariableDeclarators, `ERROR IN FILE: ${val.name}`)
        // }
    });

    //
    it('Access Replacement', () => {
        //AccessReplace
        let actualProj: TransformableProject = ProcessProject(test_dir)
        let expectedProj: TransformableProject = ProcessProject(`${EXPECTED}/accessReplace/`);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']

        let transformer = Transformer.ofProject(actualProj);
        transformer.transform(requireStringSanitizer);
        transformer.transform(accessReplace);

        listOfFiles.forEach((file: string) => {
            let expected: string, actual: string

            let actualFile: JSFile = actualProj.getJS(file);
            let expectedFile: JSFile = expectedProj.getJS(file);

            expected = expectedFile.makeString();
            actual = actualFile.makeString();
            expect(actual)
                .to.be.equal(expected, `in file ${file}`);
        });
    });

    it('Import Transformations', () => {
        //AccessReplace

        let actualProj: TransformableProject = ProcessProject(test_dir)

        let expectedProj: TransformableProject = ProcessProject(`${EXPECTED}/imports/`, 'module');

        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']

        let transformer = Transformer.ofProject(actualProj);
        transformer.transform(requireStringSanitizer);
        transformer.transform(flattenDecls);
        transformer.transform(accessReplace);
        transformer.transform(transformImport);


        listOfFiles.forEach((file: string) => {
            let expected: string, actual: string

            let actualFile: JSFile = actualProj.getJS(file);

            let expectedFile: JSFile = expectedProj.getJS(file);

            expected = expectedFile.makeString();
            actual = actualFile.makeString();
            expect(actual)
                .to.be.equal(expected, `in file ${file}`);
        });

    });


    // it('Namespace Walker', () => {
    //     let project_tmp: TransformableProject = ProcessProject(test_dir)
    //     let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']
    // });
})
