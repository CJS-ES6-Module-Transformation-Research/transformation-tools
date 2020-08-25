var __filename = require('url').fileURLToPath(IMPORT_META_URL);
var __dirname = require('path').dirname(__filename);
var path = require('path');
var join = path.join;
var delta = require(join(__dirname,'index.js'));
if (__filename.length > 30){
	process.exit(1);
}