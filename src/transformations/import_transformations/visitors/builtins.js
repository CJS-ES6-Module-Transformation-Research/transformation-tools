Object.defineProperty(exports, "__esModule", { value: true });
var builtibs = [
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
var setOfBuiltins = new Set();
exports.builtins = setOfBuiltins;
builtibs.forEach(setOfBuiltins.add);
exports.default = { setOfBuiltins: setOfBuiltins };
