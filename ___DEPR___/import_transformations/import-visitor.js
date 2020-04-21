Object.defineProperty(exports, "__esModule", { value: true });
var esprima_1 = require("esprima");
var estraverse_1 = require("estraverse");
var escodegen_1 = require("escodegen");
var importMaker = function (mylist, program) {
    mylist.forEach(function (report) {
        var body = report.varDeclarations.body;
        var variableDeclaration = report.varDeclarations.declaration;
        body.splice(body.indexOf(variableDeclaration), 1);
    });
    mylist.forEach(function (report) {
        var body = report.varDeclarations.body;
        var importDecl = createFromImportReport(report);
        body.splice(0, 0, importDecl);
    });
};
exports.importVisitor = function (importCollection) {
    return {
        leave: function (node, parent) {
            var deleteMe = false;
            var child;
            if (node.type === "VariableDeclaration") {
                //depr.sanitize should guarantee this is ok.
                child = node.declarations[0];
            }
            else {
                return;
            }
            if (child.init && child.init.type === "CallExpression" && child.init.callee.type === "Identifier" && child.init.callee.name === 'require') {
                var importString = "" + child.init.arguments[0].value;
                var imports_1 = [];
                var isNamed = false;
                if (child.id.type === "Identifier") {
                    //CREATE DEFAULT OR STAR IMPORT
                    imports_1.push(child.id.name);
                    deleteMe = true;
                }
                else if (child.id.type === "ObjectPattern") {
                    child.id.properties.forEach(function (property) {
                        var id = property.key.name;
                        imports_1.push(id);
                        deleteMe = true;
                    });
                    isNamed = true;
                }
                else {
                    throw new Error(child.type);
                }
                var body = void 0;
                if (parent.type === "Program" || parent.type === "BlockStatement") {
                    body = parent.body;
                }
                else {
                    //
                }
                var isTopLevel = parent.type === "Program" ? true : parent.type === "BlockStatement" ? false : null;
                if (isTopLevel === null) {
                    throw new Error("invalid isTopLevel");
                }
                var buildable = {
                    importPath: importString,
                    named: isNamed,
                    identifiers: imports_1,
                    varDeclarations: {
                        declaration: node,
                        body: body,
                        isTopLevel: isTopLevel
                    }
                };
                importCollection.push(buildable);
            }
        }
    };
};
function createFromImportReport(report) {
    return {
        type: "ImportDeclaration",
        specifiers: getSpecifiersFromReport(report),
        source: {
            type: "Literal",
            value: report.importPath
        }
    };
    function getSpecifiersFromReport(report) {
        var specifierArr = [];
        if (!report.named) {
            //default
            var defSpec = {
                type: "ImportDefaultSpecifier",
                local: {
                    type: "Identifier",
                    name: report.identifiers[0]
                }
            };
            specifierArr.push(defSpec);
        }
        else if (report.named) {
            report.identifiers.forEach(function (id) {
                var spec = {
                    type: "ImportSpecifier",
                    local: {
                        type: "Identifier",
                        name: id
                    },
                    imported: {
                        type: "Identifier",
                        name: id
                    }
                };
                specifierArr.push(spec);
            });
        }
        return specifierArr;
    }
}
var json = function (j) { return console.log(JSON.stringify(j, null, 3)); };
var program = "\n    \nconst x = require('x');\n    console.log('hello');\n    let w = 3;\n    const app2 = hello(x); \n    let {expect} = require('chai');;\n    var {expect,assert,beforeEach} = require('chai');\n    expect(x).to.be.equal(y)\n     var app = express()\n     \n    ";
var visitor = {
    enter: function (node, parentNode) {
    },
    leave: function (node, parentNode) {
    }
    // keys: replace()
};
var ast = esprima_1.parseScript(program);
estraverse_1.replace(ast, visitor);
// let imports: ImportTransformReport[] = []
// depr.ast = parseModule('import {x,y as z} from "importStr"' + "\n" + 'import q  from  "importStr"')
// traverse(depr.ast, importVisitor(imports))
// traverse(depr.ast, importVisitor(imports))
// depr.ast.body.filter((e:Node)=>e.type != "EmptyStatement")
exports.mutator_imports = {
    supplier: function () {
        var t = [];
        return t;
    },
    mutator: importMaker
};
// depr.ast.sourceType = "module"
// imports.forEach((e)=>{console.log( `${e.importPath}\t${e.identifiers}${e.named}`)} )
// json(imports)
// importMaker(imports, depr.ast.body)
// json(depr.ast)
// json(generate(depr.ast))
// json(generate(depr.ast  ))
// json(imports)
// console.log(JSON.stringify(parseScript('var {ImportTransformReport,y,ImportTransformReport } = require("asdf")'), null, 3))
var createImportMap = function () {
    return { importString: null, importNames: [], isObjectExpression: false };
};
// let asdf = new DeclWalker().walk([], depr.ast)
//
// class RemoveEmptyStatements extends Walker<null> {
//     constructor() {
//         super(true);
//     }
//
//     enter: (node: Node, parentNode: (Node | null)) => (VisitorOption | Node | void);
//     leave = function (node: Node) {
//         if (node.type === "EmptyStatement") {
//             return VisitorOption.Remove;
//         }
//     }
//
// }
//
// new RemoveEmptyStatements().walk(null, depr.ast)
console.log(escodegen_1.generate(ast));
//
// function createAnImportDeclaration(importData: ImportData): ImportDeclaration {
//     let specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier> = [];
//     // let aSpec:ImportSpecifier =
//     if (importData.isObjectExpression) {
//
//         importData.importNames.forEach((e) => {
//                 specifiers.push(
//                     {
//                         type: "ImportSpecifier",
//                         imported: {
//                             type: "Identifier",
//                             name: e
//                         }, local: {
//                             type: "Identifier",
//                             name: e
//                         }
//                     }
//                 )
//             }
//         )
//     } else {
//         specifiers.push({type: "ImportDefaultSpecifier", local: {type: "Identifier", name: importData.importNames[0]}})
//     }
//
//     return {
//         type: "ImportDeclaration",
//         specifiers: specifiers,
//         source: {
//             type: "Literal",
//             value: importData.importString
//         }
//     } ;
// }
