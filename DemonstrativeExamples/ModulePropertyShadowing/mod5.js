var x = 1;

function inc() {
	x++;
	console.log("in the module x: " + x); 
}

var expObj = {} 
expObj.inc = inc;
expObj.x = x;

module.exports = expObj;
