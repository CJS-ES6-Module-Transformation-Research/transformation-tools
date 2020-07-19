Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const fs_1 = require("fs");
const project_representation_1 = require("../../src/abstract_representation/project_representation");
const Transformer_1 = require("../../src/transformations/Transformer");
const visitors_1 = require("../../src/transformations/sanitizing/visitors");
const testFile_dir = "/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/sanitize/qccess_replace";
const actualDir = `${testFile_dir}/js_files`;
const expectedDir = `${testFile_dir}/expected`;
// let filename: string,expectedName: string;
let files_in_dir = fs_1.readdirSync(`${testFile_dir}/js_files`);
mocha_1.describe('Sanitize: 3 Access Replace Test Files', () => {
    mocha_1.it('Test Files', () => {
        files_in_dir.forEach((proj) => {
            let eProj = project_representation_1.projectReader(`${expectedDir}/${proj}`);
            let aProj = project_representation_1.projectReader(`${actualDir}/${proj}`);
            let transformer = Transformer_1.Transformer.ofProject(aProj);
            transformer.transform(visitors_1.accessReplace);
            aProj.forEachSource((e) => {
                let actual = e.makeString();
                let expected = eProj.getJS(e.getRelative()).makeString();
                chai_1.expect(actual).to.be.equal(expected);
            });
        });
    });
    //
    // it('Test File: assignment_Property_Access_Assignment_Access', () => {
    //     filename = `assignment_Property_Access_Assignment_Access.js`
    //     setExpected();
    //     expect(expectedName).to.be.equal(`${filename}.expected`);
    //
    // });
    //
    //
    // it('Test File: assignment_Invocation_Access', () => {
    //     filename = `assignment_Invocation_Access.js`
    //     setExpected();
    //     expect(expectedName).to.be.equal(`${filename}.expected`);
    //
    // });
    //
    //
    // it('Test File: decons_Declare', () => {
    //     filename = `decons_Declare.js`
    //
    // });
    //
    //
    // it('Test File: decons_Invoke_Declare', () => {
    //     filename = `decons_Invoke_Declare.js`
    //
    // });
    //
    //
    // it('Test File: decons_Prop_Access_Declare', () => {
    //     filename = `decons_Prop_Access_Declare.js`
    //
    // });
    //
    //
    // it('Test File: for_Access', () => {
    //     filename = `for_Access.js`
    //
    // });
    //
    //
    // it('Test File: for_Access_With_Body_Decl', () => {
    //     filename = `for_Access_With_Body_Decl.js`
    //
    // });
    //
    //
    // it('Test File: for_Invoke_Access', () => {
    //     filename = `for_Invoke_Access.js`
    //
    // });
    //
    //
    // it('Test File: for_Multi_Require_Prop_Access', () => {
    //     filename = `for_Multi_Require_Prop_Access.js`
    //
    // });
    //
    //
    // it('Test File: for_Prop_Access', () => {
    //     filename = `for_Prop_Access.js`
    //
    // });
    //
    //
    // it('Test File: func_Decl_Require_Invoke_In_Body', () => {
    //     filename = `func_Decl_Require_Invoke_In_Body.js`
    //
    // });
    //
    //
    // it('Test File: if_Invoke_As_Condition', () => {
    //     filename = `if_Invoke_As_Condition.js`
    //
    // });
    //
    //
    // it('Test File: if_Invoke_Condition_Error_Creation_Call', () => {
    //     filename = `if_Invoke_Condition_Error_Creation_Call.js`
    //
    // });
    //
    //
    // it('Test File: if_Invoke_Condition_Error_Require_Prop_Access', () => {
    //     filename = `if_Invoke_Condition_Error_Require_Prop_Access.js`
    //
    // });
    //
    //
    // it('Test File: if_Invoke_Error_Invoke', () => {
    //     filename = `if_Invoke_Error_Invoke.js`
    //
    // });
    //
    //
    // it('Test File: if_Require_Condition', () => {
    //     filename = `if_Require_Condition.js`
    //
    // });
    //
    //
    // it('Test File: property_Access_Assignment_Access', () => {
    //     filename = `property_Access_Assignment_Access.js`
    //
    // });
    //
    //
    // it('Test File: property_Access_Assignment_Property_Access', () => {
    //     filename = `property_Access_Assignment_Property_Access.js`
    //
    // });
    //
    //
    // it('Test File: property_Access_Assingnment_Invocation_Access', () => {
    //     filename = `property_Access_Assingnment_Invocation_Access.js`
    //
    // });
    //
    //
    // it('Test File: top_Level_Invoke_No_Args', () => {
    //     filename = `top_Level_Invoke_No_Args.js`
    //
    // });
    //
    //
    // it('Test File: top_Level_Invoke_With_Args', () => {
    //     filename = `top_Level_Invoke_With_Args.js`
    //
    // });
    //
    //
    // it('Test File: two_Assignments_Expect_Same_Access_Variable', () => {
    //     filename = `two_Assignments_Expect_Same_Access_Variable.js`
    //
    // });
    //
    //
    // it('Test File: two_Assignments_One_Access_Expect_Same_Access_Variable', () => {
    //     filename = `two_Assignments_One_Access_Expect_Same_Access_Variable.js`
    //
    // });
    //
    //
    // it('Test File: two_Assignments_One_Invoke_Expect_Same_Access_Variable', () => {
    //     filename = `two_Assignments_One_Invoke_Expect_Same_Access_Variable.js`
    //
    // });
});
