var z = require('./main.js')


class Clazz {
	constructor(){

	}
	clazzMethod(){
		var z = function(){}
		z.call()
		return z;
	}
}