import {traverse} from "estraverse";
import {ArrayPattern, AssignmentPattern, Identifier, MemberExpression, Node, ObjectPattern, RestElement} from "estree";
import {Program} from "esprima";

export class Namespace {
    private names: Set<string>;

    private constructor(ast: Program) {

        this.names = new Set<string>();
        traverse(ast, {
            enter: (node: Node) => {
                switch (node.type) {
                    case "VariableDeclarator": {
                        walkPatternToIdentifier(node.id, this.names);
                        break;
                    }
                    case "AssignmentExpression": {
                        walkPatternToIdentifier(node.left, this.names);
                        break;
                    }
                    case "FunctionDeclaration": {
                        node.params.forEach((e) => walkPatternToIdentifier(e, this.names))
                        this.names.add(node.id.name)
                        break;
                    }
                    case "ClassDeclaration": {
                        this.names.add(node.id.name);
                        break;
                    }
                }
            }
        });
    }

    containsName(name: string): boolean {
        return this.names.has(name);
    }

    getAllNames(): string[] {
        let list: string[] = [];
        this.names.forEach((e) => list.push(e))
        return list;
    }


    static create(ast: Program): Namespace {
        return new Namespace(ast);
    }


    generateBestName(name: string): Identifier {
        if (!this.names.has(name)) {
            return {name: name, type: "Identifier"};
        }
        let nameGen = [
            numberNameFormula(name, '', -4, this.names),
            numberNameFormula(name, '_', 0, this.names),
            numberNameFormula(name, '$', 2, this.names),
            numberNameFormula(name, '__', 7, this.names),
            numberNameFormula(name, '$$', 20, this.names),
            numberNameFormula(name, '$_', 14, this.names)
        ].sort((a, b) => a.quality - b.quality)

        // [0].name
        return {name: nameGen[0].name, type: "Identifier"};

        function numberNameFormula(name: string, symbol: string, startQuality: number, namespace: Set<string>): NameQuality {

            return numberName(0);

            function numberName(q: number): NameQuality {
                let curr = `${name}${symbol}${q}`

                if (namespace.has(curr)) {
                    return numberName(q + 1);
                } else {
                    return {name: curr, quality: q + startQuality};
                }
            }
        }


    }


}

function walkPatternToIdentifier(node: (Identifier | ObjectPattern | ArrayPattern | RestElement |
    AssignmentPattern | MemberExpression), ids: Set<string>) {
    switch (node.type) {
        case "ArrayPattern":
            node.elements.forEach((e) => walkPatternToIdentifier(e, ids))
            break;
        case "AssignmentPattern":
            walkPatternToIdentifier(node.left, ids)
            break;
        case "Identifier":
            ids.add(node.name);
            break;
        case "ObjectPattern":
            node.properties.forEach((e) => {
                if (e.type === "Property") {
                    walkPatternToIdentifier(e.value, ids)
                } else {
                    walkPatternToIdentifier(e, ids)
                }
            })
            break;
        case "RestElement":
            walkPatternToIdentifier(node.argument, ids)
            break;
        case "MemberExpression":
            if (node.object.type === "Identifier") {
                ids.add(node.object.name)
            } else if (node.object.type === "MemberExpression") {
                walkPatternToIdentifier(node.object, ids)
            }
    }
}

import {test_root} from "../../../../index";

const testDir = `${test_root}/res/namespace_test_files`

interface NameQuality {
    name: string
    quality: number
}

interface a {
    [key: string]: Program
}

//
// let testData = {}
// testData['singleVDecl'] = parseScript((`${testDir}/singleVDecl.js`).toString())
// testData ['multiVDecl'] = parseScript((`${testDir}/multiVDecl.js`).toString())
// testData ['singleDeconsDecl'] = parseScript((`${testDir}/singleDeconsDecl.js`).toString())
// testData ['multiDeconsDecl'] = parseScript((`${testDir}/multiDeconsDecl.js`).toString())
// testData ['moduleExports'] = parseScript((`${testDir}/moduleExports.js`).toString())
// testData ['funcDecl'] = parseScript((`${testDir}/funcDecl.js`).toString())
// testData ['classDecl'] = parseScript((`${testDir}/classDecl.js`).toString())
//
//
// Namespace.create(
//     parseScript(`
//     let x = 3;
//     `)
// )