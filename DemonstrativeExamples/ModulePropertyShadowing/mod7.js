var x = 1;
function expFunc() {};
expFunc.x = x;

function inc() {
	x++;
	console.log("in the module x: " + x); 
	console.log("in the module exp.x: " + expFunc.x);
	expFunc.x++;
	console.log("in the module x: " + x);
	console.log("in the module exp.x: " + expFunc.x);
}

expFunc.inc = inc;

module.exports = expFunc;
