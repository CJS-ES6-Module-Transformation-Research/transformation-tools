import {Program} from "esprima";
import {Visitor, VisitorOption} from "estraverse";
import {Node} from "estree";
import {Identifier} from "estree";
import { JSFile } from "./abstract_fs_v2/JSv2";

type WalkerType = void | Node | VisitorOption;
type Scope_Type = "top-level" | "function" | "block";
class VarTable{
	constructor(js:JSFile) {
	}
	private init(){
		// calls walk
	}
}
function varWalk(ast:Program){
	// const vt: VarTable= new VarTable(js)
	let visitor: Visitor = {enter:enterVarWalk}
}
function determineScope(parent: Node| null):Scope_Type| undefined{
	if (!parent.type){
		return undefined ;
	}
	switch(parent.type){
		case "BlockStatement":

	}

}
function enterVarWalk(node:Node, parent:Node|null):WalkerType{
switch (node.type) {
	case "BlockStatement":

		break;
}

	switch (node.type) {
		case "VariableDeclaration":
			break;
		case "FunctionDeclaration":
			break;
		case "ClassDeclaration":
			break;
		//TODO DEFAULT
	}


	return
}
interface Scope {
	scopeType : Scope_Type
	children:{[key:string]:Scope}
	declared_variables:string[]
	scope_id:string
	parent?: Scope
}
interface DeclaredVariable {
	scope:Scope
	name:string
	id:Identifier
}


function hasAScope(node:Node):boolean{
	let hasAScope:boolean = false;


	return hasAScope
}

var x = ""
switch(x) {
	case 'ForInStatement':
		break;
	case 'ForOfStatement':
		break;
	case 'ForStatement':
		break;
	case 'FunctionDeclaration':
		break;
	case 'FunctionExpression':
		break;
	case 'ArrowFunctionExpression':
		break;
	case 'ArrayExpression':
break;
	case 'CatchClause':
		break;

	case 'ArrayPattern':
		break;

	case 'AssignmentExpression':
		break;
	case 'AssignmentPattern':
		break;
	case 'AwaitExpression':
		break;
	case 'BinaryExpression':
		break;
	case 'BlockStatement':
		break;
	case 'BreakStatement':
		break;
	case 'CallExpression':
		break;

	case 'ClassBody':
		break;
	case 'ClassDeclaration':
		break;
	case 'ClassExpression':
		break;
	case 'ConditionalExpression':
		break;
	case 'ContinueStatement':
		break;
	case 'DebuggerStatement':
		break;
	case 'DoWhileStatement':
		break;
	case 'EmptyStatement':
		break;
	case 'ExportAllDeclaration':
		break;
	case 'ExportDefaultDeclaration':
		break;
	case 'ExportNamedDeclaration':
		break;
	case 'ExportSpecifier':
		break;
	case 'ExpressionStatement':
		break;

	case 'Identifier':
		break;
	case 'IfStatement':
		break;
	case 'Import':
		break;
	case 'ImportDeclaration':
		break;
	case 'ImportDefaultSpecifier':
		break;
	case 'ImportNamespaceSpecifier':
		break;
	case 'ImportSpecifier':
		break;
	case 'LabeledStatement':
		break;
	case 'Literal':
		break;
	case 'LogicalExpression':
		break;
	case 'MemberExpression':
		break;
	case 'MetaProperty':
		break;
	case 'MethodDefinition':
		break;
	case 'NewExpression':
		break;
	case 'ObjectExpression':
		break;
	case 'ObjectPattern':
		break;
	case 'Program':
		break;
	case 'Property':
		break;
	case 'RestElement':
		break;
	case 'ReturnStatement':
		break;
	case 'SequenceExpression':
		break;
	case 'SpreadElement':
		break;
	case 'Super':
		break;
	case 'SwitchCase':
		break;
	case 'SwitchStatement':
		break;
	case 'TaggedTemplateExpression':
		break;
	case 'TemplateElement':
		break;
	case 'TemplateLiteral':
		break;
	case 'ThisExpression':
		break;
	case 'ThrowStatement':
		break;
	case 'TryStatement':
		break;
	case 'UnaryExpression':
		break;
	case 'UpdateExpression':
		break;
	case 'VariableDeclaration':
		break;
	case 'VariableDeclarator':
		break;
	case 'WhileStatement':
		break;
	case 'WithStatement':
		break;
	case 'YieldExpression':
		break;
	default:
		//error
}