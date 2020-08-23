

import {JSFile} from "../../src/abstract_fs_v2/JSv2";
import {accessReplace} from "../../src/transformations/sanitizing/visitors";
import {createProject} from "../index";
import {TEST_DIR} from "../index";
import {join} from "path";
import { expect } from "chai";
const pth = join(TEST_DIR ,'test_resources/sanitize/qccess_replace')














 	 describe('access_replace_', ()=>{


	 it('assignment_Property_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','assignment_Property_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','assignment_Property_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            }, 'testGen');
});

	 it('assignment_Property_Access_Assignment_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','assignment_Property_Access_Assignment_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','assignment_Property_Access_Assignment_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('assingnment_Invocation_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','assingnment_Invocation_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','assingnment_Invocation_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('for_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','for_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','for_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('for_Access_With_Body_Decl', ()=>{ 

            let eProj =  createProject( join(pth,'expected','for_Access_With_Body_Decl') ,false)
            let aProj =   createProject(join(pth ,'js_files','for_Access_With_Body_Decl'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('for_Invoke_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','for_Invoke_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','for_Invoke_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});



	 it('for_Prop_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','for_Prop_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','for_Prop_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('func_Decl_Require_Invoke_In_Body', ()=>{ 

            let eProj =  createProject( join(pth,'expected','func_Decl_Require_Invoke_In_Body') ,false)
            let aProj =   createProject(join(pth ,'js_files','func_Decl_Require_Invoke_In_Body'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('if_Invoke_As_Condition', ()=>{ 

            let eProj =  createProject( join(pth,'expected','if_Invoke_As_Condition') ,false)
            let aProj =   createProject(join(pth ,'js_files','if_Invoke_As_Condition'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('if_Invoke_Condition_Error_Creation_Call', ()=>{ 

            let eProj =  createProject( join(pth,'expected','if_Invoke_Condition_Error_Creation_Call') ,false)
            let aProj =   createProject(join(pth ,'js_files','if_Invoke_Condition_Error_Creation_Call'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('if_Invoke_Condition_Error_Require_Prop_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','if_Invoke_Condition_Error_Require_Prop_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','if_Invoke_Condition_Error_Require_Prop_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('if_Invoke_Error_Invoke', ()=>{ 

            let eProj =  createProject( join(pth,'expected','if_Invoke_Error_Invoke') ,false)
            let aProj =   createProject(join(pth ,'js_files','if_Invoke_Error_Invoke'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('if_Require_Condition', ()=>{ 

            let eProj =  createProject( join(pth,'expected','if_Require_Condition') ,false)
            let aProj =   createProject(join(pth ,'js_files','if_Require_Condition'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('property_Access_Assignment_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','property_Access_Assignment_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','property_Access_Assignment_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('property_Access_Assignment_Property_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','property_Access_Assignment_Property_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','property_Access_Assignment_Property_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('property_Access_Assingnment_Invocation_Access', ()=>{ 

            let eProj =  createProject( join(pth,'expected','property_Access_Assingnment_Invocation_Access') ,false)
            let aProj =   createProject(join(pth ,'js_files','property_Access_Assingnment_Invocation_Access'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('top_Level_Invoke_No_Args', ()=>{ 

            let eProj =  createProject( join(pth,'expected','top_Level_Invoke_No_Args') ,false)
            let aProj =   createProject(join(pth ,'js_files','top_Level_Invoke_No_Args'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('top_Level_Invoke_With_Args', ()=>{ 

            let eProj =  createProject( join(pth,'expected','top_Level_Invoke_With_Args') ,false)
            let aProj =   createProject(join(pth ,'js_files','top_Level_Invoke_With_Args'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('two_Assignments_Expect_Same_Access_Variable', ()=>{ 

            let eProj =  createProject( join(pth,'expected','two_Assignments_Expect_Same_Access_Variable') ,false)
            let aProj =   createProject(join(pth ,'js_files','two_Assignments_Expect_Same_Access_Variable'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('two_Assignments_One_Access_Expect_Same_Access_Variable', ()=>{ 

            let eProj =  createProject( join(pth,'expected','two_Assignments_One_Access_Expect_Same_Access_Variable') ,false)
            let aProj =   createProject(join(pth ,'js_files','two_Assignments_One_Access_Expect_Same_Access_Variable'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});

	 it('two_Assignments_One_Invoke_Expect_Same_Access_Variable', ()=>{ 

            let eProj =  createProject( join(pth,'expected','two_Assignments_One_Invoke_Expect_Same_Access_Variable') ,false)
            let aProj =   createProject(join(pth ,'js_files','two_Assignments_One_Invoke_Expect_Same_Access_Variable'),false)


             aProj.forEachSource(accessReplace)

            aProj.forEachSource((e) => {
                let actual = e.makeSerializable().fileData;
                let expected = eProj.getJS(e.getRelative())
                    .makeSerializable().fileData;
              
                    expect(actual).to.be.equal(expected, e.getRelative() );
              
            });
});
	});