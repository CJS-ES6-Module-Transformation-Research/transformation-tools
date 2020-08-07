import {generate} from "escodegen";
import {parseScript} from "esprima";
import {traverse} from "estraverse";
import {Node, Program} from "estree";
import {JSFile} from "./abstract_fs_v2/JSv2.js";
import {InfoTracker} from "./InfoTracker.js";

function containsNode(nodelist: Node[], n: Node): boolean {
	let retVal = false;
	nodelist.forEach(v => {
		if (v.type == n.type && generate(v) == generate(n)) {
			retVal = true;
		}
	});
	return retVal;
}

function getReqPropertiesAccessed(ast: Program, listOfVars: string[], mapOfRPIs: { [id: string]: ReqPropInfo }): void {
	// let listOfProps = [];
	traverse(ast, {
		enter: (node, parent) => {
			switch (node.type) {
				case "MemberExpression":
					// console.log(node.object);
					if (node.object.type === "Identifier"
						&& node.property.type === "Identifier"
						&& listOfVars.includes(node.object.name)  /*containsNode( )*/) {
						// console.log(node.object.type)
						// listOfProps.push( node);
						let name = node.object.name
						if (!mapOfRPIs[name]) {
							mapOfRPIs[name] = {
								allAccessedProps: new Set(),
								potentialPrimProps: new Set(),
								refTypeProps: new Set()
							};
						}
						mapOfRPIs[name].allAccessedProps.add(node.property.name)
					}
					break;
			}
		}
	});
	// return listOfProps;
}

function getPropsCalledOrAccd(ast: Program, mapOfRPIs: { [id: string]: ReqPropInfo }): void {
	// let notPrimProps = []
	let nameS: string;
	traverse(ast, {
		enter: (node, parent) => {
			switch (node.type) {
				case "MemberExpression":
					if (node.object.type == "MemberExpression"
						&& node.object.object.type == "Identifier"
						&& node.property.type == "Identifier"
						&& node.object.property.type === "Identifier") {

						nameS = node.object.object.name;
						let key = node.object.property.name
						let value = node.property.name
						if (mapOfRPIs[nameS] && mapOfRPIs[nameS].allAccessedProps.has(key)) {
							// containsNode(mapOfRPIs[nameS].listOfAllPropsAccessed, node.object)) {
							// notPrimProps.push( node.object);
							mapOfRPIs[nameS].refTypeProps.add(key);
						}
					}
					break;
				case "CallExpression":
					if (node.callee.type == "MemberExpression"
						&& node.callee.object.type == "Identifier"
						&& node.callee.property.type == "Identifier") {

						nameS = node.callee.object.name;
						if (mapOfRPIs[nameS] && mapOfRPIs[nameS].allAccessedProps.has(node.callee.property.name)) {
							// notPrimProps.push( node.callee);
							mapOfRPIs[nameS].refTypeProps.add(
								node.callee.property.name);
						}
					}
					break;
			}
		}
	});
	// return notPrimProps;
}


function getReassignedProps(ast: Program, mapOfRPIs: { [id: string]: ReqPropInfo }) {
	let forcedDefault:boolean = false;

	traverse(ast, {
		enter: (node: Node, parent: Node | null) => {
			if (node.type === "AssignmentExpression"
				&& node.left.type === "MemberExpression"
				&& node.left.object.type === "Identifier"
				&& node.left.property.type === "Identifier") {
				let name = node.left.object.name;
				let prop = node.left.property.name;
				if (mapOfRPIs[name]&& mapOfRPIs[name].allAccessedProps.has(prop)) {
					forcedDefault = true;
				}


			}
		}
	});
	return forcedDefault;
}


export const reqPropertyInfoGather = (js: JSFile) => {
	let ast = js.getAST()
	let requireMgr: InfoTracker = js.getInfoTracker();
	let listOfVars = requireMgr.getIDs()

	let rpis: { [id: string]: ReqPropInfo } = {};

	getReqPropertiesAccessed(ast, listOfVars, rpis);
	getPropsCalledOrAccd(ast, rpis);
	let forcedDefault = getReassignedProps(ast,rpis)
	requireMgr.setForcedDecl(forcedDefault)
	for (let id in rpis) {
		let rpi = rpis[id];
		rpi.allAccessedProps.forEach(prop => {
			if (!rpi.refTypeProps.has(prop)) {
				rpi.potentialPrimProps.add(prop);
			}
		});
	}

	requireMgr.setReqPropsAccessedMap(rpis);

}

export interface ReqPropInfo {
	// listOfAllPropsAccessed: string[];
	allAccessedProps: Set<String>;
	// listOfPropsCalledOrAccessed: { key: string, value: string }[];
	refTypeProps: Set<String>;
	potentialPrimProps: Set<String>;
}
//
// let ast = parseScript(`
//
// var path = require('y')
// var http = require('z')
// var url = require('f')
// var {p,q,r} = require('t');
//
// path.join('c','u')
// path.join_()
// path.joinx.join()
// path.createPath('a',path.sep).z
//
// let _http = http
// _http(x.path.sep)
// var x= http._http
// path.y(q.z)
// http.s = false
//
// url(url.as_path)
// `)
//
//
// let listOfVars: string[] = ['url', 'http', 'path'];
// /*let idListOfVars: Identifier[] = listOfVars.map(e => {
// 	return {type: "Identifier", name: e}
// })*/
// let rpis: { [id: string]: ReqPropInfo } = {};
//
// getReqPropertiesAccessed(ast, listOfVars, rpis);
// getPropsCalledOrAccd(ast, rpis);
// getReassignedProps(ast, rpis)
// for (let id in rpis) {
// 	let rpi = rpis[id];
// 	rpi.allAccessedProps.forEach(prop => {
// 		if (!rpi.refTypeProps.has(prop)) {
// 			rpi.potentialPrimProps.add(prop);
// 		}
// 	});
// }



