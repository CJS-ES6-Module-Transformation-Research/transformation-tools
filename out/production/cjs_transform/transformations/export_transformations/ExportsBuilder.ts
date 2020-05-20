import {
    Declaration,
    ExportDefaultDeclaration,
    ExportNamedDeclaration,
    ExportSpecifier, Expression,
    Identifier,
    ModuleDeclaration,
    ObjectExpression
} from "estree";
import exp from "constants";
import {exportNaming} from "transformations/export_transformations/extractExportsInfo";

interface exportlist {
    name: string
    alias?: string
    value: any
}

interface exportkeys {
    [name: string]: exportlist
}

export interface exportTypes {
    default_exports: ExportDefaultDeclaration
    named_exports: ExportNamedDeclaration
}


export class ExportBuilder {

    private exportList: exportlist[] = [];
    private defaultExport: exportlist;
    private exAssocArr: exportkeys = {};

    registerName(names: exportNaming, value) {


        let exportsTmp = {
            name: names.name,
            value: value,
            alias: names.alias
        }
        this.exportList.push(exportsTmp);
        this.exAssocArr[names.name] = exportsTmp;
    }


    //////////////////MUST BE ABLE TO REGISTER DEFAULT WITHOUT NAME
    //////////////////DEFAULTS CANNOT HAVE ALIASES IN NODE

    registerDefault(names: exportNaming, value: Expression | Declaration): void {

        this.defaultExport = {
            name: names.name,
            value: value
        }
    }


    build(): exportTypes {
        let exports: exportTypes = {named_exports: null, default_exports: null};


        this.exportList.forEach((value, index) => {
            console.log(`${JSON.stringify(value, null, 3)}`)
        })

        let specifiers: ExportSpecifier[] = [];
        let objEx: ObjectExpression = {type: "ObjectExpression", properties: []}


        this.exportList.forEach(e => {

            let exported: Identifier = {
                type: "Identifier",
                name: e.name
            }
            let local: Identifier = {
                type: "Identifier",
                name: e.alias ? e.alias : e.name
            }

            console.log(`local: ${local.name} || exported: ${exported.name}`)

            objEx.properties.push({
                type: "Property",
                key: exported,
                value: local,
                kind: "init",
                method: false,
                shorthand: e.name === e.alias,
                computed: false
            })
            let specifier: ExportSpecifier = {exported: exported, local: local, type: "ExportSpecifier"}

            console.log(specifier)

            specifiers.push(specifier)
        });


        //unset
        if (!this.defaultExport && !this.exportList.length) {
            // console.log(this.defaultExport)
            // console.log(this.exportList)


            return exports;
        }
        let defaultEX: ExportDefaultDeclaration
        let named: ExportNamedDeclaration
        if (!this.defaultExport) {
            defaultEX = {type: "ExportDefaultDeclaration", declaration: objEx}
        }
        //named case... no default
        if (!this.defaultExport) {

            defaultEX = {type: "ExportDefaultDeclaration", declaration: objEx}
            named = {type: "ExportNamedDeclaration", specifiers: specifiers, declaration: null, source: null};//todo

            exports.named_exports = named
            exports.default_exports = defaultEX;

        } else {

            //has a default TODO add named default cases
            let namedDecl: ExportNamedDeclaration
            if (this.defaultExport.name) {
                // let identifier: Identifier = {
                //     type: "Identifier",
                //     name: this.defaultExport.name ? this.defaultExport.name : 'defaultExport'
                // }
                let spec: ExportSpecifier = {
                    exported: {
                        type: "Identifier",
                        name: this.defaultExport.alias ? this.defaultExport.alias : this.defaultExport.name
                    },
                    local: {type: "Identifier", name: this.defaultExport.name},
                    type: "ExportSpecifier"
                }
                specifiers.push(spec)
                namedDecl = {type: "ExportNamedDeclaration", specifiers: specifiers};

            } else {
                throw new
                Error('todo organize ')
            }
            if (!namedDecl) {
                //TODO GET IDEENTIFIER OF NAEMD EXPORT ASGMT AS NAME FOR EXPOIR T
            }
            let defaultEx: ExportDefaultDeclaration = {
                type: "ExportDefaultDeclaration",
                declaration: {type: "Identifier", name: this.defaultExport.name}
            }
            exports.named_exports = namedDecl
            exports.default_exports = defaultEx
        }
        return exports;
    }
}

// build(): ModuleDeclaration[] {
//     let specifiers: ExportSpecifier[] = [];
//     let objEx: ObjectExpression = {type: "ObjectExpression", properties: []}
//     this.exportList.forEach(e => {
//         let exported: Identifier = {
//             type: "Identifier",
//             name: e.alias ? e.alias : e.name
//         }
//         let local: Identifier = {
//             type: "Identifier",
//             name: e.name
//         }
//         objEx.properties.push({
//             type: "Property",
//             key: exported,
//             value: local,
//             kind: "init",
//             method: false,
//             shorthand: false,
//             computed: false
//         })
//         specifiers.push({exported: exported, local: local, type: "ExportSpecifier"})
//     });
//     const exports: ModuleDeclaration[] = [];
//     //unset
//     if (!this.defaultExport && !this.exportList.length) {
//         return exports;
//     }
//     //named case... no default
//     if (!this.defaultExport) {
//
//
//         let defaultEX: ExportDefaultDeclaration = {type: "ExportDefaultDeclaration", declaration: objEx}
//         exports.push({type: "ExportNamedDeclaration", specifiers: specifiers})
//
//         exports.push(defaultEX);
//         return exports;
//     } else {
//         //has a default
//         let namedDecl: ExportNamedDeclaration
//         if (this.defaultExport.name) {
//             let identifier: Identifier = {type: "Identifier", name: this.defaultExport.name}
//             let spec: ExportSpecifier = {exported: identifier, local: identifier, type: "ExportSpecifier"}
//             namedDecl = {type: "ExportNamedDeclaration", specifiers: [spec]};
//         }
//         if (namedDecl) {
//             exports.push(namedDecl);
//         }
//         let defaultEx: ExportDefaultDeclaration = {
//             type: "ExportDefaultDeclaration",
//             declaration: this.defaultExport.value
//         }
//         exports.push(defaultEx);
//         return exports;
//     }
// }