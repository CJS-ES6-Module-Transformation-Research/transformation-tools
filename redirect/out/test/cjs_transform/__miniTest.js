Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const ExportsBuilder_1 = require("../src/transformations/export_transformations/ExportsBuilder");
let builder = new ExportsBuilder_1.ExportBuilder();
const identifier = {
    type: "Identifier",
    name: "anIdentifier"
};
index_1.describe('Generate Testing for ExportBuilder', () => {
    index_1.it('empty test', () => {
    });
    index_1.it('Test Default Only No Name', () => {
        builder.registerDefault('default', identifier);
        let build = builder.build();
        console.log(JSON.stringify(build, null, 2));
        let declarationName = build[0];
        let declarationDefault = build[1];
        index_1.expect(declarationName.type).to.equal("ExportNamedDeclaration");
        let namedDecl = declarationName;
        let specifiers = namedDecl.specifiers;
        let specifier = specifiers[0];
        let expected = identifier;
        expected.name = 'default';
        index_1.expect(specifier.exported).to.deep.equal(identifier);
        index_1.expect(specifier.local).to.deep.equal(identifier);
        index_1.expect(declarationDefault.type).to.equal("ExportDefaultDeclaration");
        index_1.expect(declarationDefault.declaration).to.deep.equal(identifier);
    });
});
