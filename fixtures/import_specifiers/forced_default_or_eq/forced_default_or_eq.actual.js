var fs = require('fs');
var xfs;
function f(opts) {
    xfs = opts.fs || fs;
}