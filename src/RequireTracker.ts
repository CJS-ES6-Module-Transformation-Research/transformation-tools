import {Identifier, VariableDeclaration, VariableDeclarator} from "estree";

export class RequireTracker {
    private readonly fromVarIDMap: { [id: string]: requireDecl } = {}
    private readonly fromModuleMap: { [id: string]: requireDecl } = {}
    private declList: VariableDeclaration[] = [] ;

    constructor() {
        this.fromModuleMap = {};
        this.fromVarIDMap = {};
    }

    insert(varName: string, module: string, computed: boolean) {
        // if (this.fromVarIDMap[module]) {
        //     throw new Error(`module identifier ${module} already seen with var ${varName}`)
        // } else {
            this.insertBlind(varName, module, computed)
        // }
    }

    insertBlind(varName: string, module: string, computed: boolean) {

        let decl: requireDecl = {
            identifier: {type: "Identifier", name: varName},
            module_identifier: module,
            computed: computed
        }
        this.pushToDeclList(makeDecl(decl.identifier, decl.module_identifier ))
        this.fromVarIDMap[varName] = decl;
        this.fromModuleMap[module] = decl;
    }

    getIfExists(module_identifier: string): requireDecl | null {
        return this.fromModuleMap[module_identifier]
    }

    getFromVar(module_identifier: string): requireDecl | null {
        return this.fromVarIDMap[module_identifier]
    }

    mapString(val: number = 3) {
        // let rt_val = {}
        // for (let key in this.fromModuleMap) {
        //     rt_val[key] = this.fromModuleMap[key].identifier.name
        // }
        return JSON.stringify(this.fromModuleMap, null, val)
    }

   private  pushToDeclList(varDecl: VariableDeclaration) {
        this.declList.push(varDecl)

    }

    getList() {
        return this.declList
    }
}

interface requireDecl {
    module_identifier: string
    identifier: Identifier
    computed: boolean
}
function makeDecl(id:Identifier, mod_id:string):VariableDeclaration {
     let variableDeclarator:VariableDeclarator = {
        id: id ,
        type: "VariableDeclarator",
        init:{
            type:"CallExpression",
            arguments:[{type:"Literal",value:`${mod_id}`}],
            callee:{type:"Identifier",name:"require"}
        }
    }
  return  {
        declarations: [variableDeclarator], kind: 'const' , type: "VariableDeclaration"

    }
}