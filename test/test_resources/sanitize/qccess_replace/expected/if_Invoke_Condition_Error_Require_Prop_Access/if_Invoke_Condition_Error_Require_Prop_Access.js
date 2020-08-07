
const _moduleAccess_trueOrFalse = require('trueOrFalse');
const _moduleAccess_getAnError = require('getAnError');
if (_moduleAccess_trueOrFalse.get()) {
    throw new Error(_moduleAccess_getAnError.errorNum0);
}
