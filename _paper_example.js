
var path = require('path')
var pf_url = require('url').pathFileToURL
const version = require('./package').version
var dir_url = pf_url(__dirname)

function mult(a, b){
	return a*b
}

module.exports  = mult;

 function doSomething(something){
	module.exports.x = something
 }

module.exports.doSomething = doSomething

 var theTruth = module.exports.x ?  true:false;

 if(theTruth){
 	module.exports.y = 'it was true!'
 }
 //-------------------------------------------
import path from 'path'
import  _url = from'url' 
var pf_url  = _url.pathFileToURL
import package from './package.json.cjs'
const version =  package.version 
var __filename = _url.fileURLToPath (import.meta.url)
var __dirname = path.dirname(__filename)
var dir_url = pf_url(__dirname)
let x,y,doSomething2

function mult(a, b){
	return a*b
}
// module.exports  = mult;

 function doSomething(something){
	x = something
 }
 doSomething2 = doSomething

 var theTruth =x ?  true:false;

 if(theTruth){
 	 y = 'it was true!'
 }

export {doSomething as doSomething, x, y}

mult.doSomething = doSomething
mult.x = x
mult.y = y; 


export default mult 


