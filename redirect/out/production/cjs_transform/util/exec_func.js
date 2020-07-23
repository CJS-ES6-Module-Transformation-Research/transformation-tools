var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = __importStar(require("yargs"));
const main_1 = require("transformations/main");
const path_1 = require("path");
function cli_parse(yargs) {
    return yargs
        .option({
        "in": {
            desc: "--in <input-proj> specifies input project path",
            type: "string",
            nargs: 1,
            alias: ["input"],
            demandOption: true
        },
        "out": {
            desc: "--out <out-dir> specifies output directory for transformed project",
            type: "string",
            alias: ['o'],
            nargs: 1
        },
        "in-place": {
            desc: "omits the 'sanitize' step.", type: "string"
        },
        "suffix": { desc: "suffix for keeping copies in-place", type: "string" }
    }).argv;
}
const mod = cli_parse(yargs);
if (!mod['in-place'] && !mod["out"]) {
    console.log(`Please either choose an output directory --out <out-dir> or use the flag --in-place`);
    process.exit(1);
}
else if (mod['in-place'] && mod["out"]) {
    console.log(`Please either choose a single option: an output directory --out <out-dir> OR use the flag --in-place`);
    process.exit(1);
}
let cwd = process.cwd();
if (!path_1.isAbsolute(mod.in)) {
    mod.in = path_1.join(cwd, mod.in);
}
if (mod.out && !path_1.isAbsolute(mod.out)) {
    mod.out = path_1.join(cwd, mod.out);
}
let opts = {
    isModule: false,
    suffix: mod.suffix ? mod.suffix : '',
    target_dir: mod.out,
    write_status: mod['in-place'] ? "in-place" : "copy"
};
main_1.runTransform(mod.in, opts);
