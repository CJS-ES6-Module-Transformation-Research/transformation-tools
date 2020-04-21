import {ImportType} from "../visitors/import/import_replacement";
import {ImportDeclaration,ImportSpecifier} from 'estree'


abstract class Import<T> {

    protected importString: string
    protected imports: T
    protected importType: ImportType

    getImportString(): string {
        return this.importString
    }

    getImports(): T {
        return this.imports
    }

    getImportType() {
        return this.importType
    }


    constructor(importString: string, imports: T, isDefault: boolean) {
        this.importString = importString;
        if (!importString) {
            throw new Error('no import value')
        }


        if (imports && isDefault) {
            this.importType = ImportType.defaultI
        } else if (imports && !isDefault) {
            this.importType = ImportType.named
        } else if (!imports) {
            this.importType = ImportType.sideEffect
        }


    }


    public abstract build(): ImportDeclaration ;
}

export class NamedImport extends Import<string[]> {
    constructor(importString: string, values: string[]) {
        super(importString, values, false);
     if (!values || values.length === 0) {
            throw new Error('missing an import')
        }
    }

    public addAName(name: string): void {
            this.imports.push(name)

    }

    build(): ImportDeclaration {


        let specifiers:ImportSpecifier[] = this.imports.map((e)=>{
            return {
                type: "ImportSpecifier",
                imported: {
                    name: `${e}`,
                    type: "Identifier"
                },
                local: {
                    name: `${e}`,
                    type: "Identifier"
                }
            }
        });

        return {
            type: "ImportDeclaration",
            specifiers: specifiers,
            source: {

                type: "Literal",
                value: `${this.importString}`
            }
        };
    }
}

export class DefaultImport extends Import<string>{
    constructor(importString: string, value: string) {
        super(importString, value, true);
        if(!value){
            throw new Error('no default import!')
        }
    }

    build(): ImportDeclaration {
        return {
            type: "ImportDeclaration",
            specifiers: [{
                type: "ImportDefaultSpecifier",
                local: {
                    name: `${this.imports}`,
                    type: "Identifier"
                }
            }],
            source: {

                type: "Literal",
                value: `${this.importString}`
            }
        };
    }
}
export class SideEffectImport extends Import<null>{
    constructor(importString:string){
        super(importString,null,false)
    }

    build(): ImportDeclaration {
        return {
            type: "ImportDeclaration",
            specifiers: [],
            source: {

                type: "Literal",
                value: "chai"
            }
        };
    }
}