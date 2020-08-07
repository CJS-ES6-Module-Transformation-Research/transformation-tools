
const _moduleAccess_trueOrFalse = require('trueOrFalse');
if (_moduleAccess_trueOrFalse.get()) {
    throw new Error(require('getAnError'));
}
