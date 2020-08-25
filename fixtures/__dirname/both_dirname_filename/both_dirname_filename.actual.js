var path = require('path')
var join = path.join
var delta = require(join(__dirname,'index.js'))
if (__filename.length > 30){
	process.exit(1)
}
