let x = 0;
let z = 9;
function f() {
    var {
        a: b,
        x,
        y: z
    } = require('./index.js');
}