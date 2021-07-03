import {AssignmentExpression, ExpressionStatement, Identifier, MemberExpression} from "estree";
import {ModuleDotExports} from "./helpers";

export interface ExportAssignmentStatement extends ExpressionStatement{
	expression:ExportAssignment
}
export interface ExportAssignment extends AssignmentExpression{
	operator:'=',
	left : LHSExport,
	right: Identifier

}
export interface LHSExport extends MemberExpression{
	object:ModuleDotExports | Identifier
	property:Identifier
	computed:false
}