Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mocha_1 = require("mocha");
var fs_1 = require("fs");
var testFile_dir = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/sanitize/qccess_replace/js_files";
var filename;
var expectedName;
var files_in_dir = fs_1.readdirSync(testFile_dir);
function setExpected() {
    expectedName = filename + ".expected";
}
mocha_1.describe('Access Replace Test Files', function () {
    mocha_1.it('Test File: assignment_Property_Access', function () {
        filename = "assignment_Property_Access.js";
        setExpected();
        chai_1.expect(expectedName).to.be.equal(filename + ".expected");
    });
    mocha_1.it('Test File: assignment_Property_Access_Assignment_Access', function () {
        filename = "assignment_Property_Access_Assignment_Access.js";
        setExpected();
        chai_1.expect(expectedName).to.be.equal(filename + ".expected");
    });
    mocha_1.it('Test File: assignment_Invocation_Access', function () {
        filename = "assignment_Invocation_Access.js";
        setExpected();
        chai_1.expect(expectedName).to.be.equal(filename + ".expected");
    });
    mocha_1.it('Test File: decons_Declare', function () {
        filename = "decons_Declare.js";
    });
    mocha_1.it('Test File: decons_Invoke_Declare', function () {
        filename = "decons_Invoke_Declare.js";
    });
    mocha_1.it('Test File: decons_Prop_Access_Declare', function () {
        filename = "decons_Prop_Access_Declare.js";
    });
    mocha_1.it('Test File: for_Access', function () {
        filename = "for_Access.js";
    });
    mocha_1.it('Test File: for_Access_With_Body_Decl', function () {
        filename = "for_Access_With_Body_Decl.js";
    });
    mocha_1.it('Test File: for_Invoke_Access', function () {
        filename = "for_Invoke_Access.js";
    });
    mocha_1.it('Test File: for_Multi_Require_Prop_Access', function () {
        filename = "for_Multi_Require_Prop_Access.js";
    });
    mocha_1.it('Test File: for_Prop_Access', function () {
        filename = "for_Prop_Access.js";
    });
    mocha_1.it('Test File: func_Decl_Require_Invoke_In_Body', function () {
        filename = "func_Decl_Require_Invoke_In_Body.js";
    });
    mocha_1.it('Test File: if_Invoke_As_Condition', function () {
        filename = "if_Invoke_As_Condition.js";
    });
    mocha_1.it('Test File: if_Invoke_Condition_Error_Creation_Call', function () {
        filename = "if_Invoke_Condition_Error_Creation_Call.js";
    });
    mocha_1.it('Test File: if_Invoke_Condition_Error_Require_Prop_Access', function () {
        filename = "if_Invoke_Condition_Error_Require_Prop_Access.js";
    });
    mocha_1.it('Test File: if_Invoke_Error_Invoke', function () {
        filename = "if_Invoke_Error_Invoke.js";
    });
    mocha_1.it('Test File: if_Require_Condition', function () {
        filename = "if_Require_Condition.js";
    });
    mocha_1.it('Test File: property_Access_Assignment_Access', function () {
        filename = "property_Access_Assignment_Access.js";
    });
    mocha_1.it('Test File: property_Access_Assignment_Property_Access', function () {
        filename = "property_Access_Assignment_Property_Access.js";
    });
    mocha_1.it('Test File: property_Access_Assingnment_Invocation_Access', function () {
        filename = "property_Access_Assingnment_Invocation_Access.js";
    });
    mocha_1.it('Test File: top_Level_Invoke_No_Args', function () {
        filename = "top_Level_Invoke_No_Args.js";
    });
    mocha_1.it('Test File: top_Level_Invoke_With_Args', function () {
        filename = "top_Level_Invoke_With_Args.js";
    });
    mocha_1.it('Test File: two_Assignments_Expect_Same_Access_Variable', function () {
        filename = "two_Assignments_Expect_Same_Access_Variable.js";
    });
    mocha_1.it('Test File: two_Assignments_One_Access_Expect_Same_Access_Variable', function () {
        filename = "two_Assignments_One_Access_Expect_Same_Access_Variable.js";
    });
    mocha_1.it('Test File: two_Assignments_One_Invoke_Expect_Same_Access_Variable', function () {
        filename = "two_Assignments_One_Invoke_Expect_Same_Access_Variable.js";
    });
});
