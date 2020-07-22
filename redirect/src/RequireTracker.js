Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireTracker = void 0;
class RequireTracker {
    constructor() {
        this.fromVarIDMap = {};
        this.fromModuleMap = {};
        this.declList = [];
        this.fromModuleMap = {};
        this.fromVarIDMap = {};
    }
    insert(varName, module, computed) {
        // if (this.fromVarIDMap[module]) {
        //     throw new Error(`module identifier ${module} already seen with var ${varName}`)
        // } else {
        this.insertBlind(varName, module, computed);
        // }
    }
    insertBlind(varName, module, computed) {
        let decl = {
            identifier: { type: "Identifier", name: varName },
            module_identifier: module,
            computed: computed
        };
        this.pushToDeclList(makeDecl(decl.identifier, decl.module_identifier));
        this.fromVarIDMap[varName] = decl;
        this.fromModuleMap[module] = decl;
    }
    getIfExists(module_identifier) {
        return this.fromModuleMap[module_identifier];
    }
    getFromVar(module_identifier) {
        return this.fromVarIDMap[module_identifier];
    }
    mapString(val = 3) {
        // let rt_val = {}
        // for (let key in this.fromModuleMap) {
        //     rt_val[key] = this.fromModuleMap[key].identifier.name
        // }
        return JSON.stringify(this.fromModuleMap, null, val);
    }
    pushToDeclList(varDecl) {
        this.declList.push(varDecl);
    }
    getList() {
        return this.declList;
    }
}
exports.RequireTracker = RequireTracker;
function makeDecl(id, mod_id) {
    let variableDeclarator = {
        id: id,
        type: "VariableDeclarator",
        init: {
            type: "CallExpression",
            arguments: [{ type: "Literal", value: `${mod_id}` }],
            callee: { type: "Identifier", name: "require" }
        }
    };
    return {
        declarations: [variableDeclarator], kind: 'const', type: "VariableDeclaration"
    };
}
