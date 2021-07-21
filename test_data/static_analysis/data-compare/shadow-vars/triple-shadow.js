var z = require('./main.js')
console.log(z.a)
class Clazz {
	constructor(){

	}
	clazzMethod(){
		var z = {};
		console.log(z.b)
		return function(){
			var z = {}
			return z.c;  
		};
	}
}