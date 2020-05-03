$$$module.exports = require('amodule')
$$$module.exports = require('amodule').invoke()
$$$module.exports = require('amodule').access
$$$a = require('amodule')
$$$a = require('amodule').invoke()
$$$a  = require('amodule').access
$$$let {a,b,c} = require('eightySix')
$$$let {a,b,c} = require('eightySix').invoke()
$$$let {a,b,c} = require('eightySix').access
$$$for (let i = require('mocha'); true;i++){let x = 3;}
$$$for (let i = require('mocha').invoke(); true;i++){let x = 3;}
$$$for (let i = require('mocha').access; true;i++){let x = 3;}
$$$for (let i = require('mocha').access, j = require('lodash'), w = 3 ; true;i++){let x = 3;}
$$$for (let j = 32, i = require('mocha'); true;i++){let x = require('three');}
$$$if(require('trueOrFalse')){throw new Error('')}
$$$if(require('trueOrFalse').get()){throw new Error('')}
$$$if(require('trueOrFalse').get()){throw new Error(require('getAnError'))}
$$$if(require('trueOrFalse').get()){throw new Error(require('getAnError').errorNum0)}
$$$if(require('trueOrFalse').get()){throw new Error(require('getAnError').create('error'))}
$$$require('add')(1,3);
$$$require('invoke')()
$$$function (a, b){require('hello_world')(a,b);}
$$$module.exports = require('x');val2 = require('x');//assert same value
$$$module.exports = require('x').();val2 = require('x');//assert same value
$$$module.exports = require('x').x;val2 = require('x');//assert same value