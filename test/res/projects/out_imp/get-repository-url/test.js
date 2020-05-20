
'use strict';
import _moduleAccess___index from './index.js';
import repositoryURL from './index.js';
import _moduleAccess_assert from 'assert';
import assert from 'assert';
import 'mocha';
import _moduleAccess_mocha from 'mocha';
describe('repository URL', function () {
    it('should get a package.json for the given project', function (cb) {
        repositoryURL('generate', function (err, url) {
            assert(!err);
            assert(url);
            assert.equal(url, 'https://github.com/generate/generate');
            cb();
        });
    });
    it('should handle errors', function (cb) {
        repositoryURL('fofofofofofoofofof', function (err, url) {
            assert(err);
            assert.equal(err.message, 'document not found');
            cb();
        });
    });
    it('should handle empty strings', function (cb) {
        repositoryURL('', function (err, url) {
            assert(err);
            assert(/expected/.test(err.message));
            cb();
        });
    });
    it('should handle scoped packages', function (cb) {
        repositoryURL('@cycle/core', function (err, url) {
            assert(!err);
            assert(url);
            assert.equal(url, 'https://github.com/cyclejs/core');
            cb();
        });
    });
    it('should handle promises', function () {
        return repositoryURL('@cycle/core').then(function (url) {
            assert(url);
            assert.equal(url, 'https://github.com/cyclejs/core');
        });
    });
});
