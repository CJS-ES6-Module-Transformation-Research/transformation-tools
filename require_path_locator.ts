import path from 'path'
import {dirname, basename, extname} from 'path'
import pathParse from 'path-parse'
import {expect} from 'chai'
import relative from "relative";
import {describe, it} from 'mocha';

function computeRelativeToFile(file: string, require: string, projectDirectory: string): string {
    let curr = projectDirectory+'/'+file;
let allrelativetorequire = relative(curr,require,null)
    // let anABS = (`${projectDirectory}/${allrelativetorequire}`)
    let anABS =path.relative(`${projectDirectory}` ,`${allrelativetorequire}`)
    // console.log(anABS);
    // projectDirectory+'/'+
     let norm:string  = path.normalize(anABS);
    return norm ;
}

let project = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform`;
 let test = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform`;
let abs: string = test; //`/absolute/project/path`
console.log(computeRelativeToFile(`./src/index.ts`, `../index.ts`, abs))
// actual = computeRelativeToFile(``,``,root);
describe('relative path tests', () => {
    const root = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform`;
    let expected: string, actual: string;




    it('both top level', () => {
        expected = `package.json`
        actual = computeRelativeToFile(`index.js`,`./package.json`,root);

        expect(
            actual).to.be.equal(`${project}/${expected}`)
    });





    it('js top level, json one below', () => {
        expected = `lib/package.json`
        actual = computeRelativeToFile(`index.js`,`./lib/package.json`,root);

        expect(
            actual).to.be.equal(`${project}/${expected}`)
    });





    it('js one below, json top level', () => {
        expected = `package.json`
        actual = computeRelativeToFile(`lib/index.js`,`../package.json`,root);

        expect(
            actual).to.be.equal(`${project}/${expected}`)
    });



    it('both one below', () => {
        expected = `lib/package.json`
        actual = computeRelativeToFile(`lib/index.js`,`./package.json`,root);

        expect(
            actual).to.be.equal(`${project}/${expected}`)
    });










    it('js one below, json two', () => {
        expected = `lib/util/package.json`
        actual = computeRelativeToFile(`lib/index.json`,`./util/package.json`,root);

        expect(
            actual).to.be.equal(`${project}/${expected}`)
    });

    it('js two below, json one', () => {
        expected = `lib/package.json`
        actual = computeRelativeToFile(`./lib/util/index.js`,`../package.json`,root);

        expect(
            actual).to.be.equal(`${project}/${expected}`)
    });

    it('js two below, json one', () => {
        expected = `lib/package.json`
        actual = computeRelativeToFile(`lib/util/index.js`,`../package.json`,root);

        expect(
            actual).to.be.equal(`${project}/${expected}`)
    });

    it('both two below', () => {
        expected = `lib/util/package.json`
        actual = computeRelativeToFile(`lib/util/index.js`,`./package.json`,root);

        expect(
            actual).to.be.equal(`${project}/${expected}`)
    });

});