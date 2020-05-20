import {generate} from "escodegen";
import {Transformer, TransformFunction} from './src/transformations/Transformer';
import {JSFile, projectReader} from './src/abstract_representation/project_representation/index';
import {Visitor, VisitorOption} from "estraverse";
import {
    AssignmentExpression,
    BlockStatement, ClassExpression,
    DebuggerStatement,
    Directive,
    EmptyStatement,
    MemberExpression, ModuleDeclaration,
    Node,
    Statement,
    VariableDeclaration,
    VariableDeclarator
} from "estree";
import {parseScript} from "esprima";
import {_transformBaseExports} from "./src/transformations/export_transformations/visitors/exportTransformMain";


let filesinExportsTests = [`obj_to_name`,
    `primitiive_to_name`,
    `anon_default_arrow`,
    `anon_default_func`,
    `assign_arrow_to_default_then_assign_name`,
    `assign_func_to_default_obj_then_add_name_with_func_name`,
    `assign_func_to_default_then_add_name_with_func_anon`,
    `class_default_assign`,
    `class_named_assign`,
    `identifier_soup_1`,
    `mixed_mnames`,
    `multiple_names_assigned_prim`,
    `multiple_names_objs`,
    `name_collision_on_declared_func_name`,
    `name_collision_onpredeclared_anon_func`]

let projectStr = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/export/export_test_files/simple_suite`




let project =
    projectReader(`/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/export/export_test_files/simple_suite/name_collision_on_declared_func_name/`);
    // projectReader(`/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform/test/export/export_test_files/simple_suite/obj_to_name/`);
let transformer = Transformer.ofProject(project)




transformer.transform(_transformBaseExports)


project.forEachSource(js => {
    try{
        console.log((js.makeString()))
        // console.log(generate(js.getAST()))
        // console.log((js.getAST()))
    }catch (e) {        console.log(generate(js.getAST()))

        console.log("error: "+ +e)
throw e
    }
})
