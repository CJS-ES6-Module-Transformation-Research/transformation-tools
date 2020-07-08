var x = 1;

function inc() {
	x++;
	console.log("in the module x: " + x); 
}

module.exports.inc = inc;
module.exports.x = x;
