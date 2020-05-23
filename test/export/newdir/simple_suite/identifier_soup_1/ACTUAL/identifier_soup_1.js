
let x = 3;
let y = 'hello';
let z = x;
const a = x;
const x0 = y;
const y0 = y;
const b = z;
export {
    a,
    x0 as x,
    y0 as y,
    b
};
export default {
    a,
    x: x0,
    y: y0,
    b
};
