import {it} from 'mocha'
import {expect} from 'chai'
import {ACTUAL, EXPECTED, test_dir} from "../index";
import {parseScript, Program} from "esprima";
import {readFileSync, writeFileSync} from "fs";
import shebangRegex from "shebang-regex";
import {Transformer} from "../src/transformations/Transformer";

import {transformImport} from "../src/transformations/import_transformations/visitors/import_replacement";
import {TransformableProject, projectReader, JSFile, requireStringSanitizer, flattenDecls, accessReplace} from "../src";
import {generate} from "escodegen";
import relative from "relative";

let project: TransformableProject;

import {resolve} from 'path'
import path from 'path'

import pathParse from "path-parse";


let projstr = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/fixtures/test_dir`;
project = projectReader(projstr);
let jsIndex = project.getJS('index.js')
let libIndex = project.getJS('lib/index.js')



describe('Testing OO version ', () => {


    it('Test AST read-in correctly', () => {

        project = projectReader(test_dir);
        project.forEachSource((e: JSFile) => {
            if (e.isSource()) {

                let file = readFileSync(e.getAbsolute()).toString()
                file = shebangRegex.test(file)
                    ? file.replace(shebangRegex.exec(file)[0], '')
                    : file
                let ast: Program;
                try {
                    ast = parseScript(file);
                } catch (e) {
                    console.log(`ERROR IN FILE file: ${e.getAbsolute} could not parse :${e}`)
                }
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
    });

})


function wipeShebang(text: string): string {
    if (shebangRegex.test(text)) {
        let shebang = shebangRegex.exec(this.text)[0].toString()
        return text.replace(shebang, '');
    }
    return text;
}

describe('Testing various sanitize procedures', () => {

    it('Require String Tests', () => {
        let actual: TransformableProject = projectReader(test_dir)
        let expected: TransformableProject = projectReader(`${EXPECTED}/requireString/`);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']


        let transformer = Transformer.ofProject(actual);
        transformer.transform(requireStringSanitizer)


        listOfFiles.forEach((file: string) => {
            let actualFile: JSFile = actual.getJS(file);
            let expectedFile: JSFile = expected.getJS(file)
            expect(expectedFile.makeString()).to.be.equal(actualFile.makeString());
        });


    });

    it('VariableDeclaration Flattening', () => {
        //flattenDecls
        let inputProjectDir = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/actual/flattenActual/`
        let expectedProjDir = `${EXPECTED}/flattener`;
        let actual: TransformableProject = projectReader(inputProjectDir)
        let expected: TransformableProject = projectReader(expectedProjDir);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']


        let transformer = Transformer.ofProject(actual);
        transformer.transform(flattenDecls)


        listOfFiles.forEach((file: string) => {
            let actualFile: JSFile = actual.getJS(file);
            let expectedFile: JSFile = expected.getJS(file)
            expect(expectedFile.makeString()).to.be.equal(actualFile.makeString(), `DECL FLATTEN ERR   ${actualFile.getAbsolute()}`);
        });


    });

    //
    it('Access Replacement', () => {
        //AccessReplace
        let actualProj: TransformableProject = projectReader(`/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/actual/accessReplace`)
        let expectedProj: TransformableProject = projectReader(`${EXPECTED}/accessReplace/`);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']

        let transformer = Transformer.ofProject(actualProj);
        transformer.transform(accessReplace);

        listOfFiles.forEach((file: string) => {
            let expected: string, actual: string

            let actualFile: JSFile = actualProj.getJS(file);
            let expectedFile: JSFile = expectedProj.getJS(file);

            expected = expectedFile.makeString();
            actual = actualFile.makeString();

            expect(actual)
                .to.be.equal(expected, `in file ${actualFile.getAbsolute()}`);
        });
    });

    it('Import Transformations', () => {
        //AccessReplace

        let actualProj: TransformableProject = projectReader(`/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/actual/importTransform`)

        let expectedProj: TransformableProject = projectReader(`/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/res/expected/imports`, 'module');

        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']

        let transformer = Transformer.ofProject(actualProj);
        transformer.transform(accessReplace);
        transformer.transform(transformImport);


        listOfFiles.forEach((file: string) => {
            let expected: string, actual: string

            let actualFile: JSFile = actualProj.getJS(file);

            let expectedFile: JSFile = expectedProj.getJS(file);
            try{
            expected = expectedFile.makeString();
        }catch(e){
                console.log(e)
                console.log(file)
                throw e;
            }
            actual = actualFile.makeString();
            expect(actual)
                .to.be.equal(expected, `in file ${file}`);
        });

    });


});


