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
                try {
                    // console.log((`${data_dir}${fName}`))
                    var transformer = void 0;
                    var actualProj_1;
                    var expectedProj_1;
                    try {
                        actualProj_1 = project_representation_1.projectReader("" + data_dir + fName + "_actual");
                        expectedProj_1 = project_representation_1.projectReader("" + data_dir + fName + "_expected");
                        transformer = Transformer_1.Transformer.ofProject(actualProj_1);
                    }
                    catch (e2) {
                        console.log('e2');
                        console.log(e2);
                        throw e2;
                    }
                    transformer.transformWithProject(visitors_1.jsonRequire);
                    var actFiles = actualProj_1.getJSNames().sort();
                    var expFiles = expectedProj_1.getJSNames().sort();
                    console.log(fName);
                    console.log("a" + actFiles.length);
                    console.log("e" + expFiles.length);
                    console.log(actualProj_1.getJSNames().sort());
                    console.log(expectedProj_1.getJSNames().sort());
                    console.log('expecting sizes');
                    chai_1.expect(actFiles).to.be.deep.equal(expFiles, actFiles.length + ' ' + expFiles.length + " file: " + fName);
                    expectedProj_1.forEachSource(function (e) { return console.log(e.getRelative()); });
                    actualProj_1.forEachSource(function (e) { return console.log(e.getRelative()); });
                    actFiles.forEach(function (f) {
                        var expected = expectedProj_1.getJS(f).makeString();
                        var actual = actualProj_1.getJS(f).makeString();
                        chai_1.expect(actual).to.be.equal(expected);
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
                console.log("\n\tend of " + fName + "\n\n\n\n\n--------------------------------------------------------------------------------\n\n\n\n\n");
            };
            for (var j = 0; j < 2; j++) {
                _loop_1(j);
            }
        }
    });
});
