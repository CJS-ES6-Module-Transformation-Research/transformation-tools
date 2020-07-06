var x = 1;

function inc() {
	x++;
	console.log("in the module x: " + x); 
}

function expFunc() {} 
expFunc.inc = inc;
expFunc.x = x;

module.exports = expFunc;
