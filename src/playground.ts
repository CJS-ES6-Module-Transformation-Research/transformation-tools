// #!/usr/local/bin/ts-node
import {generate} from "escodegen";
import {parseScript} from "esprima";
import {traverse} from "estraverse";
import {Expression, ExpressionStatement, Identifier, MemberExpression, Node, Program} from 'estree'

let ast: Program


ast = parseScript(`
var assert = require('assert')
    it('should get a package.json for the given project', function (cb) {
        repositoryURL('generate', function (err, url) {
            assert(!err);
            assert(url);
            assert.equal(url, 'https://github.com/generate/generate');
            cb();
        });
    });
    it('should handle errors', function (cb) {
        repositoryURL('fofofofofofoofofof', function (err, url) {
            assert(err);
            assert.equal(err.message, 'document not found');
            cb();
        });
    });
    it('should handle empty strings', function (cb) {
        repositoryURL('', function (err, url) {
            assert(err);
            assert(/expected/.test(err.message));
            cb();
        });
    });
    it('should handle scoped packages', function (cb) {
        repositoryURL('@cycle/core', function (err, url) {
            assert(!err);
            assert(url);
            assert.equal(url, 'https://github.com/cyclejs/core');
            cb();
        });
    });
    it('should handle promises', function () {
        return repositoryURL('@cycle/core').then(function (url) {
            assert(url);
            assert.equal(url, 'https://github.com/cyclejs/core');
        });
    });


`)
//
// import {parse, parseFile,SM } from 'spidermonkey'
// var sm = new SM({ shell: "js" });
// replace(ast, {
//     leave: (node: Node , parent) => {
//         if(node.type === "MemberExpression"
//         && node.object.type ==="Identifier"
//         && node.property.type ==="Identifier"){
//             // console.log(`node: ${node.property.name}  parent:${parent? parent.type :"p=null"}`)
//             return node.property
//         }
//     }
// })

function containsNode(nodelist: Node[], n: Node): boolean {
	let retVal = false;
	nodelist.forEach(v => {
		if (v.type == n.type && generate(v) == generate(n)) {
			retVal = true;
		}
	});
	return retVal;
}


ast = parseScript(`

path.join()
path.join

hello.world
a.b.c()
z.path.baolooga
z.path() 
a.b

`)


let stringList: string[] = ['path', 'hello', 'a']


function printER(node: MemberExpression | Identifier): string {
	switch (node.type) {
		case "Identifier":
			return node.name
		case "MemberExpression":
			return `${printER(node.object as (MemberExpression | Identifier))}.${printER(node.property as (MemberExpression | Identifier))}`
	}
	return "";
}

let listOfVars: Identifier[] = stringList.map(e => {
	return {
		type: "Identifier",
		name: e
	}
});

let mapOfRPIs: { [id: string]: ReqPropInfo2 } = {}

// getReqPropertiesAccessed(ast, listOfVars, mapOfRPIs)
// getPropsCalledOrAccd(ast, mapOfRPIs)
let line = (parseScript(
	`
a.b.c.d.g.f(x)
`
).body[0] as ExpressionStatement).expression as MemberExpression
// ast = parseScript(
// 	`
// a.b.c
// `
// )
function display(ex:Expression){
	let str:string = ''
	switch (ex.type) {
		case "MemberExpression":
			str = ` MemberExpression:`
			break;
		case "Identifier":
			str = ` Identifier:  ${ex.name}`
			break;
	}
	console.log(str)
}

// @ts-ignore
// display (line.object)
// // @ts-ignore
// display (line.object.object)
// @ts-ignore
// display (line.object.object.object)
// // @ts-ignore
// display (line.object.object.property)
// @ts-ignore
// display (line.object.property)
// display (line.property)
let w :{[key:string]:number }= {}
let lis:Identifier[] = []
function depthCharge(node:Node , i:number=0 ){
	let str = generate(node);
	// console.log(str)
	// console.log(node.type )
	if(!w[str]){
		w[str] = i;
	}
// if (!node){
// 	console.log(parent)
// 	console.log(generate(parent))
// }
	switch(node.type){
		case"MemberExpression":
			depthCharge(node.object,  i+1)
			depthCharge(node.property,  i+1)
			break;
		case "Identifier":
			lis.push(node)
			console.log(`Identifier with depth: ${i} and name ${node.name} `)
			break;
		case "CallExpression":
			depthCharge(node.callee, i+1 )
			node.arguments.forEach(	e =>depthCharge(e, i+1 ))
			break;
		case "Literal":
			break;
	}
}
depthCharge(line )
lis.map(e=>e.name)
console.log(lis[0])
//
// traverse(line,{enter:(node, parent ) =>{
// 	switch(node.type){
// 		case"MemberExpression":
// 			break;
// 		case "Identifier':
// 			break;
//
// 	}
//
// 	w[generate(node)] =
// 	} })

//
// console.log(line.object.type)
// // @ts-ignore
// console.log(line.object.object.type)
// // @ts-ignore
// // console.log(line.object.object)
// // @ts-ignore
// console.log(line.object.object.object.type)
// // @ts-ignore
// console.log(line.object.object.object.name)
// // @ts-ignore
// console.log(line.object.object.property.type)
// // @ts-ignore
// console.log(line.object.object.property.name)
// console.log(line.property.type)
// // @ts-ignore
// console.log(line.property.name)
// console.log(JSON.stringify(line,null,2) )
// function visitM(memex: MemberExpression) {
// 	if (memex) {
//
// 		if (memex.object.type === "MemberExpression") {
// 			visitM(memex.object as MemberExpression)
// 		}
//
// 		if (memex.property.type === "MemberExpression") {
// 			console.log('RECURSIVE_CALL')
// 			visitM(memex.property as MemberExpression)
// 		}
// 		console.log("display: " + generate(memex))
//
// 	}
// }
//
// visitM(line)
// listOfVars.forEach(e => console.log(e))
// console.log(s
// 	`
//
//
// buffer
//
//
//
// `
// )
//
// for (let key in mapOfRPIs) {
// 	let value = mapOfRPIs[key]
// 	console.log(`ALL_key: ${key}: ${value.listOfAllPropsAccessed
// 		// .reduce((previousValue: string, currentValue: MemberExpression | Identifier): string => {
// 		// 		return `${previousValue} ${printER(currentValue)}`
// 		// 	}, ""
// 		// )
// 		.reduce((previousValue: string, currentValue: MemberExpression  ): string => {
// 				return `${previousValue} ${printER(currentValue.object as Identifier | MemberExpression)}`
// 			}, ""
// 		)
// 	}`)
// 	console.log(`OBJ_key: ${key}: ${value.listOfPropsCalledOrAccessed
// 		.reduce(
// 			(previousValue: string, currentValue: MemberExpression ): string => {
// 			return `${previousValue} ${currentValue.object }`
// 		}
// 		// .reduce(
// 		// 	(previousValue: string, currentValue: MemberExpression | Identifier): string => {
// 		// 	return `${previousValue} ${printER(currentValue)}`
// 		// }
// 		, ""
// 	)}`)
// 	console.log()
// }


function getReqPropertiesAccessed(ast: Program, listOfVars: Identifier[], mapOfRPIs: { [id: string]: ReqPropInfo2 }): void {
	// let listOfProps = [];
	traverse(ast, {
		enter: (node, parent) => {
			switch (node.type) {
				case "MemberExpression":

					console.log("detected memex ");
					// console.log(node.object);
					if (containsNode(listOfVars, node.object)) {
						// listOfProps.push( node);
						if (!mapOfRPIs[(<Identifier>node.object).name]) {
							console.log('added map: ' + (<Identifier>node.object).name)
							mapOfRPIs[(<Identifier>node.object).name] = {
								listOfAllPropsAccessed: [],
								listOfPropsCalledOrAccessed: []
							};
						}
						mapOfRPIs[(<Identifier>node.object).name].listOfAllPropsAccessed.push(node)
					}
					break;
			}
		}
	});
	// return listOfProps;
}

export interface ReqPropInfo2 {
	listOfAllPropsAccessed: MemberExpression[];
	listOfPropsCalledOrAccessed: MemberExpression[];
}

function getPropsCalledOrAccd(ast: Program, mapOfRPIs: { [id: string]: ReqPropInfo2 }): void {
	// let notPrimProps = []
	let nameS: string;
	traverse(ast, {
		enter: (node, parent) => {
			switch (node.type) {
				case "MemberExpression":
					if (!(node.object.type == "MemberExpression" && node.object.object.type == "Identifier"))
						break;
					nameS = (<Identifier>(<MemberExpression>node.object).object).name;
					if (mapOfRPIs[nameS] && containsNode(mapOfRPIs[nameS].listOfAllPropsAccessed, node.object)) {
						// notPrimProps.push( node.object);
						mapOfRPIs[nameS].listOfPropsCalledOrAccessed.push(<MemberExpression>node.object);
					}
					break;
				case "CallExpression":
					if (!(node.callee.type == "MemberExpression" && node.callee.object.type == "Identifier"))
						break;
					nameS = (<Identifier>(<MemberExpression>node.callee).object).name;
					if (mapOfRPIs[nameS] && containsNode(mapOfRPIs[nameS].listOfAllPropsAccessed, node.callee)) {
						// notPrimProps.push( node.callee);
						mapOfRPIs[nameS].listOfPropsCalledOrAccessed.push(node.callee);
					}
					break;
			}
		}
	});
	// return notPrimProps;
}

// console.log(generate(ast))


// console.log(generate(ast,{comment:true}))
//
// ast = parseScript(
//     `
// //hello
// //attach?
// module.exports.x = 3
//
// // module.exports.y = {}
// // if(true){
// // module.exports = 33
// // }
//
// `, {comment: true, loc: true}
// )
// // console.log(JSON.stringify(ast ,null,3))
// traverse(ast, {
//     enter: (node, parentNode) => {
//         console.log(`type:${node.type}\t${node.leadingComments} > || > ${node.trailingComments }`)
//
//         node.trailingComments= [{type:"Line",value: "hello ",}]
//     }, leave: ( node, parentNode) => {
//
//     }
// })
// traverse(ast, {
//     enter: (node, parentNode) => {
//         console.log(`type:${node.type}\t${node.leadingComments} > || > ${node.trailingComments }`)
//     }, leave: ( node, parentNode) => {
//
//     }
// })
// let data_ = sm.parse(data)
// console.log(data_ )
// let q = (((((ast.body[0] as ExpressionStatement).expression)as AssignmentExpression).left)as MemberExpression)
// q.computed = true
// console.log(ast )
//
//
// const MODULE_EXPORTS: MemberExpression = {
//     type: "MemberExpression",
//     object: {
//         type: Syntax.Identifier,
//         name: "module"
//     },
//     property: {
//         type: Syntax.Identifier,
//         name: "exports"
//     },
//     computed: false
// }
//
// function EXPORTS_DOT(expr: Expression | string): MemberExpression {
//     let _expr
//     if (typeof expr === 'string') {
//         _expr = {
//             type: Syntax.Identifier,
//             name: expr
//         }
//     } else {
//         _expr = expr
//     }
//     return {
//         type: "MemberExpression",
//         object: {
//             type: Syntax.Identifier,
//             name: "exports"
//         },
//         property: _expr,
//         computed: false
//     };
// }
//
// let expr: Expression | string
// // console.log(typeof expr)
//

// console.log(ast.comments)
// console.log(JSON.stringify(ast,null,3))
// let disp = ast.body[0] as VariableDeclaration
// console.log(JSON.stringify(disp.declarations,null,3))




