
var a = require('a');

describe('suite',()=>{
	
	beforeEach(() => {
		a();
	});

	it('test',()=>{
		var utility = require('something');
		utility.helper_function("Z");
	});

	it('test2', () => {
		var utility = require('something');
		if(true) {
			utility.another_helper_function("X");
		}
	});

});