Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRegistration = void 0;
const estraverse_1 = require("estraverse");
exports.requireRegistration = (js) => {
    let ast = js.getAST();
    let list = [];
    let requireMgr = js.getRequireTracker();
    let visitor = {
        leave: (node, parent) => {
            if (node.type === "VariableDeclaration" && parent.type === "Program") {
                if (node.declarations
                    && node.declarations[0]
                    && node.declarations[0].type === "VariableDeclarator"
                    && node.declarations[0]) {
                    let declarator = node.declarations[0];
                    let init = declarator.init;
                    if (declarator.id.type === "Identifier"
                        && init
                        && init.type === "CallExpression"
                        && init.callee.type === "Identifier"
                        && init.callee.name === "require"
                        && init.arguments
                        && init.arguments[0]
                        && init.arguments[0].type === "Literal") {
                        let require_string = init.arguments[0].value.toString();
                        list.push(require_string);
                        try {
                            requireMgr.insert(declarator.id.name, require_string, false);
                        }
                        catch (e) {
                            //should only get here if the code is bad
                            console.log(`Saw ${requireMgr.getIfExists(require_string)} in addition to identifier ${declarator.id.name} for the same module id.`);
                        }
                        return estraverse_1.VisitorOption.Remove;
                    }
                }
            }
        }
    };
    estraverse_1.traverse(ast, visitor);
};
