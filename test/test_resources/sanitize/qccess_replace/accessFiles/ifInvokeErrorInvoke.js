
const trueOrFalse = require('trueOrFalse');
const getAnError = require('getAnError');
if (trueOrFalse.get()) {
    throw new Error(getAnError.create('error'));
}
