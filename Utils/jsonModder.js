var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const yargs_1 = __importDefault(require("yargs"));
const path_1 = require("path");
const cwd = process.cwd();
let args = yargs_1.default
    .command('set <json> <key> <value>', 'adds   key value pair to json file', (e) => {
    e.strict();
}, (args) => {
    if (!(args.value &&
        args.key &&
        args.json)) {
        throw new Error("IAE ");
    }
    return args;
})
    .command('rm <json> <key> ', '', (args => args.strict), args => {
    if (!(args.key &&
        args.json)) {
        throw new Error("IAE ");
    }
    return args;
})
    .argv;
let cmd = args._[0];
let json;
let _path = path_1.join(cwd, args.json);
if (!fs_1.existsSync(_path)) {
    throw new Error("file " + _path + " does not exist");
}
else {
    if (cmd === "set") {
        json = JSON.parse(fs_1.readFileSync(_path, 'utf-8'));
        json[args.key] = args.value;
    }
    fs_1.unlinkSync(_path);
    if (cmd === "set") {
        fs_1.writeFileSync(_path, JSON.stringify(json, null, 4));
    }
}
//# sourceMappingURL=jsonModder.js.map