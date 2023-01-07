!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";
/*!
 * get-repository-url <https://github.com/jonschlinkert/get-repository-url>
 *
 * Copyright (c) 2016-present, Jon Schlinkert.
 * Released under the MIT License.
 */const n=r(1),o=r(2),u=r(3),i=e=>null!==e&&"object"==typeof e,f=e=>""!==e&&"string"==typeof e;e.exports=function e(t,r){if("function"!=typeof r)return n.promisify(e)(t);f(t)?u(t,(function(e,t){e?r(e):r(null,function(e){if(!i(e))return null;let t=e.repository||e.homepage||e.bugs&&e.bugs.url;i(t)&&(t=t.url);if(!f(t))return null;if(/github\.com/.test(t)&&/\/issues$/.test(t))return t.replace(/\/issues$/,"");return"https://github.com/"+o(t).repository}(t))})):r(new TypeError("expected repository name to be a non-empty string"))}},function(e,t){e.exports=require("util")},function(e,t){e.exports=require("parse-github-url")},function(e,t){e.exports=require("get-pkg")}]);