import {ImportData, ImportType} from "../../transformations/import_transformations/visitors/import_replacement";
import {ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier} from "estree";

export function createAnImportDeclaration(importData: ImportData): ImportDeclaration {
    let specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier> = [];
    switch (importData.iType) {
        case ImportType.named :

            importData.importNames.forEach((e) => {
                    specifiers.push(
                        {
                            type: "ImportSpecifier",
                            imported: {
                                type: "Identifier",
                                name: e
                            }, local: {
                                type: "Identifier",
                                name: e
                            }
                        }
                    )
                }
            )
            break;
        case ImportType.defaultI:
            specifiers.push({
                type: "ImportDefaultSpecifier",
                local: {type: "Identifier", name: importData.importNames[0]}
            })
            break

        case ImportType.sideEffect:

            break;
        default:
            throw new Error("unreachable");
            break;

    }

    return {
        type: "ImportDeclaration",
        specifiers: specifiers,
        source: {
            type: "Literal",
            value: importData.importString
        }
    }
}