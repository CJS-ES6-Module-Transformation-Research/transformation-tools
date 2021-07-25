
var a = require('a');
var _something = require('something')

describe('suite',()=>{
	
	beforeEach(() => {
		a();
	});

	it('test',()=>{
		_something.helper_function("Z")
	});

	it('test2', () => {
		if(true) {
			_something.another_helper_function("X");
		}
	});

});
