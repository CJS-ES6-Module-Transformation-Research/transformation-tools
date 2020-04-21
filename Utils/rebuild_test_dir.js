Object.defineProperty(exports, "__esModule", { value: true });
var Dirs_1 = require("../Utils/Dirs");
var fs_1 = require("fs");
var target = Dirs_1.fixtures + "/test_dir_2";
console.log(target);
if (fs_1.existsSync(target)) {
    console.log("exists");
    fs_1.rmdirSync(target, { recursive: true });
}
// if (false)
try {
    console.log("trying...");
    fs_1.mkdirSync(target);
    fs_1.copyFileSync(Dirs_1.test_dir, target);
    console.log("not caught");
}
catch (e) {
    console.log("caught!".toUpperCase());
    console.log(e);
}
