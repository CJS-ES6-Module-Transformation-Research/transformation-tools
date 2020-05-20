
let x = 3;
let y = 'hello';
let z = x;
const a = x;
const x0 = y;
module.exports.y = y;
const b = z;
export {
    a,
    x0 as x,
    b
};
export default {
    a,
    x: x0,
    b
};
