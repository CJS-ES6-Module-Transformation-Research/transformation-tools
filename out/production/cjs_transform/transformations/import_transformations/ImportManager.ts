import {ImportDeclaration, ImportSpecifier, ImportDefaultSpecifier, ImportNamespaceSpecifier} from 'estree'


interface ImportRepresentation {
    named: namedAliasMap
    hasDefault: boolean
    defaultIdentifiers: Set<string>
    importString: string
    isSideEff: boolean
}

interface importStringMap {
    [importString: string]: ImportRepresentation
}

interface namedAliasMap {
    [non_local_name: string]: string
}

interface ImportManagerI {
    // create: (importString: string, value: string, _default: boolean) => void
    importsThis: (importString: string, value: string) => boolean
    buildDeclList: () => ImportDeclaration[]
}

function createADefault(importString: string, defaultedName: string): ImportDeclaration {

    return {
        specifiers: [{
            local: {name: defaultedName, type: "Identifier"}
            , type: "ImportDefaultSpecifier"
        }],
        source: {
            type: "Literal",
            value: importString
        }, type: "ImportDeclaration"
    }

}

function createAnExport(importString: string, aliasMap: namedAliasMap): ImportDeclaration {
    let specifiers: (ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier)[] = [];
    for (let name in aliasMap) {

        let alias = aliasMap[name];
        specifiers.push(createASpecifier(alias, name))
    }


    function createASpecifier(local: string, imported: string): ImportSpecifier {
        return {
            type: "ImportSpecifier", local:
                {
                    name: local, type: "Identifier"
                },
            imported: {
                name: imported, type: "Identifier"
            }
        }
    }

    return {
        type: "ImportDeclaration",
        source: {
            type: "Literal",
            value: importString
        },
        specifiers: specifiers

    }
}

function createASideEffect(importString: string): ImportDeclaration {
    return {
        "type": "ImportDeclaration",
        "specifiers": [],
        "source": {
            "type": "Literal",
            "value": `${importString}`,
        }
    };

}

export class ImportManager implements ImportManagerI {
    private orderedImports: string[];
    private readonly importMap: importStringMap

    constructor() {
        this.importMap = {};
        this.orderedImports = [];

    }

    createDefault(importString: string, value: string) {

        if (this.importMap[importString] === undefined) {
            this.orderedImports.push(importString);
            this.importMap[importString] = {
                named: {},
                hasDefault: false,
                defaultIdentifiers: new Set<string>(),
                importString: importString,
                isSideEff: false
            };
        }

        this.importMap[importString].hasDefault = true;
        this.importMap[importString].defaultIdentifiers.add(value);

    }

    createNamedWithAlias(importString: string, name: string, alias: string=name) {

        if (this.importMap[importString] === undefined) {
            this.orderedImports.push(importString);
            this.importMap[importString] = {
                named: {},
                hasDefault: false,
                defaultIdentifiers: new Set<string>(),
                importString: importString,
                isSideEff: false
            };
        }

        let curr: ImportRepresentation = this.importMap[importString]
            ? this.importMap[importString] : {
                named: {},
                hasDefault: false,
                defaultIdentifiers: new Set<string>(),
                importString: importString,
                isSideEff: false
            };
        this.importMap[importString] = curr
        curr.named[name] = alias;
    }

    createSideEffect(importString: string) {
        if (this.importMap[importString] === undefined) {
            this.orderedImports.push(importString);
        }

        let curr: ImportRepresentation = this.importMap[importString]
            ? this.importMap[importString] : {
                named: {},
                hasDefault: false,
                defaultIdentifiers: new Set<string>(),
                importString: importString,
                isSideEff: true
            };
        this.importMap[importString] = curr

    }

    //
    // private create(importString: string, value: string, alias: string, _default: boolean = false): void {
    //     let curr: ImportRepresentation = this.importMap[importString]
    //         ? this.importMap[importString] : {
    //             named: {},
    //             hasDefault: false,
    //             defaultIdentifiers: {},
    //             importString: importString
    //         };
    //
    //     this.importMap[importString] = curr
    //
    //     if (_default) {
    //         curr.defaultIdentifiers[value] = alias;
    //         curr.hasDefault = true;
    //     } else {
    //         curr.named[value] = alias;
    //     }
    //
    // }

    buildDeclList(): ImportDeclaration[] {
        let decls: ImportDeclaration[] = [];
        this.orderedImports.forEach(imp => {
            let value = this.importMap [imp];
            let tmp: ImportDeclaration[] = [];
            if (value.hasDefault) {
                value.defaultIdentifiers.forEach(name => {
                    tmp.push(createADefault(value.importString, name))
                })

            }
            tmp.reverse().forEach(e => decls.push(e))
            tmp = []
            if (Object.keys(value.named).length > 0) {
                tmp.push(createAnExport(value.importString, value.named))
            }
            tmp.reverse().forEach(e => decls.push(e))

            if (value.isSideEff) {
                decls.push(createASideEffect(value.importString))
            }

        })

        // for (let imp in this.importMap) {
        //     let value = this.importMap [imp];
        //
        //     if (value.hasDefault) {
        //         value.defaultIdentifiers.forEach(name => {
        //             decls.push(createADefault(value.importString, name))
        //         })
        //
        //     }
        //     if (Object.keys(value.named).length > 0) {
        //         decls.push(createAnExport(value.importString, value.named))
        //     }
        //
        //     if (value.isSideEff) {
        //         decls.push(createASideEffect(value.importString))
        //     }
        // }

        return decls;
    }


    importsThis(importString: string, value: string): boolean {
        let importsMap = this.importMap[importString]
        if (importsMap === undefined) {
            return false;
        }
        if (value === 'default') {
            return importsMap.defaultIdentifiers[value] !== undefined
        }
        return importsMap.named[value] !== undefined

    }

}