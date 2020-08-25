#!/usr/local/bin/ts-node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjConstructionOpts = void 0;
const path_1 = require("path");
const yargs = __importStar(require("yargs"));
const ProjectManager_1 = require("./src/abstract_fs_v2/ProjectManager");
const executor_1 = __importDefault(require("./src/executor"));
const cwd = process.cwd();
let { input, output, suffix, operation, naming_format, ignored, tf_args } = getOptionData();
if (input) {
    let pm;
    pm = new ProjectManager_1.ProjectManager(input, getProjConstructionOpts(suffix, output, operation, naming_format, ignored));
    executor_1.default(pm);
    // if(tf_args._.includes('jsreport')){
    // 	repo
    // }
    pm.writeOut();
    if (tf_args.report) {
        pm.report();
    }
}
function getProjConstructionOpts(suffix, output, operation, naming_format, ignored) {
    return {
        isModule: false,
        suffix: suffix,
        target_dir: output,
        write_status: operation,
        copy_node_modules: false,
        isNamed: naming_format === "named",
        ignored: ignored,
        report: tf_args.report
    };
}
exports.getProjConstructionOpts = getProjConstructionOpts;
function getOptionData() {
    let tf_args = yargs
        .command(copyCommandModule())
        .command(inPlaceCommandModule())
        .option('import_type', { choices: ["named", "default"], nargs: 1 })
        .option('ignored', { type: "string", array: true })
        .option('report', { type: "boolean", nargs: 0 })
        // .option({
        // 	import_type: {choices: ["named", "default"], nargs: 1},
        //
        // 	ignored: {type: "string", array: true} )
        .strict()
        .argv;
    let input = tf_args.source;
    let output = '';
    let suffix = '';
    let operation;
    // @ts-ignore
    let naming_format = tf_args.import_type ? tf_args.import_type : "default";
    // @ts-ignore
    let ignored = tf_args.ignored ? tf_args.ignored : [];
    if (tf_args._[0] === "tf-proj") {
        operation = "in-place";
        suffix = tf_args.suffix;
    }
    else if (tf_args._[0] === "tf-copy") {
        operation = "copy";
        output = tf_args.dest;
        if (output && !path_1.isAbsolute(output)) {
            output = path_1.join(cwd, output);
        }
    }
    if (!path_1.isAbsolute(input)) {
        input = path_1.join(cwd, input);
    }
    ignored.forEach((elem, index, arr) => {
        if (!path_1.isAbsolute(elem)) {
            arr[index] = path_1.join(cwd, elem);
        }
    });
    return { input, output, suffix, operation, naming_format, ignored, tf_args };
}
function copyCommandModule() {
    // const copyCommandModule: CommandModule<ProgramArgs, ProgramArgs> =
    return {
        command: "tf-copy <source> <dest>",
        builder: (args) => {
            // .option('filter',{})
            return optionized(args);
            // .option('include-node_modules', {type:"boolean"})
        },
        aliases: 'c',
        describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project, copying the result to a destination.",
        handler(args) {
            switch (args._[0]) {
                case 'c':
                    args._[0] = 'tf-copy';
                    break;
            }
        }
    };
}
// type infOp = InferredOptionTypes<_Options>
function optionized(args) {
    let _args = args.option({
        import_type: { choices: ["named", "default"], nargs: 1 },
        ignored: { type: "string", array: true }
    });
    return _args;
}
function inPlaceCommandModule() {
    // const inPlaceCommandModule: CommandModule<ProgramArgs, ProgramArgs> =
    return {
        command: "tf-proj <source> [suffix]",
        builder: (args) => {
            return args;
            //optionized(args);
        },
        aliases: 'i',
        describe: "Executes a transformation from CommonJS modules to ECMAScript modules on a project directory in-place.",
        handler(args) {
            switch (args._[0]) {
                case 'i':
                    args._[0] = 'tf-proj';
                    break;
            }
            if (!args['suffix']) {
                args['suffix'] = '';
            }
        }
    };
}
//# sourceMappingURL=cjs-transform.js.map