#!/Users/sam/.nvm/versions/node/v12.16.0/bin/ts-node

import {test_dir as dir} from "../../Utils/Dirs";
import {expect} from 'chai'
import {RequireStringTransformer} from "../../src/transformations/sanitizing/requireStringTransformer";


// let dir =
let dtc: RequireStringTransformer = new RequireStringTransformer(dir)


describe("'Dot' without slash.",
    () => {
        it(`'.' should become './index.js'`, () => {
            const result = dtc.getTransformed('.');
            expect(result).to.equal("./index.js");
        });
    });


describe('Relative parent without slash.',
    () => {
        it(`'..' should become '../index.js'`, () => {
            const result = dtc.getTransformed('..');
            expect(result).to.equal("../index.js");
        });
    });


describe('"Dot" with slash',
    () => {
        it(`'./' should become './index.js'`, () => {
            const result = dtc.getTransformed('./');
            expect(result).to.equal("./index.js");
        });
    });


describe("Relative parent with slash.",
    () => {
        it(`'../' should become '../index.js'`, () => {
            const result = dtc.getTransformed('../');
            expect(result).to.equal("../index.js");
        });
    });


describe("Ambiguous is JS file",
    () => {
        it(`'./lib' should become './lib.js'`, () => {
            const result = dtc.getTransformed('./lib');
            expect(result).to.equal("./lib.js");
        });
    });


describe("Ambiguous is Dir so index.js",
    () => {
        it(`'./lib/' should become './lib/index.js'`, () => {
            const result = dtc.getTransformed('./lib/');
            expect(result).to.equal("./lib/index.js");
        });
    });


describe("npmjs",
    () => {
        it("There should be no change.", () => {
            const result = dtc.getTransformed('mocha');
            expect(result).to.equal("mocha");
        });
    });


describe("node buitin module require",
    () => {
        it("There should be no change.", () => {
            const result = dtc.getTransformed('fs');
            expect(result).to.equal("fs");
        });
    });


describe("Absolute path dir test",
    () => {
        it(`'test_dir' with absolute path should become ./index.js`, () => {
            const result = dtc.getTransformed(dir);
            expect(result).to.equal("./index.js");
        });
    });


describe("Absolute path dir test with /",
    () => {
        it(`'test_dir/' with absolute path should become ./index.js`, () => {
            const result = dtc.getTransformed(dir);
            expect(result).to.equal("./index.js");
        });
    });


describe("Absolute path references ambiguous.",
    () => {
        it("Should see ./lib.js", () => {
            const result = dtc.getTransformed(`${dir}/lib`);
            expect(result).to.equal("./lib.js");
        });
    });


describe("Absolute path references ambiguous with '/'",
    () => {
        it("Absolute path with lib/ should display ./lib/index.js", () => {
            const result = dtc.getTransformed(`${dir}/lib/`);
            expect(result).to.equal("./lib/index.js");
        });
    });

describe("JSON file test with extension",
    () => {
        it(`Should yield './package.json'--No change.`, () => {
            const result = dtc.getTransformed('./package.json');
            expect(result).to.equal("./package.json");
        });
    });

describe("JSON file test without extension",
    () => {
        it(`Should yield './package.json' adding a '.json'`, () => {
            const result = dtc.getTransformed('./package');
            expect(result).to.equal("./package.json");
        });
    });



