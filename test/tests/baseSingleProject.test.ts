import {it} from 'mocha'
import {expect} from 'chai'
import shebangRegex from "shebang-regex";
 import {

    requireStringSanitizer,
    flattenDecls,
    accessReplace,
    jsonRequire,
    objLiteralFlatten
} from "../../src";
import {project as PROJ_DIR} from '../../index'
import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {ProjectManager} from "../../src/abstract_fs_v2/ProjectManager";
import {mock_opts, project_test_dirs as directories } from '../index';
import {transformImport} from "../../src/transformations/import_transformations/visitors/import_replacement";

let project: ProjectManager;

let projstr = `${PROJ_DIR}/test/res/fixtures/test_dir`;
project = new ProjectManager(projstr,mock_opts);
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
describe('Testing various test_resources.sanitize procedures within a project', () => {
//
    it('Require String Tests', () => {
        let actual: ProjectManager = new ProjectManager(directories['untouched'],mock_opts)
        // let expected: TransformableProject = projectReader(`${EXPECTED}/requireString/`);
        let expected: ProjectManager =  new ProjectManager((directories['requireString']);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']


        let transformer = Transformer.ofProject(actual);
        transformer.transform(requireStringSanitizer)


        listOfFiles.forEach((file: string) => {
            let actualFile: JSFile = actual.getJS(file);
            let expectedFile: JSFile = expected.getJS(file)
            expect(actualFile.makeSerializable().fileData).to.be.equal(expectedFile.makeSerializable().fileData);
        });


    });
//

    it('JSON Require Transforming', () => {
        //jsonRequire
        // let inputProjectDir = `${PROJ_DIR}/test/test_resources.res/actual/flattenActual/`
        // let expectedProjDir = `${EXPECTED}/flattener`;
        let actual: ProjectManager =  new ProjectManager((directories['requireString'],mock_opts
        let expected: ProjectManager =  new ProjectManager((directories['jsonRequireCreate'],mock_opts);
        let listOfFiles: string[] = ['index.js', 'lib/index.js', 'lib.js', 'src/index.js', 'test/default.test.js']


        let transformer = Transformer.ofProject(actual);
        transformer.transformWithProject(jsonRequire)


        listOfFiles.forEach((file: string) => {
            let actualFile: JSFile = actual.getJS(file);
            let expectedFile: JSFile = expected.getJS(file)
            expect(expectedFile.makeSerializable().fileData).to.be.equal(actualFile.makeSerializable().fileData, ` ${actualFile.getAbsolute()}`);
        });


    });


    it('VariableDeclaration Flattening', () => {
        //flattenDecls
        // let inputProjectDir = `${PROJ_DIR}/test/test_resources.res/actual/flattenActual/`
        // let expectedProjDir = `${EXPECTED}/flattener`;
        let actual: ProjectManager =  new ProjectManager((directories['jsonRequireCreate'],mock_opts)
        let expected: ProjectManager =  new ProjectManager((directories['declFlatten'],mock_opts);
        let listOfFiles: string[] = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.test_resources.export.js',
            'test/test_dat.json.test_resources.export.js'
        ]
        let transformer = Transformer.ofProject(actual);
        transformer.transform(flattenDecls)


        listOfFiles.forEach((file: string) => {
            let actualFile: JSFile = actual.getJS(file);
            let expectedFile: JSFile = expected.getJS(file)
            expect(expectedFile.makeSerializable().fileData).to.be.equal(actualFile.makeSerializable().fileData, `DECL FLATTEN ERR   ${actualFile.getAbsolute()}`);
        });


    });

    //
    it('Access Replacement', () => {
        //AccessReplace${
        let actualProj: ProjectManager =  new ProjectManager((directories['declFlatten'], mock_opts);
        let expectedProj: ProjectManager =  new ProjectManager(directories['accessReplace'], mock_opts);
        let listOfFiles: string[] = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.test_resources.export.js',
            'test/test_dat.json.test_resources.export.js'
        ]
        let transformer = Transformer.ofProject(actualProj);
        transformer.transform(accessReplace);

        listOfFiles.forEach((file: string) => {
            let expected: string, actual: string

            let actualFile: JSFile = actualProj.getJS(file);
            let expectedFile: JSFile = expectedProj.getJS(file);

            expected = expectedFile.makeSerializable().fileData;
            actual = actualFile.makeSerializable().fileData;

            expect(actual)
                .to.be.equal(expected, `in file ${actualFile.getAbsolute()}`);
        });
    });


    it('exports flatten', () => {
         let actualProj: ProjectManager =  new ProjectManager((directories['accessReplace'],mock_opts);
        let expectedProj: ProjectManager =  new ProjectManager((directories['module_exports_flatten'],mock_opts);
        let listOfFiles: string[] = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.test_resources.export.js',
            'test/test_dat.json.test_resources.export.js'
        ]


        let transformer = Transformer.ofProject(actualProj);
        transformer.transform(objLiteralFlatten);

        listOfFiles.forEach((file: string) => {
            let expected: string, actual: string

            let actualFile: JSFile = actualProj.getJS(file);
            let expectedFile: JSFile = expectedProj.getJS(file);


            expected = expectedFile.makeSerializable().fileData;
            actual = actualFile.makeSerializable().fileData;


            expect(actual)
                .to.be.equal(expected, `in file ${actualFile.getAbsolute()}`);
        });
    });


//
    it('Import Transformations', () => {

        let actualProj: ProjectManager =  new ProjectManager((directories['module_exports_flatten'],mock_opts);

        let expectedProj: ProjectManager =  new ProjectManager((directories['import_main'], modmock);

        let listOfFiles: string[] = ['index.js',
            'lib/index.js',
            'lib.js',
            'src/index.js',
            'test/default.test.js',
            'package.json.test_resources.export.js',
            'test/test_dat.json.test_resources.export.js'
        ]
        let transformer = Transformer.ofProject(actualProj);
        transformer.transform(transformImport);


        listOfFiles.forEach((file: string) => {
            let expected: string, actual: string

            let actualFile: JSFile = actualProj.getJS(file);

            let expectedFile: JSFile = expectedProj.getJS(file);
            try {
                expected = expectedFile.makeSerializable().fileData;
            } catch (e) {
                // console.log(e)
                // console.log(file)
                throw e;
            }
            actual = actualFile.makeSerializable().fileData;
            expect(actual)
                .to.be.equal(expected, `in file ${file} `);
        });
    });
});


describe('Misc', () => {

    it('Test Write-Out for shebangs', () => {
        new ProjectManager((directories['untouched']).forEachSource((e) => {
            if (e.getSheBang()) {
                console.log(`SHEBANG DETECTED: ${e.getSheBang()}`)
                let out = e.makeSerializable().fileData

                let shebang = shebangRegex.test(out)
                expect(shebang).to.be.eq(true,e.getAbsolute());
                expect(shebangRegex.test(out)).to.be.true;
                expect(e.getSheBang().trim()).to.be.equal(shebangRegex.exec(out)[0].toString().trim())
            }
        })
    });
});

