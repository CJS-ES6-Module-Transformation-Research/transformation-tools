#!/Users/sam/.nvm/versions/node/v12.16.0/bin/ts-node
Object.defineProperty(exports, "__esModule", { value: true });
var Dirs_1 = require("../../Utils/Dirs");
var chai_1 = require("chai");
var requireStringTransformer_1 = require("../../src/transformations/sanitizing/requireStringTransformer");
// let dir =
var dtc = new requireStringTransformer_1.RequireStringTransformer(Dirs_1.test_dir);
describe("'Dot' without slash.", function () {
    it("'.' should become './index.js'", function () {
        var result = dtc.getTransformed('.');
        chai_1.expect(result).to.equal("./index.js");
    });
});
describe('Relative parent without slash.', function () {
    it("'..' should become '../index.js'", function () {
        var result = dtc.getTransformed('..');
        chai_1.expect(result).to.equal("../index.js");
    });
});
describe('"Dot" with slash', function () {
    it("'./' should become './index.js'", function () {
        var result = dtc.getTransformed('./');
        chai_1.expect(result).to.equal("./index.js");
    });
});
describe("Relative parent with slash.", function () {
    it("'../' should become '../index.js'", function () {
        var result = dtc.getTransformed('../');
        chai_1.expect(result).to.equal("../index.js");
    });
});
describe("Ambiguous is JS file", function () {
    it("'./lib' should become './lib.js'", function () {
        var result = dtc.getTransformed('./lib');
        chai_1.expect(result).to.equal("./lib.js");
    });
});
describe("Ambiguous is Dir so index.js", function () {
    it("'./lib/' should become './lib/index.js'", function () {
        var result = dtc.getTransformed('./lib/');
        chai_1.expect(result).to.equal("./lib/index.js");
    });
});
describe("npmjs", function () {
    it("There should be no change.", function () {
        var result = dtc.getTransformed('mocha');
        chai_1.expect(result).to.equal("mocha");
    });
});
describe("node buitin module require", function () {
    it("There should be no change.", function () {
        var result = dtc.getTransformed('fs');
        chai_1.expect(result).to.equal("fs");
    });
});
describe("Absolute path dir test", function () {
    it("'test_dir' with absolute path should become ./index.js", function () {
        var result = dtc.getTransformed(Dirs_1.test_dir);
        chai_1.expect(result).to.equal("./index.js");
    });
});
describe("Absolute path dir test with /", function () {
    it("'test_dir/' with absolute path should become ./index.js", function () {
        var result = dtc.getTransformed(Dirs_1.test_dir);
        chai_1.expect(result).to.equal("./index.js");
    });
});
describe("Absolute path references ambiguous.", function () {
    it("Should see ./lib.js", function () {
        var result = dtc.getTransformed(Dirs_1.test_dir + "/lib");
        chai_1.expect(result).to.equal("./lib.js");
    });
});
describe("Absolute path references ambiguous with '/'", function () {
    it("Absolute path with lib/ should display ./lib/index.js", function () {
        var result = dtc.getTransformed(Dirs_1.test_dir + "/lib/");
        chai_1.expect(result).to.equal("./lib/index.js");
    });
});
describe("JSON file test with extension", function () {
    it("Should yield './package.json'--No change.", function () {
        var result = dtc.getTransformed('./package.json');
        chai_1.expect(result).to.equal("./package.json");
    });
});
describe("JSON file test without extension", function () {
    it("Should yield './package.json' adding a '.json'", function () {
        var result = dtc.getTransformed('./package');
        chai_1.expect(result).to.equal("./package.json");
    });
});
