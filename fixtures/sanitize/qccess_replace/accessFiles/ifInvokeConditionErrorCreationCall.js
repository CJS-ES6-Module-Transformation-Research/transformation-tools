
const trueOrFalse = require('trueOrFalse');
if (trueOrFalse.get()) {
    throw new Error(require('getAnError'));
}
