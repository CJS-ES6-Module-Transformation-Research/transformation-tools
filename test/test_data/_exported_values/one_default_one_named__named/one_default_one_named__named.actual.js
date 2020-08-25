var path = require('path')
var pretty = require('installed')

var pritify = pretty(console.log)
pritify(path.join('a','b'))