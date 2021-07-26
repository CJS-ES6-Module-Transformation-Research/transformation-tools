var z = require('./main.js')
console.log(z.prime)


function lambda(x){
	var y = "y";
	console.log(z.before())
	var z = function(){}
	console.log()
	z.after()
}

 