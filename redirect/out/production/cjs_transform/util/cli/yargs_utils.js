Object.defineProperty(exports, "__esModule", { value: true });
function parse(yargs) {
    const mod = cli_parse(yargs);
    if (!mod['in-place'] && !mod["out"]) {
        console.log(`Please either choose an output directory --out <out-dir> or use the flag --in-place`);
        process.exit(1);
    }
    let opts = {
        in_place: mod["in-place"],
        src: mod.in,
        suffix: mod.suffix,
        target: mod.out
    };
    return opts;
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
}
