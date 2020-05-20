
//single named assign to primitive
module.exports.hello = "hello"

//////////////////


//single named assign to object
module.exports.hello = {hello:"hello"}
///////////////////

// multiple assigns to names
module.exports.first
module.exports.second
//check named and default



// check mixed assigns 
exports.th2 = 32
exports.hello = {hello:"hello"}



// anonymous function assign default
//////////////////////////////////////

module.exports = function (a,b) {
    return a + b
}

// named function assign default
//////////////////////////////////////
module.exports = function add(a,b) {
    return a + b
}
//////////////////////////////////////

// prop assign arrow as default
  module.exports =  ()=>{}
//////////////////////////////////////

// prop assign arrow with name 
  module.exports.arrow =  ()=>{}

 //////////////////////////////////////

// default assign to class
//////////////////////////////////////
module.exports = class Hello{
    a;
    constructor(a) {
        this.a = a;
    }
}

// prop assign to class 
//////////////////////////////////////
module.exports.hello = class Hello{
    a;
    constructor(a) {
        this.a = a;
    }
}

// name collission when splitting up
//with unnamed function
//////////////////////////////////////
function minus(){}
module.exports.minus = function (){}
var x = module.exports.minus();



// name collission when splitting up
//with NAMED  function
//////////////////////////////////////
function minus(){}
module.exports.minus = function ab(){}
var x = module.exports.minus();

//////////////////////////////////////

// multiple same-property assigns
module.exports.x = 32
module.exports.x = 42


//prop assign to function/class
//////////////////////////////////////

module.exports = function hello(){}
module.exports.assign = 'world'

//prop assign to anonymous function
//////////////////////////////////////

module.exports = function  (){}
module.exports.assign = 'world'


//prop assign to arrow function
//////////////////////////////////////

module.exports =   ()=>{}
module.exports.assign = 'world'
//////////////////////////////////////


module.exports = class hello{ constructor(){} }
module.exports.assign = 'world'
//////////////////////////////////////
if (module.exports.istrue){
    console.log()
}

//////////////////////////////////////
if (module.exports.istrue()){
    console.log()
}
//////////////////////////////////////
for (let i = module.exports; i < 10; i++){}
//////////////////////////////////////
for (let i = 0; i < module.exports; i++) {}
//////////////////////////////////////
for (let i = 0; i < 10 ; module.exports(i)) {}


//////////////////////////////////////
 for (let i = module.exports(); i < 10; i++){}
//////////////////////////////////////
for (let i = 0; i < module.exports(); i++) {}
//////////////////////////////////////
for (let i = 0; i < 10 ; module.exports(i)) {}
//////////////////////////////////////

 for (let i = module.exports.getI(); i < 10; i++){}
//////////////////////////////////////
for (let i = 0; i < module.exports.i(); i++) {}
//////////////////////////////////////
for (let i = 0; i < 10 ; module.exports(i)) {}

//////////////////////////////////////

 for (let i = module.exports.i; i < 10; i++){}
//////////////////////////////////////
for (let i = 0; i < module.exports.i; i++) {}
//////////////////////////////////////
for (let i = 0; i < 10 ; module.exports(i)) {}

//////////////////////////////////////
 while(module.exports.isTrue()){}

//////////////////////////////////////
let x = module.exports
//////////////////////////////////////
let x = module.exports.x

//////////////////////////////////////
let x = module.exports.x()

//////////////////////////////////////
let x = module.exports.x.value

//////////////////////////////////////
let x = module.exports.x.value()

//////////////////////////////////////

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////



