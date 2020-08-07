
const _moduleAccess_assert = require('assert');
const _moduleAccess_fs = require('fs');
const _moduleAccess_os = require('os');
const _moduleAccess_path = require('path');
const _moduleAccess_rimraf = require('rimraf');
const _moduleAccess____index = require('../index.js');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');
const jf = require('../index.js');
describe('+ writeFile()', () => {
    let TEST_DIR;
    beforeEach(done => {
        TEST_DIR = path.join(os.tmpdir(), 'jsonfile-tests-writefile');
        rimraf.sync(TEST_DIR);
        fs.mkdir(TEST_DIR, done);
    });
    afterEach(done => {
        rimraf.sync(TEST_DIR);
        done();
    });
    it('should serialize and write JSON', done => {
        const file = path.join(TEST_DIR, 'somefile2.json');
        const obj = { name: 'JP' };
        jf.writeFile(file, obj, err => {
            assert.ifError(err);
            fs.readFile(file, 'utf8', (err, data) => {
                assert.ifError(err);
                const obj2 = JSON.parse(data);
                assert.strictEqual(obj2.name, obj.name);
                assert.strictEqual(data[data.length - 1], '\n');
                done();
            });
        });
    });
    it('should write JSON, resolve promise', done => {
        const file = path.join(TEST_DIR, 'somefile2.json');
        const obj = { name: 'JP' };
        jf.writeFile(file, obj).then(res => {
            fs.readFile(file, 'utf8', (err, data) => {
                assert.ifError(err);
                const obj2 = JSON.parse(data);
                assert.strictEqual(obj2.name, obj.name);
                assert.strictEqual(data[data.length - 1], '\n');
                done();
            });
        }).catch(err => {
            assert.ifError(err);
            done();
        });
    });
    describe('> when JSON replacer is set', () => {
        let file;
        let sillyReplacer;
        let obj;
        beforeEach(done => {
            file = path.join(TEST_DIR, 'somefile.json');
            sillyReplacer = function (k, v) {
                if (!(v instanceof RegExp))
                    return v;
                return `regex:${ v.toString() }`;
            };
            obj = {
                name: 'jp',
                reg: new RegExp(/hello/g)
            };
            done();
        });
        it('should replace JSON', done => {
            jf.writeFile(file, obj, { replacer: sillyReplacer }, err => {
                assert.ifError(err);
                const data = JSON.parse(fs.readFileSync(file));
                assert.strictEqual(data.name, 'jp');
                assert.strictEqual(typeof data.reg, 'string');
                assert.strictEqual(data.reg, 'regex:/hello/g');
                done();
            });
        });
        it('should replace JSON, resolve promise', done => {
            jf.writeFile(file, obj, { replacer: sillyReplacer }).then(res => {
                const data = JSON.parse(fs.readFileSync(file));
                assert.strictEqual(data.name, 'jp');
                assert.strictEqual(typeof data.reg, 'string');
                assert.strictEqual(data.reg, 'regex:/hello/g');
                done();
            }).catch(err => {
                assert.ifError(err);
                done();
            });
        });
    });
    describe('> when spaces passed as an option', () => {
        let file;
        let obj;
        beforeEach(done => {
            file = path.join(TEST_DIR, 'somefile.json');
            obj = { name: 'jp' };
            done();
        });
        it('should write file with spaces', done => {
            jf.writeFile(file, obj, { spaces: 8 }, err => {
                assert.ifError(err);
                const data = fs.readFileSync(file, 'utf8');
                assert.strictEqual(data, `${ JSON.stringify(obj, null, 8) }\n`);
                done();
            });
        });
        it('should write file with spaces, resolve the promise', done => {
            jf.writeFile(file, obj, { spaces: 8 }).then(res => {
                const data = fs.readFileSync(file, 'utf8');
                assert.strictEqual(data, `${ JSON.stringify(obj, null, 8) }\n`);
                done();
            }).catch(err => {
                assert.ifError(err);
                done();
            });
        });
    });
    describe('> when spaces, EOL are passed as options', () => {
        let file;
        let obj;
        beforeEach(done => {
            file = path.join(TEST_DIR, 'somefile.json');
            obj = { name: 'jp' };
            done();
        });
        it('should use EOL override', done => {
            jf.writeFile(file, obj, {
                spaces: 2,
                EOL: '***'
            }, err => {
                assert.ifError(err);
                const data = fs.readFileSync(file, 'utf8');
                assert.strictEqual(data, '{***  "name": "jp"***}***');
                done();
            });
        });
        it('should use EOL override, resolve the promise', done => {
            jf.writeFile(file, obj, {
                spaces: 2,
                EOL: '***'
            }).then(res => {
                const data = fs.readFileSync(file, 'utf8');
                assert.strictEqual(data, '{***  "name": "jp"***}***');
                done();
            }).catch(err => {
                assert.ifError(err);
                done();
            });
        });
    });
    describe('> when passing encoding string as options', () => {
        let file;
        let obj;
        beforeEach(done => {
            file = path.join(TEST_DIR, 'somefile.json');
            obj = { name: 'jp' };
            done();
        });
        it('should not error', done => {
            jf.writeFile(file, obj, 'utf8', err => {
                assert.ifError(err);
                const data = fs.readFileSync(file, 'utf8');
                assert.strictEqual(data, `${ JSON.stringify(obj) }\n`);
                done();
            });
        });
        it('should not error, resolve the promise', done => {
            jf.writeFile(file, obj, 'utf8').then(res => {
                const data = fs.readFileSync(file, 'utf8');
                assert.strictEqual(data, `${ JSON.stringify(obj) }\n`);
                done();
            }).catch(err => {
                assert.ifError(err);
                done();
            });
        });
    });
    describe('> when callback isn\'t passed & can\'t serialize', () => {
        it('should not write an empty file, should reject the promise', function (done) {
            this.slow(1100);
            const file = path.join(TEST_DIR, 'somefile.json');
            const obj1 = { name: 'JP' };
            const obj2 = { person: obj1 };
            obj1.circular = obj2;
            jf.writeFile(file, obj1).catch(err => {
                assert(err);
                assert(!fs.existsSync(file));
                done();
            });
        });
    });
});
