
var mod = require('mod')
console.log(mod.x)
describe('descr', () => {
    it('one', () => {
        var mod = {one: 'other'}
        console.log(mod.one)
    })
    it('two', () => {
        mod.two.is.ok()

    })
})