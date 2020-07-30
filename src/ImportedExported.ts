import {generate} from "escodegen";
import {parseScript} from "esprima";
import {traverse} from "estraverse";
import {Program} from "estree";
import {JSFile} from "./abstract_fs_v2/JSv2.js";


interface OutData {
	all: Set<String>
	objs: Set<String>
	maybe_prims: Set<String>
}


function getReqPropertiesAccessed (ast: Program, listOfVars: Set<String>, mapOfRPIs: { [id: string]: OutData }): void {
	traverse(ast, {
		enter: (node, parent) => {
			switch (node.type) {
				case "MemberExpression":
					if (node.object.type === "Identifier"
						&& listOfVars.has(node.object.name)) {
						let name = node.object.name


						if (!mapOfRPIs[name]) {
							mapOfRPIs[name] = {
								all: new Set(),
								objs: new Set(),
								maybe_prims: new Set()
							};
						}
						if (node.property.type === "Identifier") {
							outData[name].all.add(node.property.name)
						}

					}
					break;

			}
		}
	});
}

function getPropsCalledOrAccd(ast: Program, mapOfRPIs: { [id: string]: OutData }): void {
	// let notPrimProps = []
	let nameS: string;
	traverse(ast, {
		enter: (node, parent) => {
			switch (node.type) {
				case "MemberExpression":

					if (node.object.type == "Identifier" && node.property.type == "Identifier") {
						if (node.object.name === "url") {
							console.log(mapOfRPIs['url'])
							console.log("URL: " + generate(node))
						}
						nameS = node.object.name;


						if (mapOfRPIs[nameS] && mapOfRPIs[nameS].all.has(node.property.name)) {
							mapOfRPIs[nameS].objs.add(node.property.name);
						}
					}
					break;
				case "CallExpression":

					if (node.callee.type === "MemberExpression"
						&& node.callee.object.type == "Identifier"
						&& node.callee.property.type == "Identifier") {


						// if (!(node.callee.type == "MemberExpression" && node.callee.object.type == "Identifier"))
						// 	break;
						nameS = node.callee.object.name;
						let data = mapOfRPIs[nameS]
						if (data && data.all.has(node.callee.property.name)) {
							// notPrimProps.push( node.callee);
							data.objs.add(node.callee.property.name);
						}
						// console.log(node.arguments && node.arguments.length>0 ? node.arguments:'nil' )
					}
					break;
			}
		}
	});
	// return notPrimProps;
}

const reqPropertyInfoGather = (js: JSFile) => {
	let ast = js.getAST()
	// let requireMgr: RequireTracker = js.getRequireTracker();
	let listOfVars: string[] = [];
	// requireMgr.getList().forEach(vardecl => listOfVars.push( (vardecl.declarations[0].id as Identifier).name))

	let outData: { [id: string]: OutData } = {};

	// getReqPropertiesAccessed(ast, listOfVars, outData);
	// getPropsCalledOrAccd(ast, outData);

	// requireMgr.setReqPropsAccessedMap(rpis);

}


let ast: Program;
// let requireMgr: RequireTracker = js.getRequireTracker();
let listOfVars: string[] = ['url', 'http', 'path'];
// requireMgr.getList().forEach(vardecl => listOfVars.push( (vardecl.declarations[0].id as Identifier).name))

let outData: { [id: string]: OutData } = {};


ast = parseScript(`

var path = require('y')
var http = require('z')
var url = require('f')
var {p,q,r} = require('t');

path.join('c','u')
path.createPath('a',b).z

let _http = http
_http(x)

path.y(q.z)
url(url.as_path) 




`)
// listOfVars.push('http')
// listOfVars.push('')
// listOfVars.push('')

let set = new Set<String>()
listOfVars.forEach(e => set.add(e))
getReqPropertiesAccessed(ast, set, outData);

for (let key in outData) {
	let value = outData[key]
	value.all.forEach(e => console.log(`${key}: ${e}`))
}
console.log(`\n`)
getPropsCalledOrAccd(ast, outData)
for (let key in outData) {
	let value = outData[key]
	console.log(`${key} size is: ${value.objs.size}`)
	value.objs.forEach(e => console.log(`${key}: ${e}`))
}


for (let key in outData) {
	let value = outData[key]
	console.log(`${key} size is: ${value.objs.size}`)
	value.objs.forEach(e => console.log(`${key}: ${e}`))
}
// getReqPropertiesAccessed(ast, listOfVars, outData);
// getPropsCalledOrAccd(ast, outData);
// console.log(outData);






