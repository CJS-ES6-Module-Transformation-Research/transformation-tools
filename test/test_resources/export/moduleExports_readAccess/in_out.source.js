//++++read no assign
var x = module.exports
//====
//++++truthy if version
if(module.exports){
	console.log()
}
//====
//++++ for case: instantiate
for(let x = module.exports.x;x < 4;x++){console.log();}
//====
//++++ for case: condition
for(let i = 0; i < module.exports;i++ ){console.log();}
//====
//++++ for case: increment
for(let i = 0;i < 10;i = module.exports(i)){console.log();}
//====
//++++ inside body of function declaration
function f (x){
	return module.exports.x * x; 
}
//====
//++++ inside body of class constructor declaration
class TestClass{
	constructor(){
		console.log(module.exports)
	}
}
//====
//++++ inside body of class method declaration
class TestClass{
	 execute(){
	 	return module.exports(this)
	 }
}
//====
//++++ inside body of for
for (let i = 0; i < 32; i++){
	module.exports.i += i;
	console.log(module.exports.stringRepresentation())
	module.exports(i)
}
//====
//++++ forin
for (let i in module.exports){
	let j = module.exports[i];
	console.log(`the current export is: ${j}`)
}
//====
//++++ simple invocation
module.exports()
//====
//++++invocation declare
let x = module.exports()
//====
//++++ prop chain invocation
var x = module.exports.x()
//====
//++++assign invocation with itsself as arg
var x = module.exports(module.exports)
//====
//++++invocation with itsself as arg
module.exports(module.exports)
//====
//++++assign invocation with itsself prop as arg
var x = module.exports(module.exports.property)
//====
//++++ double prop chain invocation
module.exports.x.y()
//====
//++++ double prop chain invocation assignment
var x = module.exports.x.y()
//====
//++++ brutal function nesting 0
var x =   module.exports(module.exports.x + module.exports.y)
//====
//++++ brutal function nesting 1
var x =  module.exports(module.exports.x + module.exports(module.exports.y))
//====
//++++ brutal function nesting 0 with decl
var x =  module.exports(module.exports.x + module.exports.y)
//====
//++++ brutal function nesting 1 with decl
var x =  module.exports(module.exports.x + module.exports(module.exports.y))
//====
//++++ prop access decl
var x = module.exports.x
//====
//++++ double prop chain with decl
var x = module.exports.x.y
//====
//++++array index
module.exports[0]
//====
//++++length prop access
module.exports[module.exports.length-1]
//====
//++++method call
module.exports.charAt(0)
//====
//++++dynamic prop access with literal
module.exports['x']
//====
//++++dynamic prop access with variable
module.exports[x]
//====
//++++dynamic prop access with property
module.exports[module.exports.x]
//====
//++++self dynamic prop access
module.exports[module.exports]
//====
//++++index
var x = module.exports[0]
//====
//++++length prop access
var x = module.exports[module.exports.length-1]
//====
//++++method call on
var x = module.exports.push(0)
//====
//++++dynamic prop access with literal
var x = module.exports['x']
//====
//++++dynamic prop access with variable
var x = module.exports[x]
//====
//++++dynamic prop access with property
var x = module.exports[module.exports.x]
//====
//++++self dynamic prop access
var x = module.exports[module.exports]
//====
//++++ addition or concatenation of two props
var x = module.exports.x + module.exports.y
//====
//++++ multiplicationof two props
var x = module.exports.x * module.exports.y
//====
//++++new Expr
new module.exports()
//====
//++++new Expr with self as arg
new module.exports(module.exports)
//====
//++++new Expr with property as arg
new module.exports(module.exports.x)
//====
//++++new Expr with property invocation as arg
new module.exports(module.exports.y())
//====
//++++new Expr decl
var x = new module.exports()
//====
//++++new Expr decl with self as arg
var x = new module.exports(module.exports)
//====
//++++ new Expr decl with property as arg
var x = new module.exports(module.exports.x)
//====
//++++ new Expr decl with property invocation as arg
var x = new module.exports(module.exports.y())
//====
//++++ boolean compare to undefined
var x = module.exports === undefined
//====
//++++ boolean compare not to null
var x = module.exports !== undefined
//====
//++++ boolean compare to undefined two ==
var x = module.exports == undefined
//====
//++++ boolean compare to null
var x = module.exports === null
//====
//++++ boolean compare not to null
var x = module.exports !== null
//====
//++++ boolean compare to null two ==
var x = module.exports == null
//====
//++++ boolean compare to true
var x = module.exports === true
//====
//++++ boolean compare not to true
var x = module.exports !== true
//====
//++++ boolean compare to true two ==
var x = module.exports == true
//====
//++++ boolean compare to false
var x = module.exports === false
//====
//++++ boolean compare not to false
var x = module.exports !== false
//====
//++++ boolean compare to false two ==
var x = module.exports == false
//====
//++++ boolean compare to ''
var x = module.exports === ''
//====
//++++ boolean compare not to ''
var x = module.exports !== ''
//====
//++++ boolean compare to '' two ==
var x = module.exports == ''
//====
//++++ boolean compare to 0
var x = module.exports === 0
//====
//++++ boolean compare not to 0
var x = module.exports !== 0
//====
//++++ boolean compare to 0 two ==
var x = module.exports == 0
//====
//++++ boolean compare to 1
var x = module.exports === 1
//====
//++++ boolean compare not to 1
var x = module.exports !== 1
//====
//++++ boolean compare to 1 two ==
var x = module.exports == 1
//====
//++++read no assign
x = module.exports
//====
//++++invocation declare
x = module.exports()
//====
//++++ prop chain invocation
x = module.exports.x()
//====
//++++assign invocation with itsself as arg
x = module.exports(module.exports)
//====
//++++assign invocation with itsself prop as arg
x = module.exports(module.exports.property)
//====
//++++ double prop chain invocation assignment
x = module.exports.x.y()
//====
//++++ brutal function nesting 0
x =   module.exports(module.exports.x + module.exports.y)
//====
//++++ brutal function nesting 1
x =  module.exports(module.exports.x + module.exports(module.exports.y))
//====
//++++ brutal function nesting 0 with decl
x =  module.exports(module.exports.x + module.exports.y)
//====
//++++ brutal function nesting 1 with decl
x =  module.exports(module.exports.x + module.exports(module.exports.y))
//====
//++++ prop access decl
x = module.exports.x
//====
//++++ double prop chain with decl
x = module.exports.x.y
//====
//++++index
x = module.exports[0]
//====
//++++length prop access
x = module.exports[module.exports.length-1]
//====
//++++method call on
x = module.exports.push(0)
//====
//++++dynamic prop access with literal
x = module.exports['x']
//====
//++++dynamic prop access with variable
x = module.exports[x]
//====
//++++dynamic prop access with property
x = module.exports[module.exports.x]
//====
//++++self dynamic prop access
x = module.exports[module.exports]
//====
//++++ addition or concatenation of two props
x = module.exports.x + module.exports.y
//====
//++++ multiplicationof two props
x = module.exports.x * module.exports.y
//====
//++++new Expr decl
x = new module.exports()
//====
//++++new Expr decl with self as arg
x = new module.exports(module.exports)
//====
//++++ new Expr decl with property as arg
x = new module.exports(module.exports.x)
//====
//++++ new Expr decl with property invocation as arg
x = new module.exports(module.exports.y())
//====
//++++ boolean compare to undefined
x = module.exports === undefined
//====
//++++ boolean compare not to null
x = module.exports !== undefined
//====
//++++ boolean compare to undefined two ==
x = module.exports == undefined
//====
//++++ boolean compare to null
x = module.exports === null
//====
//++++ boolean compare not to null
x = module.exports !== null
//====
//++++ boolean compare to null two ==
x = module.exports == null
//====
//++++ boolean compare to true
x = module.exports === true
//====
//++++ boolean compare not to true
x = module.exports !== true
//====
//++++ boolean compare to true two ==
x = module.exports == true
//====
//++++ boolean compare to false
x = module.exports === false
//====
//++++ boolean compare not to false
x = module.exports !== false
//====
//++++ boolean compare to false two ==
x = module.exports == false
//====
//++++ boolean compare to ''
x = module.exports === ''
//====
//++++ boolean compare not to ''
x = module.exports !== ''
//====
//++++ boolean compare to '' two ==
x = module.exports == ''
//====
//++++ boolean compare to 0
x = module.exports === 0
//====
//++++ boolean compare not to 0
x = module.exports !== 0
//====
//++++ boolean compare to 0 two ==
x = module.exports == 0
//====
//++++ boolean compare to 1
x = module.exports === 1
//====
//++++ boolean compare not to 1
x = module.exports !== 1
//====
//++++ boolean compare to 1 two ==
x = module.exports == 1
//====
