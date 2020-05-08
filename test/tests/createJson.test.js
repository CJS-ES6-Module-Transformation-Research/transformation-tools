Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var project_representation_1 = require("../../src/abstract_representation/project_representation");
var index_1 = require("../index");
var Transformer_1 = require("../../src/transformations/Transformer");
var visitors_1 = require("../../src/transformations/sanitizing/visitors");
var data_dir = index_1.test_root + "/sanitize/json_creator/";
mocha_1.describe("JSON Require Creation Testing", function () {
    mocha_1.it('', function () {
        for (var i = 0; i < 2; i++) {
            var _loop_1 = function (j) {
                var fName = "js-" + i + "_json-" + j;
                // const ex = `${data_dir}${fName}_expected`;
                try {
                    // console.log((`${data_dir}${fName}`))
                    var transformer = void 0;
                    var actualProj = void 0;
                    var expectedProj_1;
                    try {
                        actualProj = project_representation_1.projectReader("" + data_dir + fName + "_actual");
                        expectedProj_1 = project_representation_1.projectReader("" + data_dir + fName + "_expected");
                        transformer = Transformer_1.Transformer.ofProject(actualProj);
                    }
                    catch (e2) {
                        console.log('e2');
                        console.log(e2);
                        throw e2;
                    }
                    transformer.transformWithProject(visitors_1.jsonRequire);
                    var actFiles = actualProj.getJSNames().sort();
                    var expFiles = expectedProj_1.getJSNames().sort();
                    console.log(fName);
                    console.log("a" + actFiles.length);
                    console.log("e" + expFiles.length);
                    chai_1.expect(actFiles).to.be.deep.equal(expFiles, actFiles.length + ' ' + expFiles.length + " file: " + fName);
                    console.log(actualProj.getJSNames().sort());
                    console.log(expectedProj_1.getJSNames().sort());
                    actualProj.forEachSource(function (js) {
                        var expected = expectedProj_1.getJS(js.getRelative());
                        chai_1.expect(js.makeString()).to.be.equal(expected.makeString());
                    });
                    // if (existsSync(out)) {
                    //     rmdirSync(out, {recursive: true});
                    // }
                    // try {
                    //     actualProj.writeOutNewDir(out)
                    // } catch (e3) {
                    //     console.log('e3')
                    //     console.log(e3)
                    //     throw e3;
                    // }
                    // const expectedProj = projectReader(`${data_dir}fname_expected`)
                }
                catch (err) {
                    console.log("error in project " + data_dir + fName + "\n            ERROR IS " + err + "\n\n\n");
                    throw err;
                }
            };
            for (var j = 0; j < 2; j++) {
                _loop_1(j);
            }
        }
    });
});
