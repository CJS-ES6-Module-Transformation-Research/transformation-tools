var __exports, a, b;
__exports = {};
module.exports = __exports;
a = 'a';
module.exports.a = a;
b = 0;
module.exports.b = b;
console.log(Object.keys(module.exports).length);
if (module.exports) {
    console.log('good');
}
console.log(`a:${ module.exports.a }`);
console.log(`b:${ module.exports.b }`);
++module.exports.b;
console.log(`b:${ module.exports.b }`);