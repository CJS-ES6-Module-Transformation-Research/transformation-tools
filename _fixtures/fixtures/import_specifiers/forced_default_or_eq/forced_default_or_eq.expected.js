import fs from 'fs';
var xfs;
function f(opts) {
    xfs = opts.fs || fs;
}