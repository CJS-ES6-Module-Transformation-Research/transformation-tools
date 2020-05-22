let builtibs: string[] = [
    'assert',
    'buffer',
    'child_process',
    'cluster',
    'crypto',
    'dgram',
    'dns',
    'domain',
    'events',
    'fs',
    'http',
    'https',
    'net',
    'os',
    'path',
    'punycode',
    'querystring',
    'readline',
    'stream',
    'string_decoder',
    'timers',
    'tls',
    'tty',
    'url',
    'util',
    'v8',
    'vm',
    'zlib'
];
const setOfBuiltins:Set<string> = new Set<string>();
builtibs.forEach(setOfBuiltins.add);
export {setOfBuiltins as builtins};
export default {setOfBuiltins}