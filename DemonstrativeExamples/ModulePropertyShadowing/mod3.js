var x = 1;

function inc() {
	x++;
	console.log("in the module x: " + x); 
}

var expObj = {inc: inc, x:x}
module.exports = expObj;
