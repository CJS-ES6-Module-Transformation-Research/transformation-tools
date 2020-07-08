var x = 1;
var expObj = {};
expObj.x = x;

function inc() {
	x++;
	console.log("in the module x: " + x); 
	console.log("in the module exp.x: " + expObj.x);
	expObj.x++;
	console.log("in the module x: " + x);
	console.log("in the module exp.x: " + expObj.x);
}

expObj.inc = inc;

module.exports = expObj;
