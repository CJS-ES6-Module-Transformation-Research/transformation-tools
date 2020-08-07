
let x = 3;
let y = 'hello';
let z = x;
export {
    x as a,
    y as x,
    y,
    z as b
};
export default {
    a: x,
    x: y,
    y,
    b: z
};
