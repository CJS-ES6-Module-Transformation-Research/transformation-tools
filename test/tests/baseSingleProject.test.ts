import {it} from 'mocha'
import {expect} from 'chai'
import shebangRegex from "shebang-regex";
 import {

    requireStringSanitizer,
    flattenDecls,
    accessReplace,
    jsonRequire,
    collectDefaultObjectAssignments
} from "../../src";
import {project as PROJ_DIR} from '../../index'
import {project_test_dirs as directories, test_root} from '../index';
import {transformImport} from "../../src/transformations/import_transformations/visitors/import_replacement";

let project: TransformableProject;

let projstr = `${PROJ_DIR}/test/res/fixtures/test_dir`;
project = projectReader(projstr);
let jsIndex = project.getJS('index.js')
let libIndex = project.getJS('lib/index.js')



function wipeShebang(text: string): string {
    if (shebangRegex.test(text)) {
        let shebang = shebangRegex.exec(this.text)[0].toString()
        return text.replace(shebang, '');
    }
    return text;
}

//
describe('Testing various sanitize procedures within a project', () => {
//
    it('Require String Tests', () => {
        let actual: TransformableProject = projectReader(directories['untouched'])
        // let expected: TransformableProject = projectReader(`${EXPECTED}/requireString/`);
        let expected: TransformableProject = projectReader(directories['requireString']);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']


        let transformer = Transformer.ofProject(actual);
        transformer.transform(requireStringSanitizer)


        listOfFiles.forEach((file: string) => {
            let actualFile: JSFile = actual.getJS(file);
            let expectedFile: JSFile = expected.getJS(file)
            expect(actualFile.makeString()).to.be.equal(expectedFile.makeString());
        });


    });
//

    it('JSON Require Transforming', () => {
        //jsonRequire
        // let inputProjectDir = `${PROJ_DIR}/test/res/actual/flattenActual/`
        // let expectedProjDir = `${EXPECTED}/flattener`;
        let actual: TransformableProject = projectReader(directories['requireString'])
        let expected: TransformableProject = projectReader(directories['jsonRequireCreate']);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']


        let transformer = Transformer.ofProject(actual);
        transformer.transformWithProject(jsonRequire)


        listOfFiles.forEach((file: string) => {
            let actualFile: JSFile = actual.getJS(file);
            let expectedFile: JSFile = expected.getJS(file)
            expect(expectedFile.makeString()).to.be.equal(actualFile.makeString(), ` ${actualFile.getAbsolute()}`);
        });


    });


    it('VariableDeclaration Flattening', () => {
        //flattenDecls
        // let inputProjectDir = `${PROJ_DIR}/test/res/actual/flattenActual/`
        // let expectedProjDir = `${EXPECTED}/flattener`;
        let actual: TransformableProject = projectReader(directories['jsonRequireCreate'])
        let expected: TransformableProject = projectReader(directories['declFlatten']);
        let listOfFiles: string[] = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ]
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
        //AccessReplace${
        let actualProj: TransformableProject = projectReader(directories['declFlatten'])
        let expectedProj: TransformableProject = projectReader(directories['accessReplace']);
        let listOfFiles: string[] = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ]
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


    it('exports flatten', () => {
         let actualProj: TransformableProject = projectReader(directories['accessReplace'])
        let expectedProj: TransformableProject = projectReader(directories['module_exports_flatten']);
        let listOfFiles: string[] = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ]


        let transformer = Transformer.ofProject(actualProj);
        transformer.transform(collectDefaultObjectAssignments);

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


//
    it('Import Transformations', () => {

        let actualProj: TransformableProject = projectReader(directories['module_exports_flatten'])

        let expectedProj: TransformableProject = projectReader(directories['import_main'], 'module');

        let listOfFiles: string[] = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.export.js',
            'test/test_dat.json.export.js'
        ]
        let transformer = Transformer.ofProject(actualProj);
        transformer.transform(transformImport);


        listOfFiles.forEach((file: string) => {
            let expected: string, actual: string

            let actualFile: JSFile = actualProj.getJS(file);

            let expectedFile: JSFile = expectedProj.getJS(file);
            try {
                expected = expectedFile.makeString();
            } catch (e) {
                // console.log(e)
                // console.log(file)
                throw e;
            }
            actual = actualFile.makeString();
            expect(actual)
                .to.be.equal(expected, `in file ${file} `);
        });
    });
});


describe('Misc', () => {

    it('Test Write-Out for shebangs', () => {
        projectReader(directories['untouched']).forEachSource((e) => {
            if (e.getSheBang()) {
                console.log(`SHEBANG DETECTED: ${e.getSheBang()}`)
                let out = e.makeString()

                let shebang = shebangRegex.test(out)
                expect(shebang).to.be.eq(true,e.getAbsolute());
                expect(shebangRegex.test(out)).to.be.true;
                expect(e.getSheBang().trim()).to.be.equal(shebangRegex.exec(out)[0].toString().trim())
            }
        })
    });
});

