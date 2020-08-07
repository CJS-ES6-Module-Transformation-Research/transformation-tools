function stringify(obj, options = {}) {
    const EOL = options.EOL || '\n';
    const str = JSON.stringify(obj, options ? options.replacer : null, options.spaces);
    return str.replace(/\n/g, EOL) + EOL;
}
function stripBom(content) {
    if (Buffer.isBuffer(content))
        content = content.toString('utf8');
    return content.replace(/^\uFEFF/, '');
}
export default {
    stringify,
    stripBom
};
export {stringify,stripBom}
