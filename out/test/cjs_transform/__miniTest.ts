import {expect, it, describe, parseModule, parseScript} from './index'
import {ExportBuilder} from '../src/transformations/export_transformations/ExportsBuilder'
import {ExportDefaultDeclaration, ExportNamedDeclaration, ExportSpecifier, Identifier, ModuleDeclaration} from "estree";

let builder: ExportBuilder = new ExportBuilder();

const identifier: Identifier = {
    type: "Identifier",
    name: "anIdentifier"
};

describe('Generate Testing for ExportBuilder', () => {
    it('empty test', () => {

    });

    it('Test Default Only No Name', () => {
        builder.registerDefault('default', identifier)
        let build:ModuleDeclaration[] = builder.build()
        console.log(JSON.stringify(build,null,2 ))
        let declarationName = build[0];
        let declarationDefault = build[1];

        expect(declarationName.type).to.equal("ExportNamedDeclaration")
        let namedDecl = declarationName as ExportNamedDeclaration;
        let specifiers:ExportSpecifier[] = namedDecl.specifiers;
        let specifier:ExportSpecifier =specifiers[0]
        let expected = identifier;
        expected.name = 'default';
        expect(specifier.exported).to.deep.equal(identifier)
        expect(specifier.local).to.deep.equal(identifier)

        expect(declarationDefault.type).to.equal("ExportDefaultDeclaration")
        expect((declarationDefault as ExportDefaultDeclaration).declaration).to.deep.equal(identifier)
    });

});