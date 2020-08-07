basic_filenameZZZZZconsole.log(__filename)
basic_dirnameZZZZZconsole.log(__dirname)
basic_bothZZZZZconsole.log(__filename);
console.log(__dirname)
reassign_dirnameZZZZZ__dirname = 32;
if_reassign_dirnameZZZZZif(__filename)
{
    __dirname = false;
}
reassign_both_different_types_different_ifsZZZZZif(__filename)
{
    __dirname = false;
}
;
if (!__dirname) {
    __filename = 'hello'
}
;
concat_both_in_for_ifZZZZZconsole.log();
for (let i = 0; i < 32; i++) {
    if (i) {
        console.log(__dirname + __filename)
    }
}
//imported