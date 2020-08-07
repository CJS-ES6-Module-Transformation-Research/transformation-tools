import {traverse, Visitor, VisitorOption} from "estraverse";
import {VariableDeclarator, Identifier, Program, MemberExpression, Node} from "estree";
import {JSFile} from "./abstract_fs_v2/JSv2";
import {InfoTracker} from "./InfoTracker.js";
import {generate} from "escodegen";

function containsNode( nodelist: Node[], n: Node): boolean {
    let retVal = false;
    nodelist.forEach( v => {
        if ( v.type == n.type && generate(v) == generate(n)) { 
            retVal = true;
        }
    });
    return retVal;
}

function getReqPropertiesAccessed( ast: Program, listOfVars: Identifier[], mapOfRPIs: { [id: string]: ReqPropInfo } ): void {
    // let listOfProps = [];
    traverse(ast, {enter:(node,parent)=>{
                switch (node.type){
                    case "MemberExpression":
                        // console.log(node.object);
                        if( containsNode( listOfVars, node.object)) {
                            // listOfProps.push( node);
                            if (! mapOfRPIs[ (<Identifier> node.object).name]) {
                                mapOfRPIs[ (<Identifier> node.object).name] = { listOfAllPropsAccessed: [], listOfPropsCalledOrAccessed: []};
                            }
                            mapOfRPIs[ (<Identifier> node.object).name].listOfAllPropsAccessed.push( node)
                        }
                        break;
                }
            }});
    // return listOfProps;
}

function getPropsCalledOrAccd( ast: Program, mapOfRPIs: { [id: string]: ReqPropInfo } ): void {
    // let notPrimProps = []
    let nameS: string;
    traverse(ast, {enter:(node,parent)=>{
                switch (node.type){
                    case "MemberExpression":
                        if (! (node.object.type == "MemberExpression" && node.object.object.type == "Identifier"))
                            break;
                        nameS = (<Identifier> (<MemberExpression> node.object).object).name;
                        if( mapOfRPIs[ nameS] && containsNode( mapOfRPIs[nameS].listOfAllPropsAccessed, node.object)) {
                            // notPrimProps.push( node.object);
                            mapOfRPIs[ nameS].listOfPropsCalledOrAccessed.push( <MemberExpression> node.object);
                        }
                        break;
                    case "CallExpression":
                        if (! (node.callee.type == "MemberExpression" && node.callee.object.type == "Identifier"))
                            break;
                        nameS = (<Identifier> (<MemberExpression> node.callee).object).name;
                        if( mapOfRPIs[ nameS] && containsNode( mapOfRPIs[nameS].listOfAllPropsAccessed, node.callee)) {
                            // notPrimProps.push( node.callee);
                            mapOfRPIs[ nameS].listOfPropsCalledOrAccessed.push( node.callee);
                        }
                        break;
                }
            }});
    // return notPrimProps;
}

//  const reqPropertyInfoGather = (js: JSFile) => {
//     let ast = js.getAST()
//     let list =[]
//     let requireMgr:InfoTracker = js.getInfoTracker();
//     let listOfVars = requireMgr.getDeclarations().map(vardecl => <Identifier> (vardecl.declarations[0].id));
//
//     let rpis: { [id: string]: ReqPropInfo } = {};
//
//     getReqPropertiesAccessed( ast, listOfVars, rpis);
//     getPropsCalledOrAccd( ast, rpis);
//
//     requireMgr.setReqPropsAccessedMap( rpis);
//
// }

  interface ReqPropInfo {
    listOfAllPropsAccessed: MemberExpression[];
    listOfPropsCalledOrAccessed: MemberExpression[];
}

