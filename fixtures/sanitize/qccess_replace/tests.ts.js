// propertyAccessAssignmentAccessZZZZZmodule.exports = require('amodule')
// propertyAccessAssingnmentInvocationAccessZZZZZmodule.exports = require('amodule').invoke()
// propertyAccessAssignmentPropertyAccessZZZZZmodule.exports = require('amodule').access
// assignmentPropertyAccessAssignmentAccessZZZZZa = require('amodule')
// assingnmentInvocationAccessZZZZZa = require('amodule').invoke()
// assignmentPropertyAccessZZZZZa  = require('amodule').access
// deconsDeclareZZZZZlet {a,b,c} = require('eightySix')
// deconsInvokeDeclareZZZZZlet {a,b,c} = require('eightySix').invoke()
// deconsPropAccessDeclareZZZZZlet {a,b,c} = require('eightySix').access
// forAccessZZZZZfor (let i = require('mocha'); true;i++){let x = 3;}
// forInvokeAccessZZZZZfor (let i = require('mocha').invoke(); true;i++){let x = 3;}
// forPropAccessZZZZZfor (let i = require('mocha').access; true;i++){let x = 3;}
// forMultiRequirePropAccessZZZZZfor (let i = require('mocha').access, j = require('lodash'), w = 3 ; true;i++){let x = 3;}
// forAccessWithBodyDeclZZZZZfor (let j = 32, i = require('mocha'); true;i++){let x = require('three');}
// ifRequireConditionZZZZZif(require('trueOrFalse')){throw new Error('')}
// ifInvokeAsConditionZZZZZif(require('trueOrFalse').get()){throw new Error('')}
// ifInvokeConditionErrorCreationCallZZZZZif(require('trueOrFalse').get()){throw new Error(require('getAnError'))}
// ifInvokeConditionErrorRequirePropAccessZZZZZif(require('trueOrFalse').get()){throw new Error(require('getAnError').errorNum0)}
// ifInvokeErrorInvokeZZZZZif(require('trueOrFalse').get()){throw new Error(require('getAnError').create('error'))}
// topLevelInvokeWithArgsZZZZZrequire('add')(1,3);
// topLevelInvokeNoArgsZZZZZrequire('invoke')()
// funcDeclRequireInvokeInBodyZZZZZfunction abc(a, b){require( 'hello_world')(a,b);}
// twoAssignmentsExpectSameAccessVariableZZZZZmodule.exports = require('x');val2 = require('x');//assert same value
// twoAssignmentsOneInvokeExpectSameAccessVariableZZZZZmodule.exports = require('x')();val2 = require('x');//assert same value
// twoAssignmentsOneAccessExpectSameAccessVariableZZZZZmodule.exports = require('x').x;val2 = require('x');//assert same value