
'use strict';
class MemoryFileSystemError extends Error {
    constructor(err, path, operation) {
        super(err, path);
        this.name = this.constructor.name;
        var message = [
            `${ err.code }:`,
            `${ err.description },`
        ];
        if (operation) {
            message.push(operation);
        }
        message.push(`\'${ path }\'`);
        this.message = message.join(' ');
        this.code = err.code;
        this.errno = err.errno;
        this.path = path;
        this.operation = operation;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
module.exports = MemoryFileSystemError;
